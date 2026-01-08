declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '@/theatre/r3f/dist/extension'

type Option<T> = T | null

type Coords = { key: string, value: [number, number] }

type Image = {
  id: number,
  b64: string
  width: number
  height: number
  alt: string
  coords?: Coords
}

interface Post {
  id: number
  date: string,
  title: string
  slug: string
  excerpt: string
  image: Image
  link: string
  categories: { [string]: number }
  tags: { [string]: number }
  coords?: [{ key: string, value: [number, number] }]
}

interface MenuItem {
  id: number,
  title: {rendered: string},
  parent: number,
  menu_order: number,
  url: string
}