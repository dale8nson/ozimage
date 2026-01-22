
import { useEffect, useState } from "react"
import { Card } from "./Card"
import { Skeleton } from "./ui/skeleton"


export const PostsSkeleton = () => {

  return (
    <div className={`grid justify-center max-w-370 items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-1.5 gap-y-1.5 h-fit w-full py-8 m-auto`}>
      { Array(24).fill(0).map((_, i) => (
        <div key={i} className="h-screen w-full max-h-[248.45px] p-0 relative rounded-2xl max-w-92.5 flex-col items-center justify-start duration-350 transition-all md:m-auto md:pb-8 object-cover overflow-clip" >
          <div className="flex-col h-full min-w-full max-h-[248.45px] justify-start rounded-t-2xl">
      <Skeleton className="h-screen min-w-full max-h-[248.45px] rounded-t-2xl object-cover flex justify-center"  />
    </div>
        </div>
      ))}
    </div>
  )
  
}
