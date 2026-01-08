'use client'
import { Suspense, use, useEffect, useMemo, useId } from "react"
import { Card } from "./Card"
import parse, { domToReact } from 'html-react-parser'
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setPosts, setCoords } from "@/lib/features/root/rootSlice"
import { Loader } from "@react-three/drei"


export const Posts = ({ posts: ps, serverUrl, className }: { posts: Promise<Post[]>, serverUrl: string, className: string }) => {
  const dispatch = useAppDispatch()

  // fetch("http://localhost:8080/posts/coords").then(res => res.json()).then(coords => dispatch(setCoords(coords)))
  // const coords = use(json)
  // dispatch(setCoords(coords))
  
  const posts = use(ps) as Post[]
  console.log("posts: ", posts)
  // dispatch(setPosts(posts))

  // const coords: {[id:number]: Coords[]} = {}
  // for (const post of posts) {
  //   coords[post.id] = post.coords
  // }
  // dispatch(setCoords(coords))

  // console.log(`posts[0]: `, posts[0])

  // const cards = useMemo(() => { 
        
  // )}, [postids])

  // console.log(`posts: ${Object.values(posts).map(post => Object.entries(post).map(([k, v]) => `${k}: ${v}\n`).join('\n'))}`)
  // console.log(posts[0].content.rendered)
  // console.log(`posts: ${Object.values(posts).map(post => `${post.title}: ${post.tags.join(', ')}`)}`)

  // const key = useId()

  return (
    <div className={`grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-1.5 md:max-w-370 pt-24 md:px-2 ${className}`}>
      {posts && posts.map((post: Post) => {
        // const cardProps = fetch(`${serverUrl}/post/data/${id}`).then(res => res.json())
        
        return (
        <Suspense key={post.id} fallback={<div className="relative hover:scale-150 transition-all hover:shadow-lg hover:shadow-black/70 bg-white/25 border-2 rounded-lg border-white/25 duration-350 aspect-16/10 flex w-full h-full justify-center items-center animate-pulse text-2xl text-white/25"
        ><h1>Loading...</h1></div>}>
          <Card 
          key={post.id}
          post={post}
          />
        </Suspense>
        
      )})
    }
    </div>
  )
}
