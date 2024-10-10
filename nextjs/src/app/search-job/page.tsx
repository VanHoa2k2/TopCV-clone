import jobApiRequest from "@/apiRequests/job";
import React from "react";
import HeaderSearchJobPage from "./_components/HeaderSearchJobPage";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import dayjs from "dayjs";
import Image from "next/image";
import Banner from "@/assets/images/Banner-job-search.webp";
import Report from "@/assets/images/recruiment_report_2023_2024.webp";
import NoneResult from "@/assets/images/none-result.webp";
import JobCardSuggest from "@/components/client/jobs/JobCardSuggest";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  searchParams: { name: string; location: string };
}

// Nhận searchParams từ context của Server Component
const SearchJobPage = async ({ searchParams }: IProps) => {
  const { name, location } = searchParams;
  const queryParams = new URLSearchParams({
    current: "1",
    pageSize: "50",
    ...(name && { name: name }),
    ...(location && { location: location }),
  });

  const res = await jobApiRequest.callFetchJob(queryParams.toString());

  return (
    <div className="bg-[#f3f5f7]">
      <div className="bg-[#19734e] py-4">
        <HeaderSearchJobPage name={name} location={location} />
      </div>
      <div className="container">
        <div className="py-3">
          <div className="flex items-center">
            <Link
              href="/"
              className="pr-2.5 text-sm text-primary font-semibold"
            >
              Trang chủ
            </Link>
            <div className="text-sm text-[#212f3f]">
              <IoIosArrowForward />
            </div>
            <p className="text-[#212f3f] text-[14px] leading-[22px] pl-2.5">
              Tuyển dụng {res.data?.result.length} việc làm {name} [Update{" "}
              {dayjs(new Date()).format("DD/MM/YYYY")}]
            </p>
          </div>
        </div>
        <div className="flex pb-10 gap-5">
          <div className="w-[75%] flex flex-col gap-5">
            {res?.data?.result ? (
              res?.data?.result.length > 0 ? (
                res?.data?.result.map((job) => (
                  <JobCardSuggest job={job} key={job.id} />
                ))
              ) : (
                <div className="flex items-center justify-center flex-col py-5 bg-[#fff] my-5 rounded-md">
                  <Image
                    src={NoneResult}
                    alt="None Result"
                    width={200}
                    height={200}
                  />
                  <span className="text-[12px] leading-[16px] text-[#6f7882] font-medium">
                    Chưa tìm thấy việc làm phù hợp với yêu cầu của bạn
                  </span>
                </div>
              )
            ) : (
              Array(6)
                .fill(0)
                .map((_, index) => <JobCardSkeleton key={index} />)
            )}
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
    </div>
  );
};

const JobCardSkeleton = () => (
  <div className="rounded-lg flex gap-5 p-3 bg-[#f2fbf6] border border-[#acf2cb]">
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
);

export default SearchJobPage;
