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

export const NavMenu = () => {

  const [activeItem, setActiveItem] = useState<string>("home")

  return (
    <NavigationMenu defaultValue="home" value={activeItem} onValueChange={(v) => { setActiveItem(v) }}>
    <NavigationMenuList>
      <NavigationMenuItem value="home">
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
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  )
}