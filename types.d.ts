declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

type Coords = { key: string, value: [number, number]}

interface Post {
  id: number
  title: string
  image: string
  excerpt: string
  link: string
  categories: {[string]: number}
  tags: {[string]: number}
  coords: [{key: string, value: [number, number]}]
}