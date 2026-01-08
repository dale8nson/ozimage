
"use client"
import { Instances, Instance } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { useAppSelector } from "@/lib/hooks"
import { useLoader, useThree } from '@react-three/fiber';
import { use, useEffect, useMemo, useRef } from "react";
import gsap, { useGSAP } from '@gsap/react';
import { Text } from "./Text";
import { getCoords } from "@/lib/server";
import { Box3, Matrix4, Mesh, Vector3 } from "three";

useLoader.preload(FBXLoader, '/cc0-pin-2/source/Pin2.fbx')
export const Markers = ({ locations }: { locations: Promise<Coords[]> }) => {
  const marker = useLoader(FBXLoader, '/cc0-pin-2/source/Pin2.fbx')
  // console.log(`Marker: `, marker)
  const bbs = useRef<Box3[]>([])
  const { scene } = useThree()
  // if (!locations) return
  const coords = use(locations)
  
  // const coords: {[postId:number]: Coords[]} = useAppSelector(state => state.coords)

  // console.log(`marker: `, marker)
  // const coords = use(getCoords())
  // console.log(`coords: `, coords)
  // useLoader(GLTFLoader, '/uploads_files_6461808_11_Location.glb')

  const Θ = Math.PI / 180 * 0 * 15

  const cos = Math.cos
  const sin = Math.sin
  const dy = 0.3962228298187256
  // const pinRotationMatrix = new Matrix4(
  //   1, 0, 0, 0,
  //   cos(Θ), sin(Θ), 0, 0.5 * cos(Θ) + sin(Θ) - 0.5,
  //   -sin(Θ), cos(Θ), 0, 0.5 * -sin(Θ) + cos(Θ),
  //   0, 0, 0, 1
  // )



  const pinRotationMatrix = new Matrix4(
    1, 0, 0, 0,
    cos(Θ), sin(Θ), 0, dy *cos(Θ) + sin(Θ) - dy,
    -sin(Θ), cos(Θ), 1, dy * -sin(Θ) + cos(Θ),
    0, 0, 0, 1
  )

  const id = new Matrix4()

  const negId = new Matrix4(
    -1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, -1, 0,
    0, 0, 0, 1
  )

  const translateMatrix = new Matrix4(
    1, 0, 0, 0,
    0, 1, 0, 0.5,
    0, 0, 1, 0,
    0, 0, 0, 1
  )


  useEffect(() => {
    if(!coords) return
    coords.forEach((coord, idx) => {
      const markerObj = scene.getObjectByName(`${coord.key}-${idx}`) as Mesh
      if (markerObj) {
        const matrix = markerObj.matrix
        // console.log(`matrix: `, matrix)
        
        markerObj.geometry.computeBoundingBox()
        const bb = markerObj.geometry.boundingBox
        // const bb = marker.geometry.boundingBox
        if (bb) {

          // const dx = bb?.max.x - bb?.min.x
          // const dy = bb?.max.y - bb?.min.y
          // const dy = coord.value[0]
          // const dz = bb?.max.z - bb?.min.z 

          const [dx, dy, dz] = markerObj.position

          pinRotationMatrix.set(
            1, 0, 0, 0,
            0, cos(Θ), -sin(Θ), dy *(1 - cos(Θ)) + dz * sin(Θ),
            0, sin(Θ), cos(Θ), dz * (1 - cos(Θ)) + dy * sin(Θ),
            0, 0, 0, 1
          ).multiply(negId)

          // console.log(`markerObj.position: `, markerObj.position)

          markerObj.position.applyMatrix4(pinRotationMatrix)

          // console.log(`width: ${width} height: ${height}`)
          // bbs.current.forEach(box => {

          // })
          // bbs.current.push(bb)
        }
      }
    }
    )
  }, [coords])

  // console.log(`Markers coords: `, coords)

  // const markers = useMemo(() => coords?.map((coord, idx) => {
  //   const label = coord.key
  //   const [lat, lon] = coord.value
  //   if (!lat || !lon) return

  //   return (
  //     <Instance name={`${label}-${idx}`} key={`${idx}`} scale={[0.4, -0.4, 0.4]} position={[lon / 180 * 54, lat / 90 * 27, .1]} rotation={[-Math.PI, 0, 0]}>
  //       <Text label={label} position={new Vector3(-0.75, 1, 0)} />
  //     </Instance>
  //   )

  // }), [coords])

  return (
    <Instances castShadow>
      {/* <group> */}
      {/* <mesh geometry={marker.children[0].geometry} material={marker.children[0].material} > */}
      <primitive object={marker.children[0].geometry} />
      {/* <primitive object={marker.children[0].material} /> */}
      {/* <primitive object={marker.children[0]} /> */}
      <meshStandardMaterial
        color={0xff0000}
        metalness={0.8}
        roughness={0.5}
        transparent
        opacity={1}
      // wireframe
      />
      {/* </mesh> */}
      {/* </group> */}
      {coords?.map((coord, idx) => {
    const label = coord.key
    const [lat, lon] = coord.value
    if (!lat || !lon) return

    return (
      <Instance name={`${label}-${idx}`} key={`${idx}`} scale={[0.4, 0.4, 0.4]} position={[lon / 180 * 54, lat / 90 * 27, .1]} 
      // rotation={[-Math.PI, 0, 0]}
      >
        <Text label={label} position={new Vector3(-0.75, 1, 0)} />
      </Instance>
    )

  })
      }
    </Instances>
  )
}