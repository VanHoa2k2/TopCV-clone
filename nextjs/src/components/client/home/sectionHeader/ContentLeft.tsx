"use client";
import { IoIosSearch } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import banner from "@/assets/images/banner.webp";
import BannerCtu from "@/assets/images/banner-ctu.webp";
import FadingHeadline from "./FadingHeadline";
import { FaCheck } from "react-icons/fa";
import { useState } from "react";
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";

const ContentLeft = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<{
    label: string;
    value: string;
  }>({
    label: "Tất cả địa điểm",
    value: "",
  });
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const [valueSearchJob, setValueSearchJob] = useState<string>("");
  const filterOptions = [
    { label: "Tất cả địa điểm", value: "" },
    { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
    { label: "Hà Nội", value: "Hà Nội" },
    { label: "Cần Thơ", value: "Cần Thơ" },
  ];

  const handleFilterChange = (value: { label: string; value: string }) => {
    setSelectedFilter(value);
    setIsTooltipVisible(false); // Đóng tooltip sau khi chọn
  };

  const filterMenu = (
    <div className="">
      {filterOptions.map((option) => (
        <div
          key={option.value}
          className={`text-[#212f3f] text-sm font-medium px-5 py-3 cursor-pointer hover:bg-[#f3f5f7] flex w-[172px] justify-between items-center ${
            selectedFilter.value === option.value ? "text-primary" : ""
          }`}
          onClick={() => handleFilterChange(option)}
        >
          {option.label}
          {selectedFilter.value === option.value && <FaCheck />}
        </div>
      ))}
    </div>
  );

  const handleSearch = () => {
    router.push(
      `search-job?name=${valueSearchJob}&location=${selectedFilter.value}`
    );
  };

  return (
    <div>
      <div className="w-[542px]">
        <h4 className="text-base font-semibold mb-[9px] text-white">
          Công nghệ AI dự đoán, cá nhân hoá việc làm
        </h4>
        <FadingHeadline />

        <div className="shadow-search pl-3 pr-2 py-2 rounded-xl flex flex-1 flex-shrink-0 basis-0 items-center bg-white justify-between mb-6">
          <div className="h-10 w-full relative flex">
            <div className="absolute top-[50%] transform -translate-y-1/2 text-[#6f7882] left-1 w-6 h-6 flex items-center z-[1px] text-[22px]">
              <IoIosSearch />
            </div>
            <input
              type="text"
              className="border-none rounded-[6px] text-sm font-medium h-full outline-none py-[19px] px-[38px] w-full"
              placeholder="Vị trí ứng tuyển"
              value={valueSearchJob}
              onChange={(e) => setValueSearchJob(e.target.value)}
            />
          </div>
          <Tooltip
            placement="bottom"
            title={filterMenu}
            arrow={false}
            trigger="click"
            visible={isTooltipVisible}
            onVisibleChange={(visible) => setIsTooltipVisible(visible)}
            overlayStyle={{ marginTop: "40px", padding: "10px 0" }}
            color="#fff"
            getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
          >
            <div className="flex items-center relative w-full h-full border-l-[1.5px] border-solid border-[#ccc]">
              <div className="absolute top-[50%] transform -translate-y-1/2 text-[#6f7882] left-3 w-6 h-6 flex items-center z-[1px] text-[22px]">
                <CiLocationOn />
              </div>
              <span className="px-[32px]">
                <span className="flex items-center h-10 text-sm text-[#172530] font-medium pl-2 pr-5">
                  {selectedFilter.label}
                </span>
                <span className="absolute right-[1px] top-[1px] text-primary w-10 h-full flex items-center justify-center text-[24px]">
                  <IoIosArrowDown />
                </span>
              </span>
            </div>
          </Tooltip>

          <Button size="lg" className="px-6" onClick={() => handleSearch()}>
            Tìm kiếm
          </Button>
        </div>

        <div className="rounded-xl border border-[#0b8e50] border-solid">
          <Image
            src={BannerCtu}
            alt="banner-video"
            width={540}
            height={198}
            className="max-h-[198px] rounded-xl object-cover"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default ContentLeft;
