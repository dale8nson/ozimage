"use client"
import { useEffect, useRef, useState, use } from "react"
import { useScroll } from "motion/react"
import { Carousel } from "./Carousel"
import { Footer } from "./Footer"
import { Posts } from "./Posts"
import { TravelAnalytics } from "./TravelAnalytics"
import ParallaxCardEffect from "./parallax-cards/parallax-card-effect"
// import { distance } from "geo-math"
const distanceFn = import("geo-math")

interface Coord {
  lat: number,
  lon: number
}


export const Main = ({ POSTS_PER_PAGE, serverUrl }: { POSTS_PER_PAGE: number, serverUrl: string }) => {

  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [distanceError, setDistanceError] = useState<string | null>(null)

  // const containerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress, scrollY } = useScroll({
    container: containerRef
  });

  const { distance }: {distance: (c1: Coord, c2: Coord) => number } = use(distanceFn)
  console.log(`distance: ${distance({ lat: 0, lon: 5 }, { lat: 25, lon: 30 })}`)

  // useEffect(() => {
  //   console.log("[Main] mounted")
  //   let mounted = true

  //   ;(async () => {
  //     console.log("[Main] loading geo-math")
  //     const { distance } = await import("geo-math")
  //     if (!mounted) return

  //     const km = distance({ lat: 0, lon: 5 }, { lat: 25, lon: 30 })
  //     console.log("[Main] distance (km):", km)
  //     setDistanceKm(km)
  //   })().catch((error) => {
  //     if (mounted) {
  //       setDistanceError(error instanceof Error ? error.message : String(error))
  //     }
  //     console.error("Failed to load geo-math wasm module", error)
  //   })

  //   return () => {
  //     mounted = false
  //     console.log("[Main] unmounted")
  //   }
  // }, [])
  

  return (<main ref={containerRef} className="fixed pt-8 flex-col items-center justify-start space-y-8 w-screen h-[85%] overflow-y-scroll">

    {/* <ParallaxCardEffect id={0} progress={scrollYProgress} targetScale={1} range={[0, 1]}  className="relative flex w-full h-auto max-w-370 justify-center items-start mx-auto"> */}
      
    {/* </ParallaxCardEffect> */}
    <Posts
      progress={scrollYProgress}
      scrollY={scrollY}
      postsPerPage={POSTS_PER_PAGE}
      serverUrl={serverUrl}
      className="relative max-w-370 h-full w-full z-30 m-auto"
    />
    
    {/* <Suspense fallback={<div className="flex justify-center items-center w-full h-full animate-pulse"><p className="text-2xl ">Loading...</p></div>}>
            <div className="w-full h-full flex-col justify-center items-end m-0">
              <Map3D coords={coords} />
            </div>
          </Suspense> */}
          {/* <Footer /> */}
    
  </main>)
}
