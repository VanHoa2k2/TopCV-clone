import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCompanyDetail: React.FC = () => {
  return (
    <div className="bg-[#f4f5f5] pb-10">
      <div className="container">
        <div className="flex flex-wrap items-center py-5">
          <Skeleton className="h-5 w-1/4 mb-2" />
        </div>

        <div className="bg-bgCompanyDetail rounded-[10px] h-[358px] overflow-hidden mb-6">
          <div className="h-[224px] overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-center bg-white border-[4.5px] border-solid border-white rounded-[99px] h-[180px] w-[180px] overflow-hidden absolute top-[-90px] left-10">
              <Skeleton className="w-[80%] h-[80%] rounded-full" />
            </div>
          </div>

          <div className="pl-[252px] pr-[40px] my-[30px]">
            <Skeleton className="h-5 w-1/2 mb-4" />
            <div className="flex items-center gap-5 w-full">
              <div className="flex whitespace-nowrap">
                <Skeleton className="h-4 w-1/4 mr-4" />
              </div>
              <div className="flex whitespace-nowrap">
                <Skeleton className="h-4 w-1/4 mr-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-[30px]">
          <div className="w-[66.66666667%] mb-8 rounded-[10px] bg-white overflow-hidden">
            <h2 className="bg-bgCompanyDetail text-white text-[18px] font-semibold leading-[26px] py-3 px-5">
              Giới thiệu công ty
            </h2>
            <div className="px-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
            </div>
          </div>

          <div className="w-[33.33333333%] h-full mb-8 rounded-[10px] bg-white overflow-hidden">
            <h2 className="bg-bgCompanyDetail text-white text-[18px] font-semibold leading-[26px] py-3 px-5">
              Thông tin liên hệ
            </h2>
            <div className="pt-5 pb-7 px-5">
              <div className="flex items-center mb-2">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCompanyDetail;
