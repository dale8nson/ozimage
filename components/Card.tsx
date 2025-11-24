'use client'
import { useState, useRef, Dispatch, SetStateAction, Suspense } from "react"
import {
  Card as Root,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { JSX } from "react"
import { randomInt } from "crypto"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setCurrentCoords } from "@/lib/features/root/rootSlice"

export const Card = ({postId, title, img, excerpt, categories}: {postId: number, title: string, img: JSX.Element, excerpt: string, categories: string[]}) => {
  const dispatch = useAppDispatch()
  const coords = useAppSelector(state => state.coords)[postId]
  // console.log(`coords: `, coords)
  const rootRef = useRef(null)
  
return (
  <Suspense fallback = {<div className="hover:scale-150 transition-all hover:shadow-lg hover:shadow-black/70 bg-white/50 border-2 rounded-lg border-black/70 duration-350 aspect-square flex w-full h-full justify-center items-center animate-pulse text-2xl text-gray-500"><h1>Loading...</h1></div>}>

<Root 
  ref={rootRef} 
  className="hover:z-30 border-2 rounded-lg border-black/70 duration-350 aspect-square hover:scale-150 transition-all hover:shadow-lg hover:shadow-black/70 bg-white/50 backdrop-blur-sm"
  onPointerEnter={() => coords && dispatch(setCurrentCoords(coords)) } 
    // style={{rotate: `${randomInt(20) - 10}` }}
    >
    <CardHeader>
      <CardTitle className="text-2xl">{title}</CardTitle>
      {/* <CardAction>Card Action</CardAction> */}
    </CardHeader>
    <CardContent className="flex-col space-y-4">
      {img}
      <div className="font-sans text-white font-bold text-base ">{excerpt}</div>
    </CardContent>
    <CardFooter>
      {categories.map(category => <p key={crypto.randomUUID()}>{category?.split(/[a-z][A-Z]/).join(' ')}</p>)}
    </CardFooter>
  </Root>
  </Suspense>
)
}