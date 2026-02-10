import { Skeleton } from './ui/skeleton';
 

export const CarouselSkeleton = () => {

  return (
    <div className='relative h-198.25 flex-col justify-start items-start bg-transparent rounded-2xl w-full  max-w-370 m-auto overflow-clip' >
      <div className="relative flex-col justify-center space-y-2 w-full max-w-370 h-full max-h-208">
        <Skeleton className='w-full h-screen grow max-h-184 max-w-370 object-cover' />
        <Skeleton className='relative z-20 w-full h-75.5 max-w-370'/>
      </div>
    </div>
  );
}
