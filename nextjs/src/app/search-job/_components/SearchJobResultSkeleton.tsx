import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Banner from "@/assets/images/Banner-job-search.webp";
import Report from "@/assets/images/recruiment_report_2023_2024.webp";
import Link from "next/link";

const SearchJobResultSkeleton = () => {
  return (
    <div className="container">
      <div className="py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
      </div>
      <div className="flex pb-10 gap-5">
        <div className="w-[75%] flex flex-col gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg flex gap-5 p-3 bg-[#faf5ff] border border-[#ddd6fe]"
            >
              <Skeleton className="h-[120px] w-[120px] rounded-lg" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-[70%] mb-2" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-5 w-[60%] mb-2" />
                <Skeleton className="h-5 w-[50%] mb-2" />
              </div>
            </div>
          ))}
        </div>
        <div className="w-[25%]">
          <div className="sticky top-[85px] flex flex-col gap-5">
            <Link href="/">
              <Image
                src={Banner}
                alt="Banner"
                width={365}
                height={660}
                className="rounded-[8px]"
              />
            </Link>
            <Link href="/">
              <Image
                src={Report}
                alt="Report"
                width={351}
                height={276}
                className="rounded-[8px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchJobResultSkeleton;
