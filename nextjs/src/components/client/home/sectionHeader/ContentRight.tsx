import Image from "next/image";
import React from "react";
import IconSearch from "@/assets/icons/work_market_star.webp";
import TrendHrChart from "@/assets/icons/trend-hr-chart.webp";
import dayjs from "dayjs";
import jobApiRequest from "@/apiRequests/job";
import { FaArrowTrendUp } from "react-icons/fa6";
import Chart from "./Chart";
import CountUpTotalJobs from "./CountUpTotalJobs";

export default async function ContentRight() {
  const { data: totalJobs } = await jobApiRequest.callFetchTotalJobs();
  const { data: occupationData } =
    await jobApiRequest.callFetchParamsOccupation();

  return (
    <div className="bg-[#212f3f4d] rounded-xl px-6 py-4 w-[571px] transition-all duration-300 ease-in-out border border-solid border-transparent hover:shadow-contentRight hover:border-[#11d769]">
      <div className="mb-4">
        <div className="flex justify-between mb-[22px]">
          <span className="text-white flex text-[14px] leading-[22px] gap-2 tracking-[.175px] font-semibold">
            <Image src={IconSearch} alt="IconSearch" width={24} height={24} />
            Thị trường việc làm hôm nay:
          </span>
          <span className="text-[#11d769] text-[14px] leading-[22px] tracking-[.175px] font-semibold">
            {dayjs(new Date()).format("DD/MM/YYYY")}
          </span>
        </div>
        <div className="ml-2 mb-[18px] flex gap-2 items-center">
          <span className="text-white text-[14px] font-semibold tracking-[.175px] leading-[22px]">
            Việc làm đang tuyển
          </span>
          <CountUpTotalJobs totalJobs={totalJobs} />
          <div className="text-[#11d769] h-6 w-6 flex items-center justify-center bg-[#11d7691a] rounded-[15px] p-[6px] text-[12px]">
            <FaArrowTrendUp />
          </div>
        </div>
        <div className="bg-line h-[2px] opacity-[.6000000238]"></div>
      </div>
      <div className="flex items-center gap-2 mb-[14px] h-9">
        <Image src={TrendHrChart} alt="Trend hr Chart" width={24} height={24} />
        <span className="text-white font-semibold">
          Nhu cầu tuyển dụng theo ngành nghề
        </span>
      </div>
      <Chart occupationData={occupationData} />
    </div>
  );
}
