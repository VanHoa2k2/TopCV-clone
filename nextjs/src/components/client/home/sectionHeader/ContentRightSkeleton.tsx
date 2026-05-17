import { Skeleton } from "@/components/ui/skeleton";

const ContentRightSkeleton = () => {
  return (
    <div className="hidden lg:block bg-[#212f3f4d] rounded-xl px-6 py-4 w-[571px]">
      <div className="mb-4">
        <div className="flex justify-between mb-[22px]">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="ml-2 mb-[18px] flex gap-2 items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="bg-line h-[2px] opacity-[.6000000238]"></div>
      </div>
      <div className="flex items-center gap-2 mb-[14px] h-9">
        <Skeleton className="w-6 h-6 rounded" />
        <Skeleton className="h-5 w-56" />
      </div>
      <Skeleton className="h-[200px] w-full rounded-lg" />
    </div>
  );
};

export default ContentRightSkeleton;
