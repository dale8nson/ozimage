'use client'
import { use } from "react"
import { Html } from "./Html"

export const Posts = ({posts: ps}:{posts: {}}) => {

  const posts = use(ps)
  // console.log(`posts: ${Object.values(posts).map(post => Object.entries(post).map(([k, v]) => `${k}: ${v}\n`).join('\n'))}`)
  console.log(posts[0].content.rendered)
    // console.log(`posts: ${Object.values(posts).map(post => `${post.title}: ${post.tags.join(', ')}`)}`)

  return (
      <div className="flex justify-center items-start w-11/12 h-full m-0 p-8 overflow-hidden">
        {/* <div className="flex-col w-full h-full p-8 m-0 items-center">{Object.values(posts).map(post => (
          <Html key={crypto.randomUUID()} >
            {post.content.rendered}
          </Html>
        ))}</div> */}
        <div className="flex-col w-full h-full p-8 m-0 items-center">
          <Html>
            {posts[0].content.rendered}
          </Html>
        </div>
      </div>
  )
}