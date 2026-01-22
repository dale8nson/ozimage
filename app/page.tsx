/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
'use cache'
import { Suspense } from "react";
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

const serverUrl = process.env.SERVER_URL ?? ""
const POSTS_PER_PAGE = 24

export default async function Home() {
  // const coords = fetch("api/coords").then(res => res.json())
  // console.log(`api/coords`, coords)
  // const apiToken = token()
  // const tileset = ts()

  return (
    <StoreProvider>
      <div className="relative flex-col items-center justify-start w-full h-max">
        <Header />
        <main className="relative pt-8 flex-col items-center justify-start space-y-8 w-screen h-full overflow-x-clip overflow-y-scroll mx-auto">
          <div className="relative flex w-full h-auto max-w-370 justify-center items-start mx-auto">
              <Carousel server_url={serverUrl} />
          </div>
            <Posts postsPerPage={POSTS_PER_PAGE} serverUrl={serverUrl} className="relative max-w-370 mx-auto h-auto w-full z-30 overflow-y-clip" />
          {/* <Suspense fallback={<div className="flex justify-center items-center w-full h-full animate-pulse"><p className="text-2xl ">Loading...</p></div>}>
            <div className="w-full h-full flex-col justify-center items-end m-0">
              <Map3D coords={coords} />
            </div>
          </Suspense> */}
          <Footer>
            Footer
          </Footer>
        </main>
      </div>
    </StoreProvider>
  )
}
