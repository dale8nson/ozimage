'use client'
import { Suspense } from 'react'

import { Canvas, extend } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars, CameraControls, CameraControlsImpl, Instances, Loader } from '@react-three/drei'
import { Globe } from './Globe'
import { BackSide, DoubleSide, Quaternion, Vector3, Object3D } from 'three'
import * as Cesium from 'cesium'
import { Map2D } from './Map2D'
import { Markers } from './Markers'

const { ACTION } = CameraControlsImpl

// studio.initialize()
// studio.extend(extension)

// const demoSheet = getProject('Demo Project').sheet('Demo Sheet')

// 25.2744° S, 133.7751° E
export default function Map3D(
  {coords}:{coords:Promise<Coords[]>}
  // { apiToken: token, tileset: ts }: { apiToken: Promise<string | undefined>, tileset: Promise<Cesium.Cesium3DTileset> }
) {

  // coords = fetch("http://localhost:3000/api/coords").then(res => res.json())
  const target = new Object3D()
  target.position.set(0, 0, 0)

  return (
    <div className="relative flex-col w-full h-screen justify-center items-center z-10 m-0">
      <div className="relative flex-col w-full h-full justify-center items-center z-10 m-auto object-cover ">
        <Canvas className="relative w-full h-full aspect-square z-0" gl={{preserveDrawingBuffer: false}}>
          {/* <SheetProvider sheet={demoSheet}> */}
            <ambientLight intensity={0.7}  />
            <hemisphereLight/>
            <PerspectiveCamera 
            // ref={setCam} 
            name='cam' makeDefault 
            // position={[0, 0, 3]} 
            position={[0, 0, 30]}
            >
              {/* { cam && <CameraControls camera={cam} mouseButtons={{
                left: ACTION.OFFSET,
                middle: ACTION.NONE,
                right: ACTION.NONE,
                wheel: ACTION.NONE 
              }}  />} */}
              <directionalLight args={[0x816E57, 0.7]}
                name='sunshine'
                position={[0, 0.3, -3]}
                // target={target}
                intensity={0.7}
                // angle={Math.PI / 2}
              />
            </PerspectiveCamera>
            {/* <GlobeControls enableDamping={ true } /> */}
            {/* <OrbitControls target={[0, 0, 0]}
            // autoRotate 
            // enableZoom={false}
            /> */}
            <Suspense>
              {/* <Globe /> */}
              <Map2D/>
            </Suspense>
            {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
            
          {/* </SheetProvider> */}
          <Suspense>
            <Markers locations={coords}/>
            </Suspense>
        </Canvas>
        <Loader/>
      </div>
    </div>
  )
}


// url={`https://api.cesium.com/v1/assets/endpoint?access_token="${apiToken}&asset_id=${assetId}"`}

{/* <TilesRenderer url={`https://api.cesium.com/v1/assets/${assetId}/endpoint`} group={{
            position: [0, 10, 0],
            rotation: [Math.PI / 2, 0, 0],
          }} 
          key={apiToken + assetId}
          >
            <TilesPlugin plugin={CesiumIonAuthPlugin} args={[{ apiToken, assetId }]} />
            <TilesAttributionOverlay generateAttributions={null} />
            <EastNorthUpFrame
              lat={0}
              lon={0}
              height={10}
              az={0}
              el={0}
              roll={0}
            >
              <mesh rotation-x={- Math.PI / 2} scale={[100, 100, 100]} position={[0, 0, 0]} position-z={50}>
                <coneGeometry args={[0.5]} />
                <meshStandardMaterial color={'red'} wireframe />
              </mesh>
              </EastNorthUpFrame>
          </TilesRenderer> */}
