"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ToppyAl from "@/assets/images/label-toppy-ai.webp";
import { Button } from "@/components/ui/button";
import jobApiRequest from "@/apiRequests/job";
import { IJob, IModelPaginate } from "@/types/backend";
import PaginationControls from "../../share/PaginationControls";
import JobCard from "./JobCard";
import SkeletonJobCard from "./SkeletonJobCard";
import { Tooltip } from "antd";
import { FaCheck } from "react-icons/fa6";
import { EXPERIENCES_LIST } from "@/lib/utils";
import FilterAndScrollableButtons from "./FilterAndScrollableButtons";

const JobsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsData, setJobsData] = useState<IModelPaginate<IJob> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<{
    label: string;
    value: string;
  }>({
    label: "Địa điểm",
    value: "location",
  });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    fetchJobs(currentPage, selectedFilter.value, activeFilter);
  }, [currentPage, selectedFilter.value, activeFilter]);

  const fetchJobs = async (page: number, sort?: any, activeFilter?: string) => {
    setIsLoading(true);
    const { data } = await jobApiRequest.callFetchJob(
      `current=${page}&pageSize=12&${
        sort && activeFilter ? `${sort}=${activeFilter}` : ""
      }`
    );
    setJobsData(data || null);
    setIsLoading(false);
    setInitialLoad(false); // Set initial load to false after first fetch
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < (jobsData?.meta?.pages ?? 1)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const { pages } = jobsData?.meta ?? {};
  const jobs = jobsData?.result;

  const locations = [
    { label: "Ngẫu Nhiên", value: "" },
    { label: "Hà Nội", value: "Hà Nội" },
    { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
    { label: "Cần Thơ", value: "Cần Thơ" },
    { label: "Đà Nẵng", value: "Đà Nẵng" },
  ];

  const occupations = [
    { label: "Tất cả", value: "" },
    { label: "Kinh doanh / Bán hàng", value: "Kinh doanh / Bán hàng" },
    { label: "Bất động sản", value: "Bất động sản" },
    { label: "Việc làm IT", value: "Việc làm IT" },
    { label: "Ngân hàng / Tài chính", value: "Ngân hàng / Tài chính" },
    { label: "IT Phần mềm", value: "IT Phần mềm" },
    { label: "Thiết kế đồ họa", value: "Thiết kế đồ họa" },
  ];

  const experiences = [{ label: "Tất cả", value: "" }, ...EXPERIENCES_LIST];

  const filterOptions = [
    { label: "Địa điểm", value: "location" },
    { label: "Kinh nghiệm", value: "experience" },
    { label: "Ngành nghề", value: "occupations" },
  ];

  const handleFilterChange = (value: { label: string; value: string }) => {
    setSelectedFilter(value);
    setIsTooltipVisible(false); // Đóng tooltip sau khi chọn
    setActiveFilter("");
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

  const renderButtons = (items: { label: string; value: string }[]) => {
    return items.map((item) => (
      <Button
        key={item.value}
        onClick={() => setActiveFilter(item.value)}
        className={`h-10 border rounded-full !px-3 !py-[9px] text-sm shadow-none font-medium transition-colors duration-200 ${
          activeFilter === item.value
            ? "bg-[#00b14f] text-white"
            : "bg-white text-[#212f3f] border-[#e5e7eb] hover:bg-white hover:border-[#009a45]"
        }`}
      >
        {item.label}
      </Button>
    ));
  };

  return (
    <>
      <div className="flex items-center justify-between text-[#212f3f] text-[16px] pb-4">
        <div className="text-[#00b14f] flex items-center text-2xl font-semibold gap-4">
          <h2>Việc làm tốt nhất</h2>
          <div className="border-l border-solid border-[#bcc1c5] pl-4">
            <Image src={ToppyAl} alt="ToppyAl" width={110} height={26} />
          </div>
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={pages}
          hidePageNumbers={true}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>
      <FilterAndScrollableButtons
        selectedFilter={selectedFilter}
        isTooltipVisible={isTooltipVisible}
        setIsTooltipVisible={setIsTooltipVisible}
        filterMenu={filterMenu}
        renderButtons={renderButtons}
        experiences={experiences}
        occupations={occupations}
        locations={locations}
      />
      {initialLoad && isLoading ? (
        <div className="grid grid-cols-3 gap-5 my-[10px] pt-[2px] pb-2">
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <SkeletonJobCard key={index} />
            ))}
        </div>
      ) : jobs?.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-medium my-[10px] py-4">
          Không có việc làm nào
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5 my-[10px] pt-[2px] pb-2">
          {jobs?.map((job: IJob) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
      <PaginationControls
        currentPage={currentPage}
        totalPages={pages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </>
  );
};

export default JobsList;
