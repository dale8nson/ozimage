"use client"
import { useEffect, useRef, useState } from "react"
import { useScroll } from "motion/react"
import { Carousel } from "./Carousel"
import { Footer } from "./Footer"
import { Posts } from "./Posts"
import { TravelAnalytics } from "./TravelAnalytics"
import ParallaxCardEffect from "./parallax-cards/parallax-card-effect"
import { distance } from "geo-math"


export const Main = ({ POSTS_PER_PAGE, serverUrl }: { POSTS_PER_PAGE: number, serverUrl: string }) => {

  // const [distance, setDistance] = useState<(c1: {lat: number, lon: number}, c2: {lat: number, lon: number}) => number>()

  // const containerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress, scrollY } = useScroll({
    container: containerRef
  });

  // useEffect(() => {
  // //   (async () => 
  // //    {const { distance } = await import("geo-math")
  // //     setDistance(distance)
  //     console.log("distance: ", distance({lat: 0, lon: 5}, {lat: 25, lon: 30}))
  //   // }
  // //   )()
    
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
