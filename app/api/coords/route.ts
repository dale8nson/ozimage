import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const res = await fetch(`${process.env.SERVER_URL}/posts/coords`)
  // .then(res => res.json(), e => console.log(e))
  if(!res.ok) {
    console.log(`Error: ${res.statusText}`)
    
  }
  const coords = await res.json()
  
    return Response.json(coords)

}