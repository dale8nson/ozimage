/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Suspense, useState, useEffect } from "react";
import { Posts } from "@/components/Posts";
import { NavMenu } from "@/components/NavMenu";
import Map3D from "@/components/Map3D";
import StoreProvider from "./StoreProvider";

export default function Home() {

  const posts = fetch("http://127.0.0.1:8080/posts").then(res =>  res.json())
  
  return (
    <StoreProvider>
    <div className="flex flex-col items-start justify-center w-full h-full p-4 ">
      <header className="flex justify-center items-center w-full h-16">
        <NavMenu/>
      </header>
      <main className=" relative flex-col items-center justify-center w-full h-full overflow-y-hidden overflow-x-hidden">
        {/* <Suspense> */}
          <Map3D />
          {/* </Suspense> */}
          {/* <Suspense fallback={<div className="absolute z-30 top-0 left-0 flex w-1/6 h-full justify-center items-center animate-pulse text-5xl text-white bg-transparent"><h1>Loading...</h1></div>}> */}
          <Suspense>
         <Posts posts={posts} className="absolute top-0 left-0 w-1/5 h-full justify-center items-center" />
        </Suspense>
      </main>
    </div>
    </StoreProvider>
  )
}

        
