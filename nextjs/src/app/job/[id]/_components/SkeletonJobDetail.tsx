import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonJobDetail: React.FC = () => {
  return (
    <div className="bg-[#f4f5f5] pb-10">
      <div className="container">
        <div className="flex flex-wrap items-center py-3">
          <Skeleton className="h-5 w-1/4 mb-2" />
          <span className="flex items-center justify-center w-4 h-4 mx-1 text-sm font-normal text-[#212f3f]">
            <Skeleton className="h-4 w-4" />
          </span>
          <Skeleton className="h-5 w-1/2 mb-2" />
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col gap-6 w-[67%]">
            <div className="flex flex-col gap-4 bg-white rounded-lg py-5 px-6 w-full">
              <Skeleton className="h-8 w-full mb-2" />
              <div className="flex items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 w-[33.3333333333%]"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col gap-0.5">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="h-6 w-1/2 mb-2" />
              <div className="flex items-center flex-wrap gap-3 mt-1">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-10 w-1/4" />
              </div>
            </div>

            <div className="flex flex-col gap-5 bg-white rounded-lg py-5 px-6 w-full">
              <div className="h-10 flex items-center">
                <Skeleton className="h-8 w-1/4" />
              </div>
              <Skeleton className="h-40 w-full" />
            </div>
          </div>

          <div className="flex items-center flex-col gap-6 w-calc-left-content-job-detail ">
            <div className="flex flex-col gap-4 rounded-lg bg-white p-5 w-full">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="bg-white rounded-2 p-5 w-full">
              <Skeleton className="h-8 w-1/4 mb-4" />
              <div className="flex flex-col gap-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2 p-5 w-full flex flex-col gap-5">
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonJobDetail;
