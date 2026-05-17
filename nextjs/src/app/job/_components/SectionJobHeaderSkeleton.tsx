import { Skeleton } from "@/components/ui/skeleton";

const SectionJobHeaderSkeleton = () => {
  return (
    <div className="pb-6 pt-8 bg-sectionJobHeader relative">
      <div className="container">
        <div className="text-center mb-4">
          <Skeleton className="mx-auto h-8 w-[600px] mb-[6px]" />
          <Skeleton className="mx-auto h-4 w-[500px]" />
        </div>
        <div className="bg-white border border-[#e6e7e8] rounded-full shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] h-16 px-6 py-2.5 w-full lg:w-[1140px] mb-4 mx-auto flex items-center gap-4">
          <Skeleton className="h-11 flex-1 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-full hidden lg:block" />
          <Skeleton className="h-11 w-32 rounded-full hidden lg:block" />
          <Skeleton className="h-11 w-28 rounded-full" />
        </div>
        <div className="flex items-center justify-center">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="mt-6">
          <Skeleton className="mx-auto h-[180px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default SectionJobHeaderSkeleton;
