"use client";
import { Button } from "@/components/ui/button";
import { FIELDS_LIST } from "@/lib/utils";
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { IoBriefcaseOutline } from "react-icons/io5";

interface IFieldsOption {
  label: string;
  value: string;
}

interface IProps {
  name?: string;
  location?: string;
  field?: string;
}

const HeaderSearchJobPage = (props: IProps) => {
  const { name, location, field } = props;
  const fieldsOption: IFieldsOption[] = [...FIELDS_LIST];
  fieldsOption.unshift({
    label: "Ngành nghề",
    value: "",
  });
  const router = useRouter();
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<{
    label: string;
    value: string;
  }>(
    location
      ? { label: location, value: location }
      : {
          label: "Tất cả địa điểm",
          value: "",
        }
  );
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<{
    label: string;
    value: string;
  }>(
    field
      ? { label: field, value: field }
      : {
          label: "Ngành nghề",
          value: "",
        }
  );
  const [isTooltipVisibleLocation, setIsTooltipVisibleLocation] =
    useState<boolean>(false);
  const [isTooltipVisibleField, setIsTooltipVisibleField] =
    useState<boolean>(false);

  const [valueSearchJob, setValueSearchJob] = useState<string>(
    name ? name : ""
  );
  const filterOptions = [
    { label: "Tất cả địa điểm", value: "" },
    { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
    { label: "Hà Nội", value: "Hà Nội" },
    { label: "Cần Thơ", value: "Cần Thơ" },
  ];

  const handleFilterLocationChange = (value: {
    label: string;
    value: string;
  }) => {
    setSelectedLocationFilter(value);
    setIsTooltipVisibleLocation(false); // Đóng tooltip sau khi chọn
  };

  const handleFilterFieldsChange = (value: {
    label: string;
    value: string;
  }) => {
    setSelectedFieldFilter(value);
    setIsTooltipVisibleField(false); // Đóng tooltip sau khi chọn
  };

  const filterByLocationMenu = (
    <div className="">
      {filterOptions.map((option) => (
        <div
          key={option.value}
          className={`text-[#212f3f] text-sm font-medium px-5 py-3 cursor-pointer hover:bg-[#f3f5f7] flex w-[172px] justify-between items-center ${
            selectedLocationFilter.value === option.value ? "text-primary" : ""
          }`}
          onClick={() => handleFilterLocationChange(option)}
        >
          {option.label}
          {selectedLocationFilter.value === option.value && <FaCheck />}
        </div>
      ))}
    </div>
  );

  const filterByFieldsMenu = (
    <div className="h-[260px] overflow-y-auto">
      <span className="p-4 w-[172px]">
        <input
          type="text"
          className="border-[2px] border-solid border-[#e9eaec] px-[9px] pt-[9px] pb-3 outline-none text-[#000] my-3"
        />
      </span>
      {fieldsOption.map((option: IFieldsOption) => (
        <div
          key={option.value}
          className={`text-[#212f3f] w-full text-sm font-medium px-5 py-3 cursor-pointer hover:bg-[#f3f5f7] flex justify-between items-center ${
            selectedFieldFilter.value === option.value ? "text-primary" : ""
          }`}
          onClick={() => handleFilterFieldsChange(option)}
        >
          {option.label}
          {selectedFieldFilter.value === option.value && <FaCheck />}
        </div>
      ))}
    </div>
  );

  const handleSearch = () => {
    router.push(
      `search-job?name=${valueSearchJob}&location=${selectedLocationFilter.value}`
    );
  };
  return (
    <div className="container flex gap-4">
      <div className="shadow-search pl-3 rounded-[6px] flex flex-1 flex-shrink-0 basis-0 items-center bg-white justify-between">
        <div className="h-10 relative flex flex-grow">
          <div className="absolute top-[50%] transform -translate-y-1/2 text-[#6f7882] left-1 w-6 h-6 flex items-center z-[1px] text-[18px]">
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
          title={filterByLocationMenu}
          arrow={false}
          trigger="click"
          visible={isTooltipVisibleLocation}
          onVisibleChange={(visible) => setIsTooltipVisibleLocation(visible)}
          overlayStyle={{ marginTop: "40px", padding: "10px 0" }}
          color="#fff"
          getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
        >
          <div className="flex items-center relative h-full border-l-[1.5px] border-solid border-[#ccc]">
            <div className="absolute top-[50%] transform -translate-y-1/2 text-[#6f7882] left-3 w-6 h-6 flex items-center z-[1px] text-[22px]">
              <CiLocationOn />
            </div>
            <span className="px-[32px]">
              <span className="flex items-center h-10 text-sm text-[#172530] font-medium pl-2 pr-5">
                {selectedLocationFilter.label}
              </span>
              <span className="absolute right-[1px] top-[1px] text-primary w-10 h-full flex items-center justify-center text-[24px]">
                <IoIosArrowDown />
              </span>
            </span>
          </div>
        </Tooltip>
      </div>

      <div className="shadow-search rounded-[6px] flex items-center bg-white justify-between">
        <Tooltip
          placement="bottom"
          title={filterByFieldsMenu}
          arrow={false}
          trigger="click"
          visible={isTooltipVisibleField}
          onVisibleChange={(visible) => setIsTooltipVisibleField(visible)}
          overlayStyle={{ marginTop: "40px", padding: "10px 0" }}
          color="#fff"
          getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
        >
          <div className="flex items-center relative w-full h-full">
            <div className="absolute top-[50%] transform -translate-y-1/2 text-[#6f7882] left-3 w-6 h-6 flex items-center z-[1px] text-[18px]">
              <IoBriefcaseOutline />
            </div>
            <span className="px-[32px]">
              <span className="flex items-center h-10 text-sm text-[#172530] font-medium pl-2 pr-5">
                {selectedFieldFilter.label}
              </span>
              <span className="absolute right-[1px] top-[1px] text-primary w-10 h-full flex items-center justify-center text-[24px]">
                <IoIosArrowDown />
              </span>
            </span>
          </div>
        </Tooltip>
      </div>
      <div>
        <Button
          size="lg"
          className="px-6 w-[128px]"
          onClick={() => handleSearch()}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default HeaderSearchJobPage;
