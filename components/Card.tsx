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
  const { title, date, slug, link, image, continent, categories}: Post = post

  // console.log(`cardProps: `, use(cardProps))
  // const post = use(cardProps)

  console.log(`continent: `, continent)
  // useGSAP(() => {
  //   gsap.to(`.card`, {keyframes: {y:[1000, 0] }, duration: 2.5, ease:"power1.in"})
  // }, [])

  // console.log(`featured_media: `, featured_media)
  
return (
<Root
  id={id}
  ref={rootRef} 
  className="card h-fit p-0 relative rounded-2xl hover:z-30 w-full md:h-fit md:max-w-92.5 flex-col items-center justify-start duration-350 transition-all md:m-auto md:pb-8 bg-[#004071]/40 object-cover overflow-clip">
    <CardContent className="flex-col h-full min-w-full md:h-[248.45px] justify-start rounded-t-2xl saturate-125 contrast-125">
      { image.b64 !== "" && <div className="h-full min-w-full md:h-[248.45px] "><Link href={link} prefetch><NextImage src={image.b64} width={image.width} height={image.height} alt={image.alt} className="h-min min-w-full md:h-[248.45px] rounded-t-2xl object-cover flex justify-center" objectFit="cover" /></Link></div>}
    </CardContent>
    <CardFooter className="absolute bottom-0 my-2 md:my-0 md:relative md:translate-y-0 flex-col self-start items-start justify-start h-fit pl-2 md:pl-4">
      <p className="text-white md:text-black italic">{continent}</p>
      <p className="text-2xl text-white md:text-base md:text-black self-start ">
      <Link href={link}>{parse(title)}</Link></p>
      {/* <p className="text-neutral-500 italic ">{new Date(date).toLocaleDateString("en-AU", {day:"numeric", month:"short", year:"numeric"})}</p> */}
    </CardFooter>
  </Root>
// </Suspense>
)
}