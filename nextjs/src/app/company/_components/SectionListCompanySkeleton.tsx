import { Skeleton } from "@/components/ui/skeleton";

const SectionListCompanySkeleton = () => {
  return (
    <div className="container max-w-[1320px] px-[7.5px]">
      <Skeleton className="mx-auto h-8 w-[400px] my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[15px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[5px] shadow-[-1px_1px_4px_rgba(0,0,0,0.051)] h-[400px] mb-6 overflow-hidden"
          >
            <Skeleton className="h-[150px] w-full rounded-none" />
            <div className="px-4 pt-10 pb-4">
              <Skeleton className="h-5 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionListCompanySkeleton;
