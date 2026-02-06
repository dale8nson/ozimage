import { Scroller } from "@/components/ui/scroller";
import { ReactNode } from "react";
 
export function HorizontalScroller({className, children}:{className: string, children: ReactNode}) {
  return (
    <Scroller hideScrollbar orientation="horizontal" className={`w-full p-4 ${className}`} asChild>
      <div className="flex items-start gap-2.5">
        {children}
      </div>
    </Scroller>
  );
}