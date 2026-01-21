'use client'
import { use, useEffect, useState } from "react"
import { Card } from "./Card"

type PostsProps = {
  posts: Promise<Post[]>
  serverUrl: string
  className: string
  postsPerPage?: number
}

export const Posts = ({ posts: ps, serverUrl, className, postsPerPage = 24 }: PostsProps) => {
  const initialPosts = use(ps) as Post[]
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialPosts.length === postsPerPage)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setPosts(initialPosts)
    setPage(1)
    setHasMore(initialPosts.length === postsPerPage)
  }, [initialPosts, postsPerPage])

  const loadMore = async () => {
    if (isLoading || !hasMore) {
      return
    }
    if (!serverUrl) {
      setHasMore(false)
      return
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

  return (
    <div className={`grid justify-center items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-1.5 gap-y-1.5  h-full w-full md:px-2 pb-8 ${className}`}>
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
