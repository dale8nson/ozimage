'use client'
import { useEffect, useState, useMemo, useRef, useLayoutEffect, useCallback, type RefObject } from "react"
import { Card } from "./Card"
import { PostsSkeleton } from "./PostsSkeleton"
import ParallaxCardEffect from "./parallax-cards/parallax-card-effect"
import { CardHeader } from "./ui/card"
import { MotionValue } from "motion/react"
import { Carousel } from "./Carousel"
import { Footer } from "./Footer"
import { HorizontalScroller } from "./HorizontalScroller"

type PostsProps = {
  progress: MotionValue<number>
  scrollY: MotionValue<number>
  scrollContainerRef?: RefObject<HTMLElement>
  serverUrl: string
  className: string
  postsPerPage?: number
}

export const Posts = ({
  progress,
  scrollY,
  scrollContainerRef,
  serverUrl,
  className,
  postsPerPage = 24
}: PostsProps) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const stackRef = useRef<HTMLDivElement>(null)


  // const containerRef = useRef<HTMLDivElement>(null);

  // const { scrollYProgress } = useScroll({
  //   target: containerRef,
  //   offset: ["start start", "end end"]
  // });

  useEffect(() => {
    let isCancelled = false

    const loadInitialPosts = async () => {
      setIsInitialLoading(true)
      setLoadError(null)
      setPosts([])
      setPage(1)
      setHasMore(false)

      if (!serverUrl) {
        setIsInitialLoading(false)
        return
      }

      try {
        const res = await fetch(`${serverUrl}/posts`)
        if (!res.ok) {
          throw new Error(`Failed to fetch posts page 1`)
        }
        const nextPosts = (await res.json()) as Post[]
        if (isCancelled) {
          return
        }
        setPosts(nextPosts)
        setHasMore(nextPosts.length === postsPerPage)
      } catch (error) {
        if (isCancelled) {
          return
        }
        console.error(error)
        setLoadError("Failed to load posts.")
      } finally {
        if (!isCancelled) {
          setIsInitialLoading(false)
        }
      }
    }

    loadInitialPosts()

    return () => {
      isCancelled = true
    }
  }, [serverUrl, postsPerPage])

  // return <PostsSkeleton/>

  const loadMore = async () => {
    if (isLoading || !hasMore) {
      return
    }
    if (!serverUrl) {
      setHasMore(false)
      return <PostsSkeleton />
    }

    const nextPage = page + 1
    setIsLoading(true)
    try {
      const res = await fetch(`${serverUrl}/posts?page=${nextPage}&per_page=${postsPerPage}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch posts page ${nextPage}`)
      }
      const nextPosts = (await res.json()) as Post[]
      setPosts((prev) => [...prev, ...nextPosts])
      setPage(nextPage)
      setHasMore(nextPosts.length === postsPerPage)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const continents = useMemo(() => {
    if (posts.length === 0) return []
    const continents = new Set<string>()
    posts.forEach(post => continents.add(post.continent));
    return continents
  }, [posts])

  const containerClassName = `relative flex-col justify-start items-center max-w-370  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 h-full w-full ${isInitialLoading ? "" : "py-8"} ${className}`

  const continentCount = continents.values().toArray().length


  return (
    <>
      <div className={`${containerClassName}`}>
        {!isInitialLoading && loadError && (
          <div className="col-span-full flex justify-center py-10 text-black/60">
            {loadError}
          </div>
        )}
        <div className="h-full">
          {isInitialLoading ? (
            <PostsSkeleton />
          ) : (
            <>
              
                <div>
                  {/* <ParallaxCardEffect id={0} progress={progress} range={[0, 1]} targetScale={1}> */}
                  <Carousel server_url={serverUrl} />
                  {/* </ParallaxCardEffect> */}
                  <div
                    className="flex flex-col translate-y-48"
                    style={{
                      gap: 0
                    }}
                    ref={stackRef}>
                    {continents.values().toArray().map((continent, id) => {
                      const targetScale = 1 - id * 0.015625;
  
  
                      return (
                        <ParallaxCardEffect
                          className="flex-col w-full h-auto max-h-202 max-w-370 rounded-3xl justify-center items-center p-4 shadow-2xl drop-shadow-2xl  bg-[url(/Texturelabs_Paper_159M.jpg)] brightness-110 bg-blend-color-burn overflow-clip"
                          id={id}
                          key={continent}
                          progress={progress}
                          range={[0, 1]}
                          targetScale={targetScale}
                        >
                          <CardHeader className="font-[Klee] text-4xl font-extralight text-shadow-black text-shadow-xs text-[#004071]/50">{continent.toUpperCase()}</CardHeader>
                          <HorizontalScroller 
                          // className="grid max-w-370 w-full h-fit max-h-202 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 overflow-x-scroll overflow-y-clip"
                          className="flex items-center justify-start py-4 w-content h-fit gap-8 overflow-y-clip "
                          >
                            {posts.filter(post => post.continent === continent).map((post: Post) => (
                              <Card
                                key={post.id}
                                post={post}
                                className="flex h-32 p-0 w-[360px] bg-[#C3AD6F]/80 shrink-0 flex-col items-center justify-center rounded-md"
                              />
                            ))}
                          </HorizontalScroller>
                        </ParallaxCardEffect>)
                    })}
                    
                  </div>
  
                </div>
                
              <ParallaxCardEffect className="w-screen h-fit pt-125"
                  id={100}
                  progress={progress}
                  range={[0, 1]}
                  targetScale={1}
                >
                  <Footer className="w-screen" />
                </ParallaxCardEffect>
            </>
          )}

          {!isInitialLoading && hasMore && (
            <div className="col-span-full flex justify-center py-6">
              <button
                type="button"
                className="rounded-full border border-black/20 bg-white/70 px-6 py-2 text-sm font-semibold text-black/80 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
