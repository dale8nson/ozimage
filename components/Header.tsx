import { HeaderCanvas } from "./HeaderCanvas"
import { NavMenu } from "./NavMenu"
import NextImage from 'next/image'

export const Header = async () => {

  const menuItems = await fetch(`${process.env.SERVER_URL}/menu/items`).then(res => res.json())
  console.log("menuItems: ", menuItems)

  return (
    <header className="relative z-50 rounded-b-2xl shadow-2xl flex items-center justify-center h-fit w-full space-y-2 pb-0  backdrop-blur-md  ">
      <div className="relative flex-col items-center justify-center h-full  w-full space-y-4 overflow-visible">
        {/* <HeaderCanvas/> */}
        <NextImage src="/Ozimage_SM_Logo.png" width={400} height={105} alt="Ozimage logo" className="m-auto pb-[40px] pt-[45px] max-w-1/2"/>
        <div className=" w-full flex justify-center items-center py-4 mb-0">
        <NavMenu menuItems={menuItems}/>
        </div>
      </div>
    </header>

  )
}