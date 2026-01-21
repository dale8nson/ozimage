'use client'

import { UseQueryResult } from "@tanstack/react-query"

export const Log = ({bbox, query}:{bbox:number[], query: UseQueryResult<string, Error> | undefined}) => {
  return ( <div className="flex justify-start items-center space-x-8"><h1 className="text-2xl font-black text-black">{bbox.toString()}</h1>
  <h1 className="text-2xl font-black text-black">Fetching: {query && query.isFetching}</h1>
  <h1 className="text-2xl font-black text-black">Pending: {query && query.isPending}</h1>
  
  <h1 className="text-2xl font-black text-black">Loading: {query && query.isLoading}</h1>
  </div>)
}