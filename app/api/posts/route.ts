import { NextResponse } from "next/server";

export const GET = async () => {
  const res = await fetch("https://ozimage.com.au/wp-json/wp/v2/posts")
  const json = await res.json()

  return NextResponse.json(json)
}


