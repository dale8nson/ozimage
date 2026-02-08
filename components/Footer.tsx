import { ReactNode } from "react"

export const Footer = ({className, children}:{className?: string, children?: ReactNode}) => {
  return (
    <div className={`relative z-50 bg-[#181818] text-white flex-col items-center justify-center [**:bg-[#303030]] w-full h-fit  max-h-87.5 p-24 m-0 ${className}`}>
      {children}
    </div>
  )
}