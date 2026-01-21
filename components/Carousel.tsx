'use client'
import { use, useEffect, Suspense } from 'react'
// // import { useState } from 'react'
import parse from 'html-react-parser'
import { TP5D } from './ui/TP5D';
import Image from 'next/image';

import {
  Carousel as Root,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/ui/carousel';
import Link from 'next/link';

export const Carousel = ({ posts: ps, server_url }: { posts: Promise<Post[]>, server_url: string }) => {
  const posts = use(ps);

  return (
    <div className='relative flex-col justify-start items-start bg-transparent rounded-2xl w-full max-h-[66vh]  max-w-370 m-auto overflow-clip' >
      <Root initialIndex={0} className='relative flex-col w-full h-full justify-start items-center'>
        <div className="relative flex-col w-full h-full space-y-2 overflow-clip">
          <CarouselContent className="flex justify-start items-start relative w-full max-h-208  [**:object-cover]">
            {posts && posts.map((post: Post, i) => {
              console.log(`index: ${i}  alt: ${post.image.alt}`)
              console.log(`post.fg: ${post.fg.slice(0, 150)}`)

              console.log(`server_url: ${server_url}`)
              // const tp5d = fetch(`${server_url}/tp5d/${post.image.id}`).then(res => res.json()) as Promise<{id: number, fg: string, bg: string}>
              return (
                <CarouselItem className="relative flex justify-center items-start w-full max-w-370 h-auto max-h-208" key={i}>
                  <Link href={post.link} className='block relative flex-col w-full max-h-208'>
                      {/* <Suspense> */}
                        <Image width={post.image.width} height={post.image.height} alt={post.image.alt} src={post.image.b64}
                          className='w-full max-h-208 max-w-370 object-cover' />
                      {/* </Suspense> */}
                    <div className='absolute flex-col w-full items-start bottom-0 p-4 text-white text-2xl sm:text-3xl  md:text-5xl'>
                      <div className="bg-white text-black text-base w-fit font-bold px-2">
                        <p>{Object.keys(post.categories).join(", ")}</p>
                      </div>
                      <p>{parse(post.title)}</p>
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselNavigation alwaysShow />
        </div>
        <CarouselIndicator images={posts.map(post => post.image)} />
      </Root>
    </div>
  );
}
