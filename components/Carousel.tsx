'use client'
import { use, useEffect } from 'react'
// // import { useState } from 'react'
import Image from 'next/image'
import parse from 'html-react-parser'

import {
  Carousel as Root,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/ui/carousel';
import Link from 'next/link';

export const Carousel = ({ posts: ps }: { posts: Promise<Post[]> }) => {
  const posts = use(ps);

  return (
    <div className='relative max-w-screen max-h-auto md:max-w-370  bg-transparent' >
      <Root initialIndex={0} className='relative h-full w-full overflow-hidden'>
        <div className="relative w-full h-full space-y-2">
          <CarouselContent className="w-screen max-w-screen max-h-auto md:max-w-370 md:max-h-184 flex justify-start items-start [**:object-cover]">
            {posts.map((post: Post, i) => {
              console.log(`index: ${i}  alt: ${post.image.alt}`)
              return (
                <CarouselItem className="relative flex-col max-w-93.75 h-auto w-screen md:max-w-370 md:max-h-184  justify-between items-start" key={i}>
                  <Link href={post.link} className='flex max-w-screen max-h-auto md:max-w-370 max-h-184 object-cover'>
                    {post.image && 
                    <Image src={post.image.b64} alt={post.image.alt || "image"} 
                    width={post.image.width} 
                    height={post.image.height}
                    // fill={true}
                    className='object-cover w-screen max-w-screen h-screen max-h-[33vh] md:max-w-370 md:max-h-184'
                     />
                    }
                  <div className='absolute flex-col items-start bottom-0 p-4 text-white text-5xl'>
                    <div className="bg-white text-black text-base w-fit font-bold px-2"><p>{Object.keys(post.categories).join(", ")}</p></div>
                    <p>{parse(post.title)}</p>
                    {/* <p className='text-base'>{new Date(post.date).toDateString()}</p> */}
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
