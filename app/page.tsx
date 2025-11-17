/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Suspense } from "react";
import { Posts } from "@/components/Posts";
import { NavMenu } from "@/components/NavMenu";
import { Map } from "@/components/Map";
// import { Map3D } from "@/components/Map3D";

import dynamic from "next/dynamic";

  const Map3D = dynamic(() => import("../components/Map3D"), {
  ssr: false,
});
// import dynamic from "next/dynamic";

// const Map3D = dynamic(() => import("../components/Map3D"), {ssr: false})

export default function Home() {



  const posts = fetch("https://ozimage.com.au/wp-json/wp/v2/posts?_fields=author,id,excerpt,title,link,content,excerpt,categories").then(res => res.json())
  // .then(ps => fetch(ps[0].link)).then(res => res.json())
  // .then(json => json.map((post: any) => {const {title, slug, tags, categories, author, content} = post; return {title, slug, tags, categories, author, content} }))
  const categories = fetch("https://ozimage.com.au/wp-json/wp/v2/categories").then(res => res.json())

  return (
    <div className="flex flex-col items-start justify-center w-full h-full p-4 ">
      <header className="flex justify-center items-center w-full h-16">
        <NavMenu/>
      </header>
      <main className=" relativeflex-col items-center justify-center w-full h-full overflow-y-hidden overflow-x-hidden">
          <Map3D lat={133.7751} lon={-25.2744} />
          <Suspense fallback={<div className="absolute z-30 top-0 left-0 flex w-1/6 h-full justify-center items-center animate-pulse text-5xl text-white bg-transparent"><h1>Loading...</h1></div>}>
         <Posts posts={posts} categories={categories} className="absolute top-0 left-0" />
        </Suspense>
      </main>
    </div>
  )
}

        
