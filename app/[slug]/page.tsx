// 'use cache'


import parse, { domToReact } from 'html-react-parser'

export default async  function Page ({params}:{params: Promise<{slug: string}>}) {
  const { slug } = await params
  const content = await fetch(`http://localhost:8080/post/${slug}`).then(res => res.text())
  console.log(`content: `, content)

  // content = content.replace("\\r\\n", "")
  const re = /<(.+?)\s(\/>|>(.+)<\/\1>)/

  const parse2 = (s: string) => {
    if (s == "") return 
  }

  return (
    <div className="flex-col justify-start items-start p-8 text-white w-full h-full"
    // dangerouslySetInnerHTML={{__html: content}}
    >
    {[parse(`${content}`)]}
    </div>
  )
  
}