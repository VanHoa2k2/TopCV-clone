import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCompanyCard: React.FC = () => {
  return (
    <div className="rounded-[5px] shadow-[-1px_1px_4px_rgba(0,0,0,0.051)] h-[400px] mb-6 overflow-hidden hover:shadow-[0_5px_10px_0_rgba(0,0,0,0.07)] transition-shadow duration-300">
      <div className="relative">
        <div className="h-[180px] mb-4 overflow-hidden">
          <Skeleton className="h-[150px] w-full" />
          <div className="absolute bottom-0 left-4 w-16 h-16 bg-white border border-gray-200 rounded-md">
            <Skeleton className="w-full h-full rounded-md" />
          </div>
        </div>
      </div>
      <div className="px-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <div className="text-[#555] text-[14px] leading-normal pt-4 h-[140px] overflow-hidden line-clamp-6">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCompanyCard;
