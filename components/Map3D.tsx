'use client'
import { Suspense, use, useEffect, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Gltf, OrbitControls, PerspectiveCamera, Stars, Text, useGLTF } from '@react-three/drei'
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import { BackSide, FrontSide, Matrix4, Mesh, MeshStandardMaterial, Object3D, Object3DEventMap, Scene, TextureLoader, Vector3 } from 'three'



// let mat = new MeshStandardMaterial({displacementMap: "/etopo1_4096x2048.tif"})
// 25.2744° S, 133.7751° E
export default function Map3D({lat = 133.7751 , lon = -25.2744}: {lat: number, lon: number}) {

  const ref = useRef<HTMLCanvasElement | null>(null)

  // useGLTF.preload('/globe.glb')
  const gltf = useGLTF('/globe.glb')
  const diffuse = useLoader(TextureLoader, "/globe_diffuse_ne2.jpg")
  diffuse.setValues({flipY: false})
  const displacementMap = useLoader(TextureLoader, "/globe_height.png")
  displacementMap.setValues({flipY: false})

  const target = new Object3D()
  target.applyMatrix4(new Matrix4().setPosition(new Vector3(0, 0, 0)))
  
  console.log(gltf.meshes)
  // const mat = new MeshStandardMaterial({displacementMap: displacementMap})

  const rotate = (delta: number, globe: Mesh, yDeg: number) => {
      
      console.log(`globe: `, globe)
      const rotation = globe.rotation
      if (rotation.y !== yDeg) {
        globe.rotateY((yDeg - rotation.y) < 1 ? -2 * Math.PI / 180 : 2 * Math.PI / 180)
        requestAnimationFrame((delta) => rotate(delta, globe, yDeg))
      }
    }

  const onAfterRender = (_: any, scene: Scene) => {
    const yDeg = ((lat + 180) / 360 * Math.PI / 180)
    const globe = scene.getObjectByName('earth') as Mesh
    if(!globe) return
    requestAnimationFrame((delta) => rotate(delta, globe, yDeg))
  }

  return (
    <Canvas 
    // camera={{ position: [0, 0, 2.5], fov: 50, name: 'cam', parent:new Object3D().getObjectByName('sunshine') }}
    >
      {/* <Suspense 
      // fallback={<Text color="0x000000" >LOADING...</Text>}
      fallback={null}
      > */}
      <PerspectiveCamera makeDefault position={[0, 0, 3]} >
      {/* <ambientLight intensity={0.7} /> */}
      <directionalLight args={[0xffffff, 0.5]}
      name='sunshine' 
      position={[0, 0, -3.1]}
      target={new Object3D().getObjectByName('earth')} />
      </PerspectiveCamera>
          {/* <group> */}
            <mesh name='earth' 
            // onAfterRender={onAfterRender}  
            geometry={gltf.meshes.mesh_0.geometry} scale={[-1, 1, 1]} position={[0, 0, 0]}>
            <meshStandardMaterial map={diffuse} 
            displacementMap={displacementMap}
            displacementScale={0.01} 
            // bumpMap={displacementMap}
            // bumpScale={0.5}
            side={BackSide} 
            metalness={0.0}
            roughness={1}
             />
            </mesh>
          {/* </group> */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls target={[0, 0, 0]} 
      // autoRotate 
      enableZoom={true} 
      />
      {/* </Suspense> */}
    </Canvas>
  )
}