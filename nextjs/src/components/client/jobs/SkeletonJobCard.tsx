import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonJobCard: React.FC = () => {
  return (
    <div className="pl-3 bg-white rounded-sm flex">
      <div className="p-[2px] flex-shrink-0 flex items-center justify-center h-full">
        <Skeleton className="w-[70px] h-[70px] rounded-sm" />
      </div>
      <div className="flex flex-col p-2 min-h-[44px] w-full">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-3" />
        <div className="flex items-center gap-1 mt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonJobCard;
