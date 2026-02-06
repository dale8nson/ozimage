import { HeaderCanvas } from "./HeaderCanvas"
import { NavMenu } from "./NavMenu"
import NextImage from 'next/image'

export const Header = async () => {

  const menuItems = await fetch(`${process.env.SERVER_URL}/menu/items`).then(res => res.json())
  // console.log("menuItems: ", menuItems)

  return (
    <header className="relative z-50 shadow-2xl flex items-center justify-center h-fit w-full space-y-2 bg-transparent backdrop:opacity-0 ">
      <div className="absolute top-0 bg-[url(/Texturelabs_Grunge_155M.jpg)] w-full h-full opacity-30 backdrop-cover brightness-125" />
      <div className="relative flex-col items-center justify-center h-full  w-full space-y-4 overflow-visible bg-transparent">
        {/* <HeaderCanvas/> */}
        <NextImage src="/Ozimage_SM_Logo.png" width={400} height={105} alt="Ozimage logo" className="m-auto pb-[40px] pt-[45px] max-w-1/2 drop-shadow-2xl drop-shadow-[#004071]/70 "/>
        <div className=" w-full flex justify-center items-center mb-0">
        <NavMenu menuItems={menuItems}/>
        </div>
      </div>
      
    </header>

  )
}