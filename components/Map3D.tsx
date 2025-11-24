'use client'
import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { Globe } from './Globe'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setGlobeQuat } from '@/lib/features/root/rootSlice'
import { Quaternion } from 'three'


// let mat = new MeshStandardMaterial({displacementMap: "/etopo1_4096x2048.tif"})
// 25.2744° S, 133.7751° E
export default function Map3D() {
  const dispatch = useAppDispatch()
  const globeQuat = useAppSelector(state => state.globeQuat)

  return (
    <div className="relative flex-col w-full h-full justify-center items-center">
      <Canvas>
        <ambientLight intensity={0.7} />
        <PerspectiveCamera name='cam' makeDefault position={[0, 0, 3]} >
          <directionalLight args={[0xffffff, 0.5]}
            name='sunshine'
            position={[0, 0, 3.1]}
          />
        </PerspectiveCamera>
        {/* <Suspense fallback={(
      <mesh name='earth'
      scale={[10, 10, 10]} position={[0, 0, 0]} rotation={[0, 0, 0]}
      >
      <sphereGeometry args={[36, 18]} />
      <meshBasicMaterial
        wireframe
        color={0x0000ff}
      />
    </mesh>
    )}> */}
        <Globe />
        {/* </Suspense> */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls target={[0, 0, 0]} onChange={e => {
          const globe = e?.target.object.parent?.getObjectByName('cam')
          dispatch(setGlobeQuat(globe?.getWorldQuaternion(new Quaternion()).toArray()))
        }}
          // autoRotate 
          enableZoom={false}
        />
      </Canvas>
      {/* <div className="absolute top-0 right-0 flex justify-start items-center">
        <p className="text-white text-xl">{`x: ${globeQuat[0]} y: ${globeQuat[1]} z: ${globeQuat[2]} w: ${globeQuat[3]}`}</p>
      </div> */}
    </div>
  )
}