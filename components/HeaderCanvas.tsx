'use client'
import { useRef, useMemo } from "react"
import { Cloud, Clouds } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, BoxGeometry, MeshPhysicalMaterial, Vector3, Color, SphereGeometry, SpotLight } from "three"
import Map3D from "./Map3D"
import { Globe } from "./Globe"

const mat = new MeshStandardMaterial({roughness: 0.6, metalness: 0.3, emissiveIntensity:2, color:0x004071})
const target = new Mesh(new SphereGeometry(1, 50, 50), mat)
target.position.set(0, -2, -1)
target.receiveShadow = true
target.castShadow = true

const spotLight = new SpotLight(0xffffff, 5, 100, Math.PI / 2,)


export const HeaderCanvas = () => {

  
  return (
    <div className="absolute -top-100 left-0 w-full h-[120%] -z-10">
      <Canvas shadows="basic">
        {/* <ambientLight/> */}
        <hemisphereLight
        // color="white" 
        color="#E4203E" 
        intensity={1.5} />
        <spotLight position={[0,3,2]} intensity={5} color="white" target={target} castShadow angle={Math.PI/2}/>
        <primitive object={target} />
        <Clouds material={MeshStandardMaterial} castShadow receiveShadow />
        <Cloud segments={40} bounds={[5, .1, 1]} volume={40} 
        concentrate="outside"
        // color="#E4203E" 
        color="white"
        castShadow
        receiveShadow
        growth={6}
        speed={.15} opacity={.015} 
        // scale={[0.125, 0.125, 0.125]} 
        scale={[.5, .5, .5]} position={[0, 0, -1]}
        />
        {/* <Cloud segments={20} bounds={[20, 4, 4]} 
        growth={10}
        volume={40} color="#004071" speed={.3} seed={1234} opacity={.5} scale={20}/> */}
        {/* <mesh>
          <sphereGeometry/>
          <meshBasicMaterial/>
        </mesh> */}
        <Clouds/>
        {/* <Globe/> */}
      </Canvas>
    </div>
  )
}