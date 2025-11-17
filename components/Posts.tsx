'use client'
import { use } from "react"
import { Card } from "./Card"
import { Html } from "./Html"
import parse from 'html-react-parser'
import Script from 'next/script'

export const Posts = ({ posts: ps, categories : cats, className }: { posts: Promise<[]>, categories: Promise<[]>, className: string }) => {

  // console.log(ps)

  const posts = use(ps)
  const categories = use(cats)
  console.log(categories)
  // console.log(`posts: ${Object.values(posts).map(post => Object.entries(post).map(([k, v]) => `${k}: ${v}\n`).join('\n'))}`)
  // console.log(posts[0].content.rendered)
  // console.log(`posts: ${Object.values(posts).map(post => `${post.title}: ${post.tags.join(', ')}`)}`)

  return (
    <div className={`grid grid-cols-1 justify-around w-1/5 h-full gap-16 overflow-x-visible overflow-y-scroll p-24 ${className}`}>
      {posts.map(post => {
        const img = post.content.rendered.match(/<img.*?\/?>/)?.[0]
        if(!img) console.log(post.content.rendered)
        console.log(`img: ${img}`)
        const postCategories = post.categories.map(id => categories?.find(cat => cat.id === id)?.name)

        return (<Card key={crypto.randomUUID()} title={parse(post.title.rendered)} img={img && parse(img)} excerpt={parse(post.excerpt.rendered)} categories={postCategories} />)
        })}
    </div>
    // <div className="flex justify-center items-start w-full h-full m-0 p-8 overflow-hidden">
    //   {/* <div className="flex-col w-full h-full p-8 m-0 items-center">{Object.values(posts).map(post => (
    //     <Html key={crypto.randomUUID()} >
    //       {post.content.rendered}
    //     </Html>
    //   ))}</div> */}
    //   <div className="flex-col w-full h-full p-8 m-0 items-center overflow-y-scroll">
    //     {/* <Html> */}

    //     {/* </Html> */}
    //   </div>
    // </div>
  )
}
