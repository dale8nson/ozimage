'use client'
import { Suspense, use, useMemo } from "react"
import { Card } from "./Card"
import parse from 'html-react-parser'
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setPosts, setCoords } from "@/lib/features/root/rootSlice"


export const Posts = ({ posts: ps, className }: { posts:Promise<Post[]>, className: string }) => {
  const dispatch = useAppDispatch()

  const posts = use(ps)
  dispatch(setPosts(posts))

  const coords: {[id:number]: Coords[]} = {}
  for (const post of posts) {
    coords[post.id] = post.coords
  }
  dispatch(setCoords(coords))

  // console.log(`posts[0]: `, posts[0])

  const cards = useMemo(() => {

    return posts.map(post => {
        
        // console.log(`img: ${img}`)
        const postCategories = Object.keys(post.categories)
  
        const img = <Image src={`data:image/*;base64,${post.image}`} width="500" height="500" alt=""/>

        return (
        // <Suspense key={crypto.randomUUID()}>
          <Card key={crypto.randomUUID()} postId={post.id} title={parse(post.title)} img={img} excerpt={parse(post.excerpt)} categories={postCategories} />
          // </Suspense>)
        // }
    )})
  }, [posts])

  // console.log(`posts: ${Object.values(posts).map(post => Object.entries(post).map(([k, v]) => `${k}: ${v}\n`).join('\n'))}`)
  // console.log(posts[0].content.rendered)
  // console.log(`posts: ${Object.values(posts).map(post => `${post.title}: ${post.tags.join(', ')}`)}`)

  return (
    <div className={`grid grid-cols-1 justify-around w-1/5 h-full gap-16 overflow-x-visible scroll-m-0 overflow-y-scroll p-24 ${className}`}>
      {cards}
    </div>
  )
}
