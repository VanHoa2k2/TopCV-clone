import Image from "next/image";
import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import companyBillBoard from "@/assets/images/company-billBoard.webp";

const SectionCompanyHeader = () => {
  return (
    <div className="pt-6 min-h-[273px] bg-[linear-gradient(6deg,#fff,#c4ffdd_100%,rgba(195,255,221,0.702)_0%)] bg-no-repeat">
      <div className="container flex max-w-[1320px] px-[7.5px]">
        <div>
          <p className="pb-[33px] text-[14px] leading-[28px] text-[#333] font-semibold py-[5px] mb-1">
            Danh sách công ty
          </p>
          <div className="mb-[37px]">
            <h1 className="text-[#00b14f] text-2xl tracking-normal font-medium pb-3 mb-[5px] text-left">
              Khám phá 100.000+ công ty nổi bật
            </h1>
            <p className="text-[16px] text-[#333]">
              Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành
              cho bạn
            </p>
          </div>
          <form
            action=""
            className="bg-white border border-white rounded-[100px] flex h-[50px] overflow-hidden relative transition-all duration-400 hover:shadow-md"
          >
            <span className="absolute left-8 top-1/2 -translate-y-1/2 font-light">
              <HiMiniMagnifyingGlass />
            </span>
            <input
              type="text"
              placeholder="Nhập tên công ty"
              className="w-full h-full text-sm outline-none pl-[62px] border-transparent bg-white text-[#212529] font-medium leading-[1.5] transition-all duration-150 ease-in-out appearance-none bg-clip-padding rounded-[0.25rem]"
            />
            <button
              type="submit"
              className="bg-[#00b14f] rounded-[100px] text-white text-base absolute right-[7px] top-1/2 -translate-y-1/2 font-normal leading-[1.5] py-[0.375rem] px-[0.75rem] text-center"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
        <div className="ml-auto">
          <Image
            src={companyBillBoard}
            alt="company-billboard"
            width={272}
            height="304.25"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionCompanyHeader;
