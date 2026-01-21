import { ReactNode } from "react"

export const Footer = ({children}:{children?: ReactNode}) => {
  return (
    <div className="relative z-50 bg-[#181818] text-white flex-col items-center justify-start [**:bg-[#303030]] w-full h-full max-h-87.5">
      {children}
    </div>
  )
}