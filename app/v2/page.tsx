/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client'
'use cache'
import { Suspense } from "react";
import { Posts } from "@/components/Posts";
import { NavMenu } from "@/components/NavMenu";
import Map3D from "@/components/Map3D";
import StoreProvider from "../StoreProvider";
import { apiToken as token, tileset as ts } from '@/lib/server'
import { Carousel } from "@/components/Carousel";
import { Header } from "@/components/Header";
import { Map2D } from "@/components/Map2D";
import { HeaderCanvas } from "@/components/HeaderCanvas";

const serverUrl = process.env.SERVER_URL ?? ""
const POSTS_PER_PAGE = 24

async function fetchPostsPage(serverUrl: string, page: number) {
  const res = await fetch(`${serverUrl}/posts?page=${page}&per_page=${POSTS_PER_PAGE}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch posts page ${page}`)
  }
  return res.json() as Promise<Post[]>
}

async function fetchAllPosts(serverUrl: string) {
  if (!serverUrl) {
    return [] as Post[]
  }

  const posts: Post[] = []
  let page = 1
  while (true) {
    const pagePosts = await fetchPostsPage(serverUrl, page)
    if (pagePosts.length === 0) {
      break
    }
    posts.push(...pagePosts)
    if (pagePosts.length < POSTS_PER_PAGE) {
      break
    }
    page += 1
  }
  return posts
}


export default async function Home() {

  const coords = fetch(`${process.env.SERVER_URL}/coords`).then(res => { console.log(`res: `, res); return res.json() })
  const posts = fetchAllPosts(serverUrl)
  console.log("posts: ", posts)

  const res = await fetch(`${serverUrl}/posts/featured`);
  console.log(`res: `, res)
  const featured_posts = res.json();

  // const coords = fetch("api/coords").then(res => res.json())
  // console.log(`api/coords`, coords)
  // const apiToken = token()
  // const tileset = ts()

  return (
    <StoreProvider>
      <div className="relative flex-col items-center justify-start w-full h-full">
        {/* <HeaderCanvas/> */}
        <Header />
        <main className="relative flex-col justify-start items-center w-full h-full overflow-x-clip overflow-y-scroll">
          <div className="relative flex w-full h-auto justify-center items-start mx-auto">
            <Suspense fallback={<div className="max-w-370 max-h-225 text-5xl flex mx-auto justify-center items-start text-black animate-pulse "><p>Loading...</p></div>}>
              <Carousel posts={featured_posts} server_url={serverUrl} />
            </Suspense>
          </div>
          <Suspense fallback={<div className="max-w-370 md:h-225 text-5xl flex justify-center items-start text-black animate-pulse "><p>Loading...</p></div>}>
            <Posts posts={posts} serverUrl={serverUrl} className="relative translate-y-[20%]  md:max-w-370 mx-auto h-full w-full justify-center items-center z-30" />
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
