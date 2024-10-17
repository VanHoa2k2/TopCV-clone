import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { IoBriefcaseOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import jobApiRequest from "@/apiRequests/job";
import JobBannerCarousel from "./JobBannerCarousel";
import bgLeft from "@/assets/images/bg-left.webp";
import bgRight from "@/assets/images/bg-right.webp";
import robot from "@/assets/images/robot.webp";
import Image from "next/image";

const SectionJobHeader = async () => {
  const { data: totalJobs } = await jobApiRequest.callFetchTotalJobs();
  return (
    <div className="pb-6 pt-8 bg-sectionJobHeader relative">
      <div className="container">
        <div className="text-center mb-4">
          <h1 className="text-[20px] leading-[28px] lg:text-[30px] lg:leading-[32px] text-[#009643] font-bold mb-[6px]">
            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
          </h1>
          <p className="text-[#263a4d] text-xs font-normal tracking-[0.12px] leading-4 text-center mb-[10px]">
            Tiếp cận{" "}
            <span className="text-sm font-semibold tracking-[0.175px] leading-[22px]">
              40,000+
            </span>{" "}
            tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín
            tại Việt Nam
          </p>
        </div>
        <form
          action=""
          className="flex items-center bg-white border border-[#e6e7e8] rounded-full shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] gap-4 h-16 px-6 py-2.5 w-full lg:w-[1140px] mb-4 relative z-[4]"
        >
          <div className="flex-1 relative z-[4] flex justify-between">
            <div className="flex items-center justify-between gap-2 h-11 p-0 mx-2 relative">
              <input
                type="text"
                placeholder="Vị trí tuyển dụng"
                className="bg-transparent shadow-none text-[#212f3f] text-sm font-medium leading-6 tracking-[-0.16px] p-0 w-full lg:w-[410px] h-full outline-none"
              />
              <div className="cursor-pointer flex items-center justify-center w-6 h-6 bg-transparent border-none visible text-[#b3b8bd] text-xl font-normal leading-5">
                <HiMiniXMark />
              </div>
              <span className="bg-lineJobHeader h-full absolute right-[-8px] w-[1px]"></span>
            </div>
            <div className="px-2 relative hidden lg:flex items-center gap-2 mx-2 cursor-pointer w-full">
              <div className="absolute flex items-center justify-center w-6 h-6 text-[#7f878f] text-base font-normal leading-5 text-center">
                <IoLocationOutline />
              </div>
              <div className="w-[222px] h-full outline-none">
                <div className="flex items-center justify-around w-full h-full gap-2.5 bg-transparent border-none p-0 text-[rgba(0,0,0,0.87)] text-xs outline-none appearance-none rounded-[2px] shadow-none">
                  <span className="ml-4 text-[#263a4d] block flex-1 text-sm font-medium tracking-[0.14px] leading-[22px] max-w-[140px] overflow-hidden truncate whitespace-nowrap">
                    Tất cả tỉnh/thành phố
                  </span>
                  <span className="flex text-[#7f878f] items-center justify-center w-6 h-6 text-xl static">
                    <IoIosArrowDown />
                  </span>
                </div>
              </div>
              <span className="bg-lineJobHeader h-full absolute right-[-8px] w-[1px]"></span>
            </div>
            <div className="px-2 relative hidden lg:flex items-center gap-2 mx-2 cursor-pointer w-full">
              <div className="absolute flex items-center justify-center w-6 h-6 text-[#7f878f] text-base font-normal leading-5 text-center">
                <IoBriefcaseOutline />
              </div>
              <div className="w-[222px] h-full outline-none">
                <div className="flex items-center justify-around w-full h-full gap-2.5 bg-transparent border-none p-0 text-[rgba(0,0,0,0.87)] text-xs outline-none appearance-none rounded-[2px] shadow-none">
                  <span className="ml-4 text-[#263a4d] block flex-1 text-sm font-medium tracking-[0.14px] leading-[22px] max-w-[140px] overflow-hidden truncate whitespace-nowrap">
                    Tất cả ngành nghề
                  </span>
                  <span className="flex text-[#7f878f] items-center justify-center w-6 h-6 text-xl static">
                    <IoIosArrowDown />
                  </span>
                </div>
              </div>
              <span className="bg-lineJobHeader h-full absolute right-[-8px] w-[1px]"></span>
            </div>
            <div className="pr-[2px] pl-2.5">
              <Button className="w-full flex items-center justify-center gap-2 h-11 px-5 bg-[#00b14f] text-white text-sm font-semibold leading-6 rounded-full transition duration-300">
                <span className="hidden lg:block text-lg">
                  <HiMiniMagnifyingGlass />
                </span>{" "}
                Tìm kiếm
              </Button>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 p-1 px-2">
            <span className="text-[#263a4d] text-xs font-normal tracking-[0.12px] leading-4">
              Vị trí chờ bạn khám phá
            </span>
            <span className="text-primary">{totalJobs}</span>
          </div>
        </div>

        <JobBannerCarousel />
      </div>

      <Image
        src={bgLeft}
        alt="bg-left"
        className="hidden lg:block absolute top-0 left-0"
        width={131}
        height={350}
      />
      <Image
        src={bgRight}
        alt="bg-right"
        className="hidden lg:block absolute top-0 right-0"
        width={93}
        height={24}
      />
      <Image
        src={robot}
        alt="robot"
        className="hidden lg:block absolute right-[43.14px] top-[14px]"
        width={111.86}
        height={140.71}
      />
    </div>
  );
};

export default SectionJobHeader;
