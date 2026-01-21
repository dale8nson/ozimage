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
        <main className="relative flex-col items-start justify-start space-y-16 w-full h-full overflow-x-clip overflow-y-scroll mx-auto">
          <div className="relative flex w-full h-auto max-w-370 justify-center items-start mx-auto">
            <Suspense fallback={<div className="border-2 border-gray-500 relative flex-col justify-start items-center bg-transparent rounded-2xl w-screen h-screen max-h-[66vh]  max-w-370 m-auto overflow-clip text-black animate-pulse "><p>Loading...</p></div>}>
              <Carousel server_url={serverUrl} />
            </Suspense>
          </div>
          <Suspense fallback={<div className="relative max-w-370 mx-auto h-auto w-full text-5xl flex-col justify-start items-center text-black animate-pulse "><p>Loading...</p></div>}>
            <Posts postsPerPage={POSTS_PER_PAGE} serverUrl={serverUrl} className="relative max-w-370 m-auto h-auto w-full z-30 overflow-y-clip" />
          </Suspense>

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
