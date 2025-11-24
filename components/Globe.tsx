'use client'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { Line as LineMesh, Sky, useGLTF } from '@react-three/drei';
import { useThree, useLoader, extend } from '@react-three/fiber';
import { TextureLoader, Mesh, Matrix4, BackSide, Euler, Vector3, Quaternion } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { setGlobeQuat } from '@/lib/features/root/rootSlice';
import { useState, Suspense } from 'react';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

extend({ LineGeometry })

useLoader.preload(GLTFLoader, '/globe.glb')
useLoader.preload(TextureLoader, '/globe_diffuse_ne2.jpg')
useLoader.preload(TextureLoader, '/globe_height.png')

const latLon2Vec3 = (lat: number, lon: number) => {
  const lonRad = lon * Math.PI / 180
  const latRad = lat * Math.PI / 180
  const cosX = Math.cos(lonRad)
  console.log(`cos(${lon}deg): ${cosX}`)
  const lonSinZ = Math.sin(lonRad)
  const latSinZ = Math.sin(latRad)
  const sinY = Math.sin(latRad)
  const cosY = Math.cos(latRad)
  

  const lonVec = new Vector3(-cosX, 1, lonSinZ)    // if lon = 0 then (1, 1, 0)  if lon = 90 then (0, 1, 1)
  console.log(`lonVec: `, lonVec)              // if lat = 0 then (1, 0, 1)                   (1, 0, 1)
  const latVec = new Vector3(1, sinY, 1)          //               = (1, 0, 0)                   (0, 0, 1)
  console.log(`latVec: `, latVec)
  return new Vector3().multiplyVectors(lonVec, latVec).toArray()
}

export const Globe = () => {
  
  const currentCoords = useAppSelector(state => state.currentCoords)
  // console.log(`currentCoords: `, currentCoords)
  const { value } = currentCoords[0]
  const [lat, lon] = value

  const { scene } = useThree()
  gsap.registerPlugin(useGSAP)
  const gltf = useLoader(GLTFLoader, '/globe.glb')
  const diffuse = useLoader(TextureLoader, "/globe_diffuse_ne2.jpg")
  diffuse.setValues({ flipY: false })
  const displacementMap = useLoader(TextureLoader, "/globe_height.png")
  displacementMap.setValues({ flipY: false })

  useGSAP(() => {
    console.log(`lon: ${lon}  lat: ${lat}`)
    if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon)) return
    const cam = scene.getObjectByName('cam') as Mesh
    if (!cam) return
    const globe = scene.getObjectByName('earth')
    if(!globe) return
    const origin = new Vector3(0, 0, 0)
    const target = origin.clone()
    const position = origin.clone()
  
    cam.getWorldPosition(position)
    let dist = cam.position.distanceTo(origin)
    

    let degY = 0
    let degX = 0

    console.log('globe: ', cam)
    if (!Object.hasOwn(cam, 'rotY')) {
      
      const u = new Vector3()
      const q = new Quaternion()
      const dir = new Vector3()
      
      // cam.matrixWorldAutoUpdate = false
      // cam.matrixAutoUpdate = false
      
      Object.defineProperties(cam, {
        x: {
          get: () => cam.position.x,
          set: (x) =>{
            cam.position.setX(x)
          }
        },
        y: {
          get: () => cam.position.y,
          set: (y) => {
            cam.position.setY(y)
          }
        },
        z: {
          get: () => cam.position.z,
          set: (z) =>{ 
            cam.position.setZ(z)
          }
        },
        rotX: {
          get: () => degX,
          set: (theta) => {

            u.copy(target)
            const [ux, uy, uz] = u.multiplyScalar(Math.sin(-theta / 2)).toArray()
            const w = Math.cos(-theta / 2)
            q.set(ux, uy, uz, w)
            cam.setRotationFromQuaternion(q)

            const [x, y, z] = latLon2Vec3(theta, degY).map(n => n * dist)
            console.log(`degX: ${degX}  degY: ${degY}`)
            cam.position.set(x, y, z)
            degX = theta
           
          }
        },
        rotY: {
          get: () =>  degY,
          set: (theta) => {
            
            u.copy(target)
            const [ux, uy, uz] = u.multiplyScalar(Math.sin(theta / 2)).toArray()
            const w = Math.cos(theta / 2)
            q.set(ux, uy, uz, w)
            cam.setRotationFromQuaternion(q)

            const [x, y, z] = latLon2Vec3(degX, theta).map(n => n * dist)
            console.log(`degX: ${degX}  degY: ${degY}`) 
            cam.position.set(x, y, z)

            degY = theta
          }
        },
        rotZ: {
          get: () => position.z,
          set: (theta) => {
            
            const dist = position.distanceTo(origin)

            u.set(0, 0, 1)
            const [ux, uy, uz] = u.multiplyScalar(Math.sin(theta / 2)).toArray()
            const w = Math.cos(theta / 2)
            q.set(ux, uy, uz, w)
            cam.setRotationFromQuaternion(q)

          }
        },
        distance: {
          get: () => dist,
          set: (s) => {
            const [x, y, z] = latLon2Vec3(degX, degY).map(n => n * s)
            // const [dx, dy, dz] = cam.getWorldDirection(target).toArray()
            const theta = cam.position.angleTo(target)
            u.set(x, y, z)
            const [ux, uy, uz] = u.multiplyScalar(Math.sin(theta / 2)).toArray()
            const w = Math.cos(theta / 2)
            q.set(ux, uy, uz, w)
            cam.setRotationFromQuaternion(q)
            cam.position.set(x, y, z) 
            dist = s
          }
        }
      })
      // -25.2744, 133.7751

    }
    
    const tl = gsap.timeline()
    if (cam.distance < 3) tl.to(cam, {distance: 3, duration: 1.5, ease: "power1.inOut"})
    tl.to(cam, { rotY: lon, duration: 1.5, ease: "power1.inOut" })
    
    tl.to(cam, { rotX: lat, duration: 1.5, ease: "power1.inOut" })
    target.copy(new Vector3().fromArray(latLon2Vec3(lat, lon)))
    dist = cam.position.distanceTo(target)
    tl.to(cam, {distance: 1.125, duration: 2.5, ease:"power1.inOut"})

  }, [lat, lon])

  return (
    <Suspense fallback={(
      <mesh
        scale={[1, 1, 1]} position={[0, 0, 0]} rotation={[0, 0, 0]}
      >
        <sphereGeometry args={[36, 18]} />
        <meshBasicMaterial
          wireframe
          color={0x0000ff}
        />
      </mesh>
    )}>

      <mesh name='earth'
        scale={[-1, 1, 1]} position={[0, 0, 0]} rotation={[0, 0, 0]}
        castShadow
        geometry={gltf.meshes.mesh_0.geometry}
      >
        {/* <sphereGeometry args={[32, 16]} />
      <meshBasicMaterial 
        wireframe
        color={0x0000ff}
        // side={BackSide}
      /> */}
        <meshStandardMaterial map={diffuse}
          // displacementMap={displacementMap}
          // displacementScale={0.025}
          bumpMap={displacementMap}
          bumpScale={1.5}
          side={BackSide}
          metalness={0.0}
          roughness={1}
        // wireframe
        // color={0x0000ff}
        />
        {/* <arrowHelper args={[new Vector3(1,0,0), new Vector3(0,0,0), 1.75, 0x0000ff, 0.2]} />
        <arrowHelper args={[new Vector3(0,1,0), new Vector3(0,0,0), 1.75, 0x00ff00, 0.2]} />
        <arrowHelper args={[new Vector3(0,0,1), new Vector3(0,0,0), 1.75, 0xff0000, 0.2]} /> */}
      </mesh>
    </Suspense>
  )
}

