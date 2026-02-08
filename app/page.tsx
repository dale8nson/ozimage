/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
'use cache'
import { Suspense} from "react";
import { Posts } from "@/components/Posts";
import { NavMenu } from "@/components/NavMenu";
import Map3D from "@/components/Map3D";
import StoreProvider from "./StoreProvider";
import { apiToken as token, tileset as ts } from '@/lib/server'
import { Carousel } from "@/components/Carousel";
import { Header } from "@/components/Header";
import { Map2D } from "@/components/Map2D";
import { HeaderCanvas } from "@/components/HeaderCanvas";
import { Footer } from "@/components/Footer";
import { CarouselNavigation } from "@/components/ui/carousel";
import { CarouselSkeleton } from "@/components/CarouselSkeleton";
import { TravelAnalytics } from "@/components/TravelAnalytics";
import ParallaxCardEffect from "@/components/parallax-cards/parallax-card-effect";
import { useScroll } from "motion/react";
import { Main } from "@/components/Main";

const serverUrl = process.env.SERVER_URL ?? ""
const POSTS_PER_PAGE = 24

export default async function Home() {

  
  // const coords = fetch("api/coords").then(res => res.json())
  // console.log(`api/coords`, coords)
  // const apiToken = token()
  // const tileset = ts()

  return (
    <StoreProvider>
      <div className="relative flex-col items-center justify-start w-screen h-screen">
        <div className="bg-[url(/Texturelabs_Grunge_155M.jpg)] opacity-30 bg-cover absolute top-0 left-0 m-0 w-full h-full -z-10"/>
        <Header />
        <Main POSTS_PER_PAGE={POSTS_PER_PAGE} serverUrl={serverUrl}/>
      </div>
    </StoreProvider>
  )
}
