import { Text3D } from "@react-three/drei"
import { Vector3 } from "three"

export const Text = ({name, label, position}:{name?: string, label: string, position?: Vector3}) => {
  return (
    <Text3D name={name} position={position} scale={[.4, .3, .1]}  font={"/EB_Garamond_Regular.json"}>
      <meshStandardMaterial
        color={0xB9B9AF}
        metalness={0.5}
        roughness={0.3}
        transparent
        opacity={1}
        // wireframe
         />
      {label}
      </Text3D>
  )
}