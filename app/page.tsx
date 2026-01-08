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

const serverUrl = process.env.SERVER_URL ?? ""
const coords = fetch("http://localhost:3000/api/coords").then(res => res.json())
const posts = fetch(`${serverUrl}/posts`).then(res => res.json())
console.log("posts: ", posts)


const res = await fetch(`${serverUrl}/posts/featured`);
  console.log(`res: `, res)
const featured_posts = res.json();

export default async function Home() {

  // const coords = fetch("api/coords").then(res => res.json())
  // console.log(`api/coords`, coords)
  // const apiToken = token()
  // const tileset = ts()


  return (
    <StoreProvider>
      <div className="relative flex-col items-center justify-start w-full h-full">
        <Header />
        <main className="relative flex-col justify-start items-center w-full h-[80vh] overflow-x-hidden overflow-y-scroll">
          <div className="relative flex w-full h-fit justify-center items-start">
            <Suspense fallback={<div className="max-w-370 h-225 text-5xl flex justify-center items-start text-black animate-pulse "><p>Loading...</p></div>}>
            <Carousel posts={featured_posts} />
            </Suspense>
          </div>
          <Suspense fallback={<div className="md:w-370 md:h-225 text-5xl flex justify-center items-start text-black animate-pulse "><p>Loading...</p></div>}>
            <Posts posts={posts} serverUrl={serverUrl} className="relative md:max-w-370 h-full w-full justify-center items-center z-30" />
          </Suspense>
          {/* <Suspense fallback={<div className="flex justify-center items-center w-full h-full animate-pulse"><p className="text-2xl ">Loading...</p></div>}>
            <div className="w-full h-full flex-col justify-center items-end m-0">
              <Map3D coords={coords} />
              </div>
            </Suspense> */}
        </main>
      </div>
    </StoreProvider>
  )
}
