'use client'
import { useEffect, useState } from "react"
import { Card } from "./Card"
import { PostsSkeleton } from "./PostsSkeleton"

type PostsProps = {
  serverUrl: string
  className: string
  postsPerPage?: number
}

export const Posts = ({ serverUrl, className, postsPerPage = 24 }: PostsProps) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  
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
        const res = await fetch(`${serverUrl}/posts?page=1&per_page=${postsPerPage}`)
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
      return <PostsSkeleton/>
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

  return isInitialLoading ? <PostsSkeleton /> : (

    <div className={`grid justify-center max-w-370 items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-1.5 gap-y-1.5 h-fit w-full py-8 m-auto ${className}`}>
      {loadError && (
        <div className="col-span-full flex justify-center py-10 text-black/60">
          {loadError}
        </div>
      )}
      {posts.map((post: Post) => (
        <Card
          key={post.id}
          post={post}
        />
      ))}
      {hasMore && (
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
  )
}
