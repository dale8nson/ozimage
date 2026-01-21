'use client'

import { useState } from "react"


import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export const NavMenu = ({menuItems}:{menuItems: MenuItem[]}) => {
console.log("menuItems: ", menuItems)
  const [activeItem, setActiveItem] = useState<string>("home")

  return (
    <NavigationMenu defaultValue="home" value={activeItem} onValueChange={(v) => { setActiveItem(v) }}>
    <NavigationMenuList>
      {menuItems.map(item => {
        return (
         <NavigationMenuItem key={item.id} value={item.title.rendered.toLowerCase()}>
        <NavigationMenuLink asChild active={activeItem == item.title.rendered.toLowerCase()} className="text-[#004071] hover:text-green-500 active:text-green-500 font-bold text-lg ">
          <Link href={item.url} >{item.title.rendered}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem> 
        )
      })}
      {/* <NavigationMenuItem value="home">
        <NavigationMenuLink active={activeItem == "home"} className="text-red-500 hover:text-green-500 active:text-green-500 font-bold text-lg">Home</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem value="about">
        <NavigationMenuLink active={activeItem == "about"} className="text-red-500 hover:text-green-500 active:text-green-500 font-bold text-lg">About Marjie</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem value="publications">
        <NavigationMenuTrigger className="text-red-500 hover:text-green-500 active:text-green-500 font-bold text-lg">In Print</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink>Link</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="contact">
        <NavigationMenuTrigger className="text-red-500 hover:text-green-500 active:text-green-500 font-bold text-lg">Contact</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink>Link</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem> */}
    </NavigationMenuList>
  </NavigationMenu>
  )
}