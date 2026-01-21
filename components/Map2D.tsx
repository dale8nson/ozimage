'use client'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react';
import { Text3D, Loader, Image, shaderMaterial } from '@react-three/drei';
import { useThree, useLoader, extend, useFrame } from '@react-three/fiber';
import { TextureLoader, Vector3, FrontSide, Mesh, Material, Matrix4, ShaderMaterial, Texture } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useAppSelector } from '@/lib/hooks';
import { useState, useRef, useEffect } from 'react';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Text } from './Text';

const PerlinMaterial = shaderMaterial({grid_x: 100, grid_y: 100, grid_z: 40, map: new Texture<HTMLImageElement>(), delta: 0}, `varying vec2 vUv;

void main() {

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  // gl_Position = vec4( position, 1.0 );
}`, `
uniform float delta;
uniform uint grid_x;
uniform uint grid_y;
uniform uint grid_z;
uniform sampler2D map;
// uniform vec3 threshold;

varying vec2 vUv;

highp float random(vec2 uv) {
    highp float dt = dot(uv, vec2(12.9898, 78.233));
    highp float sn = mod(dt, 3.141592654);
    return fract(sin(sn) * 43758.5453);
}

vec3 smooth_step(vec3 xyz) {
  return (xyz * xyz * (3.0 - 2.0 * xyz));
}

float smooth_step(float x) {
  return (x * x * (3.0 - 2.0 * x));
}

vec3 lerp (vec3 v0, vec3 v1, float t) {
  return v0 + (v1 - v0) * t;
}

void main() {

  

// identify grid cell

vec4 frag_color = texture(map,vUv);
vec3 rgb = normalize(frag_color.rgb); 
vec3 xyz = floor(rgb * vec3(grid_x, grid_y, grid_z)) / vec3(grid_x, grid_y, grid_z);
vec2 xy = floor(vUv * vec2(uintBitsToFloat(grid_x), uintBitsToFloat(grid_y)));
// / vec2(uintBitsToFloat(grid_x) + 0.1e-10, uintBitsToFloat(grid_y) + 0.1e-10);
vec2 offsets[4];
float dots[4];
vec2 randos[4];
float summ = 0.0;
float noise;


// for (int i = 0; i < 3; i++) {
//     for (int j = 0; j < 3; j++) {
//       // for (int k = 0; k < 3; k++) {
//         // int idx = i + i * j + i * j * k;
//         int idx = i + i * j;

        // randos[idx] = normalize(vec3(random(vec2(xyz.x + vUv.x, xyz.x + vUv.y)), random(vec2(xyz.y + vUv.x, xyz.y + vUv.y)), random(vec2(xyz.z + vUv.x, xyz.z + vUv.y))));
        // randos[idx] = normalize(vec2(random(vec2(xy.x + vUv.x, xy.x + vUv.y)), random(vec2(xy.y + vUv.x, xy.y + vUv.y))));
        // offsets[idx] = normalize(vUv - randos[idx]);
        // dots[idx] = dot(randos[idx], offsets[idx]);
        
      // }
  //   }
  // }

  vec2 rando = normalize(vec2(random(xy), random(xy.yx)));
  vec2 offset = xy - rando;
  float dot = dot(rando, offset);
  summ += smooth_step(dot);
  
  // noise = clamp(summ / 8.0 * 8.0, 0.0, 0.3);
  noise = summ;


  // gl_FragColor = vec4(0.2 + frag_color.r + clamp(noise.r, 0.0, 0.4), frag_color.g + clamp(noise.g, 0.0, 0.4), frag_color.b + clamp(noise.b, 0.0, 0.4) - 0.2, 1.0);
    // gl_FragColor = vec4(frag_color.r + noise.r, frag_color.g + noise.g, frag_color.b + noise.b, 1.0);
    gl_FragColor = vec4(frag_color.rgb + noise, 1.0);


  // gl_FragColor = frag_color;
}`)


extend({ LineGeometry, PerlinMaterial })

useLoader.preload(TextureLoader, '/globe_diffuse_ne2.jpg')
useLoader.preload(TextureLoader, '/globe_height.png')
useLoader.preload(GLTFLoader, '/uploads_files_6461808_11_Location.glb')
gsap.registerPlugin(useGSAP)

export const Map2D = () => {

  const currentCoords = useAppSelector(state => state.currentCoords)
  const cameraDistance = useAppSelector(state => state.cameraDistance)
  const { key, value } : Coords = currentCoords? currentCoords[0] : { key: "", value: [null, null]}
  const [lat, lon] = value
  // console.log(`Map2D lat: ${lat} lon: ${lon}`)
  const [label, setLabel] = useState(key)
  // const label = useRef(key)
  const camPosition = useRef(new Vector3(0, 0, 30))
  const camPreviousPosition = useRef(new Vector3(0, 0, 30))
  // const textRef = useRef({ x: lon / 180 * 54, y: lat / 90 * 27, z: 1, alpha: 0 })
  const textRef = useRef({ x: 0, y: 0, z: 1, alpha: 0 })
  const shaderRef = useRef<{delta: number}>(null)

  const { scene } = useThree()

  const diffuse = useLoader(TextureLoader, "/globe_diffuse_ne2.jpg")
  const displacementMap = useLoader(TextureLoader, "/globe_height.png")
  const marker = useLoader(GLTFLoader, "/uploads_files_6461808_11_Location.glb")
  const tl = gsap.timeline()

  

  function moveCam() {
    const camera = scene.getObjectByName('cam') as Mesh
    if(!camera) return
    let [x, y, z] = camPosition.current;
    camPreviousPosition.current.set(x, y, z)
    ;[x, y, z] = [x / 180 * 54, y / 90 * 27, z]
    camera.position.set(x, y, z);
  }

  const updateText = () => {
    const text = scene.getObjectByName('text') as Mesh
    const mark = scene.getObjectByName("mark") as Mesh
    const { x, y, z, alpha } = textRef.current
    text.geometry.computeBoundingBox()
    const bb = text.geometry.boundingBox
    if (!bb) return
    const width = bb.max.x - bb.min.x
    text.position.set(((x - width / 2) / 180 * 54), (y + 2) / 90 * 27, z)
    mark.position.set(x / 180 * 54, y / 90 * 27, 0.2)
    const material = text.material as Material
    material.opacity = alpha
    const markMaterial = mark.material as Material
    markMaterial.opacity = alpha
  }

  useGSAP(() => {
    const camera = scene.getObjectByName('cam')
    if (!camera) return

    if (!lat || !lon) {
      tl.set(camPosition, {x: 0, y: 0, z: 30})
      return
    } 

    if (Number.isNaN(lat) || Number.isNaN(lon)) return
    // $1(`lat: ${lat}  lon: ${lon}`)
    
    const light = scene.getObjectByName("sunshine")
    if (!light) return
    // $1("camera: ", camera)

    const [prevLon, prevLat, prevZ] = camPreviousPosition.current
    const plon = prevLon
    const plat = prevLat

    // tl.to(textRef.current, { alpha: 0, duration: 0.5, ease: "power1.in", onUpdate: updateText })
      tl.to(camPosition.current, {
        keyframes: {
          x: [plon, plon + (lon - plon) / 2, lon],
          y: [plat, plat + (lat - plat) / 2, lat],
          z: [prevZ, 3 + Math.abs(plon - lon) / 2 / 360 * 30, 3],
          ease: "power1.inOut",
        },

        duration: 1 + Math.abs(plon - lon) / 360 * 11,
        onUpdate: moveCam
      })
      // .set(textRef.current, { x: lon, y: lat, onUpdate: updateText, onComplete: () => { setLabel(key) } })
      // .to(textRef.current, { alpha: 1, duration: 1.5, ease: "power1.in", onUpdate: updateText })

  }, [lat, lon])

  useGSAP(() => {
    // $1(`cameraDistance: ${cameraDistance}`)
    tl.to(camPosition.current, { z: cameraDistance, duration: cameraDistance / 25 * 2, ease: 'power1.inOut', onUpdate: moveCam })
  }, [cameraDistance])

  useFrame((_, delta) => {
    if (!shaderRef.current) return
    shaderRef.current.delta = delta
  })

  // useGSAP(() => {
  //   const text = scene.getObjectByName('text') as Mesh
  //   const mark = scene.getObjectByName("mark") as Mesh
  //   if (!text || !mark) return
  //   text.geometry.computeBoundingBox()
  //   const bb = text.geometry.boundingBox
  //   if(!bb) return
  //   const width = bb.max.x - bb.min.x
  //   tl.to(textRef.current, { alpha: 1 , duration: 1.5, ease: "power1.in", onUpdate: updateText})

  // }, [label])

  // useEffect(() => {
  //   const mark = scene.getObjectByName("mark") as Mesh
  //   if (!mark) return
  //   const geometry = mark.geometry
  //   geometry.computeBoundingBox()
  //         const bb = geometry.boundingBox
  //         if(!bb) return
  //         const width = Math.abs(bb?.max.z - bb.min.z)
  //         const height = Math.abs(bb?.max.y - bb?.min.y)
  //         const theta = 0.125 * Math.PI
  //         const cosT = Math.cos(theta)
  //         const sinT = Math.sin(theta)
  //         const deltaY = bb.min.y + height / 2
  //         const deltaX = bb.min.x
  //         // $1(`geometry: `, geometry)
  //         geometry.applyMatrix4(new Matrix4(
  //           // 1,    0,     0, 0,
  //           cosT, sinT,  0, cosT + deltaX * sinT - deltaX,
  //           -sinT, cosT, 1, -sinT + deltaY * cosT - deltaY,
  //           0,      0,   1, 0,
  //           0,      0,   0, 1        
  //         ))
  // }, [])

  return (
    <>
      <mesh name='earth'
        scale={[.01, .01, .01]} position={[0, 0, 0]} rotation={[0, 0, 0]}
        castShadow
      >
        <planeGeometry args={[10800, 5400]} />
        <meshStandardMaterial map={diffuse}
          // displacementMap={displacementMap}
          // displacementScale={5.025}
          // bumpMap={displacementMap}
          // bumpScale={4.5}
          side={FrontSide}
          metalness={0.0}
          roughness={1}
        // wireframe
        color={0xffffff}
        />
        {/* <perlinMaterial ref={shaderRef} map={diffuse} /> */}
      </mesh>
      <mesh name='earth2'
        scale={[.01, .01, .01]} position={[107, 0, 0]} rotation={[0, 0, 0]}
        castShadow
      >
        <planeGeometry args={[10800, 5400]} />
        <meshStandardMaterial 
          map={diffuse}
          displacementMap={displacementMap}
          displacementScale={1.025}
          bumpMap={displacementMap}
          bumpScale={4.5}
          side={FrontSide}
          metalness={0.0}
          roughness={1}
        wireframe
        color={0xffffff}
        />
      </mesh>
      {/* <Text3D name="text" scale={[.3, .3, .3]}  font={"/Noto_Sans_Black_Regular.json"}>{label}</Text3D> */}
      {/* <Text label={label} />
      <mesh name="mark" position={[0, 0, 0.25]} scale={[1.25, 1.25, 1.25]}
        rotation={[0.125 * Math.PI, 0, 0]}
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
      </mesh> */}
    </>
  )
}

{/* <arrowHelper args={[new Vector3(1,0,0), new Vector3(0,0,0), 1.75, 0x0000ff, 0.2]} />
        <arrowHelper args={[new Vector3(0,1,0), new Vector3(0,0,0), 1.75, 0x00ff00, 0.2]} />
        <arrowHelper args={[new Vector3(0,0,1), new Vector3(0,0,0), 1.75, 0xff0000, 0.2]} /> */}



