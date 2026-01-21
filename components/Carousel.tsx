'use client'
import { useEffect, useState } from 'react'
import parse from 'html-react-parser'
import Image from 'next/image';

import {
  Carousel as Root,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/ui/carousel';
import Link from 'next/link';

export const Carousel = ({ server_url }: { server_url: string }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const loadFeaturedPosts = async () => {
      setIsLoading(true)
      setLoadError(null)
      setPosts([])

      if (!server_url) {
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`${server_url}/posts/featured`)
        if (!res.ok) {
          throw new Error("Failed to fetch featured posts")
        }
        const nextPosts = (await res.json()) as Post[]
        if (!isCancelled) {
          setPosts(nextPosts)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error)
          setLoadError("Failed to load featured posts.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadFeaturedPosts()

    return () => {
      isCancelled = true
    }
  }, [server_url])

  return (
    <div className='relative flex-col justify-start items-start bg-transparent rounded-2xl w-full max-h-[66vh]  max-w-370 m-auto overflow-clip' >
      <Root initialIndex={0} className='relative flex-col w-full h-full justify-start items-center'>
        <div className="relative flex-col w-full h-full space-y-2 overflow-clip">
          <CarouselContent className="flex justify-start items-start relative w-full max-h-208  [**:object-cover]">
            {posts.length === 0 ? (
              <CarouselItem className="relative flex justify-center items-start w-full max-w-370 h-auto max-h-208">
                <div className="flex w-full h-[44vh] max-h-184 max-w-370 items-center justify-center text-black/60 animate-pulse">
                  {isLoading ? "Loading..." : loadError ?? "No featured posts."}
                </div>
              </CarouselItem>
            ) : (
              posts.map((post: Post, i) => {
                // const tp5d = fetch(`${server_url}/tp5d/${post.image.id}`).then(res => res.json()) as Promise<{id: number, fg: string, bg: string}>
                return (
                  <CarouselItem className="relative flex justify-center items-start w-full max-w-370 h-auto max-h-208" key={i}>
                    <Link href={post.link} className='block relative flex-col w-full max-h-208'>
                        <Image width={post.image.width} height={post.image.height} alt={post.image.alt} src={post.image.b64}
                          className='w-full h-[44vh] grow max-h-184 max-w-370 object-cover' />
                      <div className='absolute flex-col w-full items-start bottom-0 p-4 text-white text-2xl sm:text-3xl  md:text-5xl'>
                        <div className="bg-white text-black text-base w-fit font-bold px-2">
                          <p>{Object.keys(post.categories).join(", ")}</p>
                        </div>
                        <p>{parse(post.title)}</p>
                      </div>
                    </Link>
                  </CarouselItem>
                )
              })
            )}
          </CarouselContent>
          {posts.length > 0 && <CarouselNavigation alwaysShow />}
        </div>
        {posts.length > 0 && <CarouselIndicator images={posts.map(post => post.image)} />}
      </Root>
    </div>
  );
}
