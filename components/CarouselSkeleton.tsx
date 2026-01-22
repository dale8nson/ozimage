import { Skeleton } from './ui/skeleton';

export const CarouselSkeleton = () => {

  return (
    <div className='relative flex-col justify-start items-start w-full h-full rounded-2xl max-h-208  max-w-370 m-auto' >
      <div className="relative flex-col justify-center space-y-2 w-full max-w-370 h-auto max-h-208">
        <Skeleton className='w-full h-screen grow max-h-184 max-w-370 object-cover' />
        <Skeleton className='relative z-20 w-full h-screen max-w-370 max-h-37.75'/>
      </div>
    </div>
  );
}
