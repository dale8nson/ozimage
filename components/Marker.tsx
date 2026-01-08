'use client'
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import gsap, { useGSAP } from "@gsap/react"

useLoader.preload(GLTFLoader, '/uploads_files_6461808_11_Location.glb')

export const Marker = ({ lat, lon }: { lat: number, lon: number }) => {
  const marker = useLoader(GLTFLoader, '/uploads_files_6461808_11_Location.glb')


  return (
    <mesh name="mark" scale={[1.25, 1.25, 1.25]}
      rotation={[0.125 * Math.PI, 0, 0]}
      position={[lon / 180 * 54, lat / 90 * 27, 1]}
      geometry={marker.meshes.texture_pbr_v128001.geometry}
    >
      <meshStandardMaterial
        name="mark-material"
        color={0x0000ff}
        metalness={0.5}
        roughness={0}
        transparent
        opacity={0}
      // wireframe
      />
    </mesh>
  )
}