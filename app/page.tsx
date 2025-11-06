/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { Posts } from "@/components/Posts";
export default function Home() {

  const posts = fetch("https://ozimage.com.au/wp-json/wp/v2/posts?_fields=author,id,excerpt,title,link,content,tags").then(res => res.json())
  // .then(json => json.map((post: any) => {const {title, slug, tags, categories, author, content} = post; return {title, slug, tags, categories, author, content} }))

  return (
    <div className="flex flex-row justify-center items-center bg-white border-4 rounded-4xl border-black border-solid w-11/12 h-11/12 m-0 p-8 overflow-y-scroll">
      <main className="flex-col items-center w-auto h-auto">
        <Suspense fallback={<div className="flex w-full h-full justify-center items-center animate-pulse text-5xl text-black bg-white"><h1>Loading...</h1></div>}>
         <Posts posts={posts} />
        </Suspense>
      </main>
    </div>
  );
}
