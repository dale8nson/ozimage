
import { useEffect, useState } from "react"
import { Card } from "./Card"
import { Skeleton } from "./ui/skeleton"
import { MotionValue } from "motion/react"
import { div } from "three/src/nodes/TSL.js"
import ParallaxCardEffect from "./parallax-cards/parallax-card-effect"


export const PostsSkeleton = ({progress}: { progress: MotionValue}) => {

  return (
    <div className={`flex flex-col translate-y-48`}>
      { Array(24).fill(0).map((_, i) => { 
        const targetScale = 1 - i * 0.015625;
        return (
        <ParallaxCardEffect
                          className="flex-col w-full h-auto max-h-202 max-w-370 rounded-3xl justify-center items-center p-4 shadow-2xl drop-shadow-2xl  bg-[url(/Texturelabs_Paper_159M.jpg)] brightness-110 bg-blend-color-burn overflow-clip"
                          id={i}
                          key={i}
                          progress={progress}
                          range={[0, 1]}
                          targetScale={targetScale}
                        >
                         <Skeleton className="h-screen min-w-full max-h-[248.45px] rounded-t-2xl object-cover flex justify-center"  />
                        </ParallaxCardEffect>
                        )})

      }
      </div>
  )
}
