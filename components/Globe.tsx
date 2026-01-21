'use client'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { Line as LineMesh, Sky, Stars, useGLTF, Text3D, Text, Center } from '@react-three/drei';
import { useThree, useLoader, extend } from '@react-three/fiber';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TextureLoader, Mesh, Matrix4, BackSide, Euler, Vector3, Quaternion, MeshStandardMaterial, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { useState, Suspense, use, useMemo } from 'react';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TilesRenderer, TilesPlugin, TilesAttributionOverlay, EastNorthUpFrame } from '3d-tiles-renderer/r3f'
import * as Cesium from 'cesium'
import { CesiumIonAuthPlugin, GLTFExtensionsPlugin } from '3d-tiles-renderer/plugins'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


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

class EnhancedObject3D extends Object3D {

  readonly isEnhancedObject3D: boolean = true

  private u: Vector3 = new Vector3()
  private q = new Quaternion()
  private dir = new Vector3()
  private origin = new Vector3()
  private degX: number = 0
  private degY: number = 0
  private dist: number = 0
  private target: Vector3 = new Vector3()
  obj: Object3D

  get distance() {return this.dist }
  set distance(s) {
    const [x, y, z] = latLon2Vec3(this.degX, this.degY).map(n => n * s)
    // const [dx, dy, dz] = cam.getWorldDirection(target).toArray()
    // const theta = this.position.angleTo(target)
    // this.u.set(x, y, z)
    // const [ux, uy, uz] = this.u.multiplyScalar(Math.sin(theta / 2)).toArray()
    // const w = Math.cos(theta / 2)
    // this.q.set(ux, uy, uz, w)
    // this.setRotationFromQuaternion(this.q)
    this.obj.position.set(x, y, z)
    this.dist = s
  }
  
  constructor(obj: Object3D) {
    super()
    this.obj = obj
    
    Object.defineProperties(this,
      {
        x: {
          get: () => this.obj.position.x ?? 0,
          set: (x) => {
            this.obj.position.setX(x)
          }
        },
        y: {
          get: () => this.obj.position.y ?? 0,
          set: (y) => {
            this.obj.position.setY(y)
          }
        },
        z: {
          get: () => this.obj.position.z ?? 0,
          set: (z) => {
            this.obj.position.setZ(z)
          }
        },
        rotX: {
          get: () => this.degX,
          set: (deg) => {
            const theta = deg * Math.PI / 180
            // const thetaY = degY * Math.PI / 180
            // this.u.copy(this.obj.quaternion)
            // const [ux, uy, uz] = this.u.multiplyScalar(Math.sin(theta / 2)).toArray()
            // const w = Math.cos(theta / 2)
            // this.q.set(ux, uy, uz, w)
            // this.obj.setRotationFromQuaternion(this.q)
            this.obj.lookAt(this.origin)

            const [x, y, z] = latLon2Vec3(deg, this.degY).map(n => n * this.dist)
            console.log(`degX: ${this.degX}  degY: ${this.degY}`)
            this.obj.position.set(x, y, z)
            this.degX = deg

          }
        },
        rotY: {
          get: () => this.degY,
          set: (deg) => {
            const theta = deg * Math.PI / 180 + Math.PI * 2
            this.obj.lookAt(this.origin)
            // this.u.copy(this.target)
            // const [ux, uy, uz] = this.u.multiplyScalar(Math.sin(theta / 2)).toArray()
            // const w = Math.cos(theta / 2)
            // this.q.set(ux, uy, uz, w)
            // this.obj.setRotationFromQuaternion(this.q)

            const [x, y, z] = latLon2Vec3(this.degX, deg).map(n => n * this.dist)
            console.log(`degX: ${this.degX}  degY: ${this.degY}`)
            this.obj.position.set(x, y, z)
            this.degY = deg
          }
        },
        rotZ: {
          get: () => this.position.z,
          set: (theta) => {

            const dist = this.position.distanceTo(this.origin)

            this.u.set(0, 0, 1)
            const [ux, uy, uz] = this.u.multiplyScalar(Math.sin(theta / 2)).toArray()
            const w = Math.cos(theta / 2)
            this.q.set(ux, uy, uz, w)
            this.obj.setRotationFromQuaternion(this.q)
          }
        },
        distance: {
          get: () => this.dist,
          set: (s) => {
            const [x, y, z] = latLon2Vec3(this.degX, this.degY).map(n => n * s)
            // const [dx, dy, dz] = cam.getWorldDirection(target).toArray()
            // const theta = this.position.angleTo(target)
            // this.u.set(x, y, z)
            // const [ux, uy, uz] = this.u.multiplyScalar(Math.sin(theta / 2)).toArray()
            // const w = Math.cos(theta / 2)
            // this.q.set(ux, uy, uz, w)
            // this.setRotationFromQuaternion(this.q)
            this.obj.position.set(x, y, z)
            this.dist = s
          }

        }
      }
    )
    return this
  }
}

export const Globe = () => {

  const currentCoords = useAppSelector(state => state.currentCoords)
  const { key, value } = currentCoords?.[0] as Coords
  const [lat, lon] = value as [number, number]
  const [label, setLabel] = useState("Australia")
  const origin = new Vector3()
  // console.log(`currentCoords: `, currentCoords)

  const { scene } = useThree()

  // const cam = useMemo(() => new EnhancedObject3D(scene.getObjectByName('cam') as Mesh), [])

  gsap.registerPlugin(useGSAP)
  const gltf = useLoader(GLTFLoader, '/globe.glb')
  const diffuse = useLoader(TextureLoader, "/globe_diffuse_ne2.jpg")
  diffuse.setValues({ flipY: false })
  const displacementMap = useLoader(TextureLoader, "/globe_height.png")
  displacementMap.setValues({ flipY: false })

  const tl = gsap.timeline()

  useGSAP(() => {
    // console.log(`lon: ${lon}  lat: ${lat}`)
    if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon)) return
    const cam = new EnhancedObject3D(scene.getObjectByName('cam') as Mesh)
    if (!cam) return
    
    // if (!text) return
    const origin = new Vector3(0, 0, 0)
    const target = origin.clone()
    const targetQuat = new Quaternion()
    const position = origin.clone()
    const textRot = new Vector3()
    

    cam.getWorldPosition(position)
    let dist = cam.position.distanceTo(origin)

    // let degY = 0
    // let degX = 0

    console.log('globe: ', cam)

    if (cam.distance !== 3) tl.to(cam, { distance: 3, duration: 1.5, ease: "power1.inOut" })
    tl.to(cam, { rotY: lon, duration: 1.5, ease: "power1.inOut" })

    tl.to(cam, { rotX: lat, duration: 1.5, ease: "power1.inOut" })
    target.copy(new Vector3().fromArray(latLon2Vec3(lat, lon)))
    dist = cam.position.distanceTo(target)
    tl.to(cam, { distance: 1.125, duration: 2.5, ease: "power1.inOut" })

    // text.obj.applyQuaternion(rotQuat)
    // tl.set(text, { x, y, z, rotX: lat, rotY: lon })

    setLabel(key)

  }, [lat, lon])

  useGSAP(() => {
    const text = new EnhancedObject3D(scene.getObjectByName('text') as Object3D)
    const cam = new EnhancedObject3D(scene.getObjectByName('cam') as Object3D)

    if (!text || !cam) return
    const [x, y, z] = latLon2Vec3(lat as number, lon as number)
    // text.obj.quaternion.setFromRotationMatrix(new Matrix4().lookAt(text.obj.position, cam.obj.position, new Vector3(0, 1, 0)))
    const rotQuat = new Quaternion()
    const textTheta = new Vector3().fromArray([x, y, z]).angleTo(origin)
    if (!textTheta) return
    const [qx, qy, qz] = [x, y, z].map(n => n * Math.sin(textTheta / 2))
    const qw = Math.cos(textTheta / 2)
    rotQuat.set(qx, qy, qz, qw)
    tl.to(text, {x, y, z, rotY: -lon as number, duration: 1.5})
  }, [label])

  return (
    <>
      <spotLight position={[-5, 2, -4]} />
      <mesh name='earth'
        scale={[-17, 17, 17]} position={[0, -20, -5]} rotation={[0, 0, 0]}
        castShadow
        geometry={gltf.meshes.mesh_0.geometry}
      >
        <meshPhysicalMaterial map={diffuse}
          
          // displacementMap={displacementMap}
          // displacementScale={0.025}
          // bumpMap={displacementMap}
          // bumpScale={1.5}
          side={BackSide}
          metalness={0.7}
          roughness={0.9}
          // wireframe
        // color={0x0000ff}
        />
      </mesh>
        {/* <Text3D name="text" scale={[-.025, .025, .025]}  font={"/Noto_Sans_Black_Regular.json"}>{label}</Text3D> */}
    </>
  )
}


{/* <arrowHelper args={[new Vector3(1,0,0), new Vector3(0,0,0), 1.75, 0x0000ff, 0.2]} />
        <arrowHelper args={[new Vector3(0,1,0), new Vector3(0,0,0), 1.75, 0x00ff00, 0.2]} />
        <arrowHelper args={[new Vector3(0,0,1), new Vector3(0,0,0), 1.75, 0xff0000, 0.2]} /> */}

