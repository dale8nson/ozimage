import { EarthIcon } from "./EarthIcon"

export const TravelAnalytics = () => {
  return (
    <div className="flex items-center justify-center border border-[#303030] w-fit h-fit m-auto">
      <div className="flex-col space-y-2 p-2">
        <EarthIcon className="size-24 scale-100" />
      </div>
      {/* <div className="flex-col space-y-2 p-2"></div>
      <div className="flex-col space-y-2 p-2"></div> */}
    </div>
  )
}