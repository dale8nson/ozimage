/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, createElement, Fragment, FunctionComponent, FragmentProps, ComponentClass } from "react";
import { formatWithOptions } from "node:util";

type Attrs = { [attr: string]: string | number | { [property: string]: string | number | boolean } | null | boolean }
type Node = { tag: string | FunctionComponent<FragmentProps> | ComponentClass<FragmentProps, any>, attrs: Attrs, content: DomTree | string | null | undefined }
type DomTree = Node[]

interface Iterator<T> extends ArrayLike<T> {
  cur: number;
  next: (n?: number) => T | null
  prev: () => T | null
  peek: (n?: number, offset?: number) => T | null
  expect: (tk: T, fn?: (_: T) => boolean) => void
  tell: () => number
  nextwhile: (re: RegExp) => T
  peekwhile: (re: RegExp, n?: number) => T
}


function toIter<T>(obj: ArrayLike<T>): Iterator<T> {
  const iter = Object(obj)
  iter.cur = 0

  iter.peek = (n?: number, offset?: number) => {
    if (!n) n = 1
    if (!offset) offset = 0
    let str = ""
    for (let i = 0; i < n && iter.cur + i + offset < iter.length; str += iter[iter.cur + i + offset], i++);
    return str.length > 0 ? str : null
  }

  iter.peekwhile = (re: RegExp, n?: number) => {
    if (!n) n = 1
    let str = ""
    let i = 0
    for (i = 0; iter.peek(n, i) && re.test(iter.peek(n, i)); str += iter.peek(1, i++));

    return str.length > 0 ? str : null
  }

  iter.next = (n?: number) => {
    if (!n) n = 1
    let str = ""
    for (let i = 0; i < n && iter.cur < iter.length; str += iter[iter.cur++], i++);
    return str.length > 0 ? str : null
  }

  iter.tell = () => iter.cur
  iter.expect = (tk: T, fn?: (_: T) => boolean) => {
    const tk_ = fn ? fn(tk) : tk
    const next = iter.next()
    if (tk_ !== next) throw Error(`expected '${tk_}', found '${next}'`)
  }

  iter.nextwhile = (re: RegExp, n?: number) => {
    if (!n) n = 1
    let str = ""
    while (iter.peek(n) && re.test(iter.peek(n))) str += iter.next()
    return str.length > 0 ? str : null
  }

  return iter as Iterator<T>
}

function replacer(match: string, p1: string) {
  // console.log(`match: ${match}`)
  return p1.toUpperCase()
}

const transform = (txt: string): string => {
  // console.log(`transform(${txt})`)
  const match = /-(\w)/g
  let res = txt.replaceAll(match, replacer) ?? txt
  // console.log(`res: ${res}`)
  if (res === 'srcset') res = 'srcSet'
  if (res === 'dataId') res = 'dataid'
  if (res === 'dataType') res = 'datatype'
  return res
}

const tree2string = (tree: DomTree, indent?: number) => {
  if (indent) indent = Math.max(0, indent)
  else indent = 0

  let output: string = '  '.repeat(indent++) + "[\n"
  for (const { tag, attrs, content } of tree) {
    output += '  '.repeat(indent++) + `{ "${typeof tag === 'symbol' ? (tag as symbol).toString() : tag}": {\n`
    if (attrs) {
      output += '  '.repeat(indent++) + `"attrs": {\n`
      for (const [k, v] of Object.entries(attrs)) {
        if (k === 'style') {
          output += '  '.repeat(indent++) + '"style": {\n'
          for (const [prop, value] of Object.entries(v as { [key: string]: string })) {
            output += '  '.repeat(indent) + `"${prop}": ${value}\n`
          }
          output += '  '.repeat(--indent) + '}\n'
        } else {
          output += '  '.repeat(indent) + `"${k}": ${v}\n`
        }
      }
      output += '  '.repeat(--indent) + '}\n'
    }
    if (content) {
      output += '  '.repeat(indent++) + '"content": '
      output += typeof content === 'string' ? `"${content}"` + '\n' : 
      '{\n' + '  '.repeat(indent) 
      + tree2string(content as DomTree, ++indent)
      + '  '.repeat(--indent) + '}\n'
    }
    output += '  '.repeat(--indent) + '}\n'
  }

  // output += '  '.repeat(indent--) + '}\n'
  // console.log(output)
  output += '  '.repeat(--indent) + ']\n'
  return output
}

const drawTree = (tree: DomTree) => {
  const _tree: DomTree = []
  for (const {tag, attrs, content } of tree) {
    const node = {tag, attrs, content}
    if (typeof content === 'string') node["content"] = content
    else node.content = drawTree(content as DomTree)
    _tree.push(node)
  }
  return _tree.toString()
}

function parseHtml(cont: string, tagTable?: string[], iterator?: Iterator<string>) {
  let res: DomTree | string = []
  const dt: DomTree = []
  const attrs: Attrs = {}
  let content: DomTree | string | null = null
  const tags: string[] = tagTable ?? []

  const iter = iterator ?? toIter(String(cont) as ArrayLike<string>)

  let isSelfClosing = false

  parse()

  function parse() {
    for (let c = iter.next(); c !== null; c = iter.next()) {
      // if (isSelfClosing) console.log(`self-closing c: ${c}`)
      isSelfClosing = false
      // console.log(`c: ${c}`)
      switch (c) {
        case /\U+0020/.test(c) && c:
          // console.log(`space`)
          break
        case /\t/.test(c) && c:
          // console.log(`tab`)
          break
        case /[\n\l\r]/.test(c) && c:
          // console.log(`newline`)
          break
        case "<":
          if (iter.peek() == '/') {
            iter.next()
            const endTag = iter.nextwhile(/[^\s\/>]/)
            const tag = tags[tags.length - 1]
            // console.log(`</${tag}>`)
            iter.next()
            // console.log(`95 tags:`, tags)
            if (endTag !== tag) throw new Error(`tag mismatch: expected ${tag}, got ${endTag}`)
            tags.pop()
            res = dt
            continue
          }

          const tag = iter.nextwhile(/[^\s\/>]/)
          let tagOutput = `<`
          tags.push(tag)
          // console.log(`107 tags:`, tags)
          // console.log(`iter.peek(2): ${iter.peek(2)}    iter.peek(3): ${iter.peek(3)}`)
          while (iter.peek() && /[^/>]/.test(iter.peek() as string)) {
            iter.nextwhile(/[\s]/)
            // console.log(`iter.peekwhile(/[^\/>]/): ${iter.peekwhile(/[^\/>]/)}`)
            let attr = iter.nextwhile(/[\w-_\d]/)
            // console.log(`attr: ${attr}`)
            // console.log(`iter.peek(2): ${iter.peek(2)}`)
            // console.log(`iter.peek(3): ${iter.peek(3)}`)

            if (!attr) {
              if (iter.peek(2) == '/>' || iter.peek(3) == ' />') {
                isSelfClosing = true
                
                iter.nextwhile(/[^>]/)
                iter.next()
                const tag = tags.pop()
                
                // console.log(`145 tags:`, tags)
                if (tag) {
                  tagOutput += `/>`
                  // console.log(`${tagOutput}`)
                  // content = parseHtml(cont, tags, iter)
                  // console.log(`content: `, content)
                  dt.push({ tag, attrs: attrs ?? [], content: [] })
                  // console.log(`dt: `, dt)
                }
                // parse()
                break
              }
              
              iter.nextwhile(/[\s]/)
              // console.log(`196 peek: ${iter.peekwhile(/[^>]./, 2)}`)
              if (iter.peek() == '>') {
                iter.next()
                // tagOutput += '>'
                // console.log(tagOutput)
                // console.log(`iter.tell() before: ${iter.tell()}`)
                // console.log(`tags before: `, tags)
                content = parseHtml(cont, tags, iter)
                // console.log(`${tags[tags.length - 1]} content: `, content)
                // console.log(`tags after: `, tags)
                // console.log(`iter.tell() after: ${iter.tell()}`)
                const tag = tags.pop()
                // console.log(`153 tags:`, tags)
                if (tag) {
                  dt.push({ tag, attrs, content })
                  // console.log(`dt: `, dt)
                  // }
                  res = dt
                  continue
                }
              }
              break
            }

            if(isSelfClosing) break

            if (iter.peek() && /[\s]/.test(iter.peek() as string)) {
              iter.next()
              attr = transform(attr)
              attrs[attr] = true
              break
            }
            attr = transform(attr)
            if (attr === 'class') attr = 'className'
            // console.log(`attr: ${attr}`)
            // console.log(iter.peek(10))
            iter.nextwhile(/[\s]/)
            iter.expect('=')
            iter.nextwhile(/[\s]/)
            let val: number | string = ""

            // console.log(`iter.peekwhile(/[^<]/): ${iter.peekwhile(/[^<]/)}`)

            const peek = iter.peek()
            // console.log(`peek: ${peek}`)
            if (peek && /['"]/.test(peek as string)) {
              val = iter.next() as string
              val += iter.nextwhile(peek == "'" ? /[^']/ : /[^"]/); val += iter.next()
            }
            else {
              val = iter.nextwhile(/[^\s]/)
              if (val.split("").every(c => /[\d]/.test(c))) val = Number.parseFloat(val)
            }

            // console.log(`${iter.peekwhile(/[^\s]/)}`)
            // console.log(`val: ${val}`)
            // console.log(`iter.peekwhile(/[^\\w]): ${iter.peekwhile(/[^\w]/)}`)

            if (attr === 'style') {
              const style: { [prop: string]: string | number } = {}
              const styleIter = toIter(val as string)
              while (styleIter.peek()) {
                styleIter.nextwhile(/[/s"']/)
                let prop = styleIter.nextwhile(/[^:]/)
                if (prop) {
                  prop = transform(prop)
                  // console.log(`prop: ${prop}`)
                  styleIter.next()
                  styleIter.nextwhile(/[^\w\d]/)
                  const propValue = styleIter.nextwhile(/[^;]/)
                  style[prop] = propValue.split("").some(c => /[\D]/.test(c)) ? `"${propValue}"` : propValue;
                  // console.log(`style[${prop}]: `, style[prop])
                  styleIter.nextwhile(/[;\s]/)
                }
              }
              attrs[attr] = style
              continue
            }
            attrs[attr] = val


          }

          if (isSelfClosing) break

          // console.log(`attrs: `, attrs)
          iter.nextwhile(/[/s>]/)
          // console.log(`299 iter.peek(10): ${iter.peek(10)}`)
          content = parseHtml(cont, tags, iter)
          // console.log(`tag: ${tag}`)
          // console.log(`tags.pop(): ${tags.pop()}`)
          // console.log(`199 tags: `, tags)
          dt.push({ tag, attrs, content: content ?? [] })
          continue

        case /[^<]/.test(c) && c:
          // console.log(`^< c: ${c}`)
          const txt = c + iter.nextwhile(/[^<]/)
          // console.log(`^< dt before: `, dt)
          // while (iter.peek() !== '<') txt += iter.next()
          // console.log(`txt: ${txt}`)
          dt.push({ tag: Fragment, attrs: {}, content: txt })
          // console.log(`^< dt after: `, dt)
          continue
        default:
          console.log(`default case for '${c}'`)
          break
      }
    }
    // console.log(`dt`, dt)
    res = dt
  }
  // console.log(`res: \n`, res)
  return res
}

const createNode = (tree: DomTree): ReactElement[] => {
  const els: ReactElement[] = []
  // console.log(tree2string(tree))

  for (const node of Object.values(tree as DomTree)) {
    // console.log(`node:`, node)
    try {
      const { tag, attrs, content } = node
      if (attrs) attrs["key"] = crypto.randomUUID()
      els.push(createElement(tag, attrs, typeof content === 'string' ? content : tag === 'img' ? undefined : createNode(content as DomTree)))
    } catch (e) {
      console.log(node)
      console.log(e)
      // throw e

    }
  }

  return els
}

export const Html = ({ children }: { children: string }) => {
  const tree = parseHtml(children)
  
  console.log(formatWithOptions({depth: Infinity, colors: true}, tree))
  //  console.log(tree2string(tree))
  const nodes = createNode(tree)

  return nodes
}