'use client'
import { use } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { useCarousel } from "./carousel"

type TP5DProps = {tp5d: Promise<{id: number, fg: string, bg: string}>, width: number, height: number, alt: string, order: number}

export const TP5D = ({tp5d, width, height, alt, order}: TP5DProps) => {
  const { fg, bg } = use(tp5d)
  const { index } = useCarousel();


  return (
<div className="relative w-370 h-184">
  <motion.div
  className='absolute top-0 left-0 flex object-cover saturate-150 h-184 w-370'
  // animate={{
  //       // translateX: `-${index * (100)}%`,
  //       opacity: index == order ? 1 : 0
        
  //     }}
  // transition={{ease: [0.013, 0.629, 0.371, 0.612], duration: 3}}
  >
    <Image src={bg} alt={alt || "image"} width={width} height={height} className='absolute top-0 left-0 w-370 h-[980px] object-cover saturate-150  '/>
  </motion.div>
  <motion.div 
  // animate={{
  //       translateX: `-${index * (100)}%`,
  //     }} 
  //     transition={{ease: "linear", duration: 3}}
  //     className='absolute top-0 object-cover w-screen max-w-screen h-full max-h-[33vh] md:max-w-370 md:max-h-184 saturate-150 opacity-100 translate-z-1'
      >
    <Image src={fg} alt={alt || "image"} 
      width={width} 
      height={height}
      className='object-cover absolute top-0 left-0 w-screen max-w-screen h-full  md:max-w-370 md:max-h-184 saturate-150 opacity-100 ' />
  </motion.div>
</div>
  )
}