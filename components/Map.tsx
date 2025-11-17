'use client'
import { useState, useRef, WheelEventHandler, useEffect, ReactNode, ReactElement, createElement, Fragment } from 'react'
import {
  useQuery,
  useQueryClient,
  UseQueryResult
} from '@tanstack/react-query'
import parse, { DOMNode } from 'html-react-parser'
import { Log } from './Log'

const clamp = (n: number, min: number, max: number) =>
  n < min ? min : n > max ? max : n


export const MapSVG = ({ bbox }: { bbox: number[] }) => {
  const client = useQueryClient()
  // client.invalidateQueries({ queryKey: ['map'] })

  const queryFn = async () => {

    const data = await fetch(`http://127.0.0.1:8080/render?bbox=${bbox}&width=2700&height=1200&label_density=30&max_labels=10&fit=cover&layers=land,countries,countries_fill,countries_labels,places_major`).then(res => {
      return res.text()
    })
    return data
  }

  const query = useQuery({ queryKey: ['map'], queryFn }, client)

  const [x1, y1, x2, y2] = bbox
  const [w, h] = [x2 - x1, y2 - y1]

  if (!query.data) return <div>Loading...</div>
  else {
    const content = createElement(Fragment, null, parse(query.data))
    // const content = parse(query.data)

    return (
      <div className='flex-col items-start transform-3d translate-z-28'>
      <div className="flex space-x-0" >
      <svg id="root" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 1800 1000`} width={`2000`} height={`1000`} className="w-full fade-in-100 duration-75 transition-all" preserveAspectRatio='xMidYMid meet'>
        {content}
      </svg>
      </div>
      <Log bbox={bbox} query={query} />
      </div>
    )
  }

}


// 113, -50, 160, -1
export const Map = () => {

  // const bbox = useRef([140, -75, 150, -1])
  const [bbox, setBbox] = useState([-180, -90, 300, 90])

  const ref = useRef<HTMLDivElement | null>(null)
  const bounce = useRef(false)
  const mapCoords = useRef([0, 0])

  const [x1, y1, x2, y2] = bbox
  const height = y2 - y1
  const width = x2 - x1


  const onWheel: WheelEventHandler<HTMLDivElement> = (e) => {
    if (!ref.current || bounce.current) return
    bounce.current = true
    let [x1, y1, x2, y2] = bbox
    const [w, h] = [x2 - x1, y2 - y1]
    const svg = document.getElementById('root')
    const classList = svg?.classList

    // const {x, y, width: w, height: h} = ref.current.getBoundingClientRect()
    // let [x1, y1, x2, y2] =  [x, y, x + w, y + h]

    console.log(`deltaY: ${e.deltaY}`)

    const [lat, lon] = mapCoords.current

    if (e.deltaY < 0) {

      const scaleX = 0.125 * 360
      const scaleY = 0.125 * 180

      x1 -= lat
      x2 -= lat
      y1 -= lon
      y2 -= lon

      x1 += scaleX
      x2 -= scaleX
      y1 += scaleY
      y2 -= scaleY

      x1 += lat
      x2 += lat
      y1 += lon
      y2 += lon

      x1 = clamp(x1, -180, Math.min(x2 - 1, 180))
      x2 = clamp(x2, Math.max(x1 + 1, -180), 180)
      y1 = clamp(y1, -90, Math.min(y2 - 1, 90))
      y2 = clamp(y2, Math.max(y1 + 1, -90), 90)

      classList?.add('scale-[1.001]')
      classList?.remove('scale-[0.999]')

    }
    else if (e.deltaY > 0) {

      const scaleX = 0.025 * 360
      const scaleY = 0.025 * 180

      x1 -= lat
      x2 -= lat
      y1 -= lon
      y2 -= lon

      x1 -= scaleX
      x2 += scaleX
      y1 -= scaleY
      y2 += scaleY

      x1 += lat
      x2 += lat
      y1 += lon
      y2 += lon

      x1 = clamp(x1, -180, Math.min(x2 - 1, 179))
      x2 = clamp(x2, Math.max(x1 + 1, -179), 180)
      y1 = clamp(y1, -90, Math.min(y2 - 1, 89))
      y2 = clamp(y2, Math.max(y1 + 1, -89), 90)

      // x1 += 90
      // x2 += 90
      classList?.add('scale-[0.001]')
      classList?.remove('scale-[1.999]')
      // setScale(0.75)

    }

    setBbox([x1, y1, x2, y2])
    setTimeout(() => bounce.current = false, 500)

  }

  useEffect(() => {
    window.onmousemove = (e) => {
      const { x, y, width, height } = ref.current?.getBoundingClientRect() as DOMRect
      const deltaX = e.clientX - x
      const deltaY = e.clientY - y

      const [x1, y1, x2, y2] = bbox
      const lat = x1 + deltaX / width * (x2 - x1)
      const lon = y1 + deltaY / height * (y2 - y1)
      mapCoords.current = [lat, lon]
    }
    return () => { window.onmousemove = null }
  }, [bbox])

  /* "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{}\" height=\"{}\" viewBox=\"0 0 {} {}\" preserveAspectRatio=\"{}\" id=\"root\">\n" */
  return (
    <div ref={ref} onWheel={onWheel} className={`flex-col justify-center items-start w-full h-full border-2 border-black bg-blue-400 `}>
      <MapSVG bbox={bbox} />
    </div>
  )
}
