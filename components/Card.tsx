'use client'
import { useState, useRef, Dispatch, SetStateAction, Suspense, use, useId } from "react"
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
import Link  from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setCurrentCoords, setCameraDistance } from "@/lib/features/root/rootSlice"
import parse, { domToReact } from "html-react-parser"
import NextImage from "next/image"
import { PostProcessStage } from "cesium"

gsap.registerPlugin(useGSAP)

export const Card = ({ 
  post 
}: {
  post: Post

}) => {
  // href = `/${slug}`
  const dispatch = useAppDispatch()
  // const coords = useAppSelector(state => state.coords)
  // const coord = coords[postId]
  // console.log(`coord: `, coord)
  const rootRef = useRef(null)
  const id = useId()

  // const json = fetch(`http://localhost:8080/post/data/${postId}`).then(res => res.json())
  const { title, date, slug, link, image, categories}: Post = post

  // console.log(`cardProps: `, use(cardProps))
  // const post = use(cardProps)

  // console.log(`post: `, post)
  // useGSAP(() => {
  //   gsap.to(`.card`, {keyframes: {y:[1000, 0] }, duration: 2.5, ease:"power1.in"})
  // }, [])

  // console.log(`featured_media: `, featured_media)
  
return (
<Root
  id={id}
  ref={rootRef} 
  className="card relative hover:z-30 w-full h-full md:max-w-92.5 flex-col items-center justify-start duration-350 transition-all bg-transparent md:m-auto pb-8">
    <CardContent className="flex-col min-w-full md:h-[248.45px]  justify-start">
      { image.b64 !== "" && <div className="min-w-full md:h-[248.45px] "><Link href={link} prefetch><NextImage src={image.b64} width={image.width} height={image.height} alt={image.alt} className="min-w-full md:h-[248.45px] object-cover flex justify-center" /></Link></div>}
    </CardContent>
    <CardFooter className="relative -translate-y-[125%] md:translate-y-0 flex-col self-start items-start justify-start h-16 py-4 pl-4 md:pl-0">
      <p className="text-2xl text-white md:text-base md:text-black self-start ">
      <Link href={link}>{parse(title)}</Link></p>
      {/* <p className="text-neutral-500 italic ">{new Date(date).toLocaleDateString("en-AU", {day:"numeric", month:"short", year:"numeric"})}</p> */}
      <p className="text-white md:text-black italic">{Object.keys(categories)[0]}</p>
    </CardFooter>
  </Root>
// </Suspense>
)
}