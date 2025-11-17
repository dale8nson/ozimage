'use client'
import { useState, useRef } from "react"
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

export const Card = ({title, img, excerpt, categories}: {title: string, img: JSX.Element, excerpt: string, categories: string[]}) => {

  const rootRef = useRef(null)

return (
  <Root ref={rootRef} className="hover:z-30 border-2 rounded-lg border-black/70 duration-350 aspect-square hover:scale-150 transition-all hover:shadow-lg hover:shadow-black/70 bg-white/50 backdrop-blur-sm"
  onPointerEnter={(e) => {console.log(rootRef.current) }} 
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
)
}