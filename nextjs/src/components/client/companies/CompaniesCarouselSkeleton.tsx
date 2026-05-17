import { Skeleton } from "@/components/ui/skeleton";

const CompaniesCarouselSkeleton = () => {
  return (
    <div className="container pt-6 mb-10">
      <div className="flex items-center justify-between pb-4">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center gap-[11px]">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
      <div className="flex gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border border-solid border-[#dee0e2] rounded-xl px-4 py-5 min-h-[184px] flex flex-col items-center justify-center"
          >
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-4 w-3/4 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesCarouselSkeleton;
