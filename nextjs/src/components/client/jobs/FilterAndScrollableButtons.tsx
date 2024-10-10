import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoFilterSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { Tooltip } from "antd";
import { Button } from "@/components/ui/button";

interface FilterAndScrollableButtonsProps {
  selectedFilter: { label: string; value: string };
  isTooltipVisible: boolean;
  setIsTooltipVisible: (visible: boolean) => void;
  filterMenu: React.ReactNode;
  renderButtons: (items: { label: string; value: string }[]) => React.ReactNode;
  experiences: { label: string; value: string }[];
  occupations: { label: string; value: string }[];
  locations: { label: string; value: string }[];
}

const FilterAndScrollableButtons: React.FC<FilterAndScrollableButtonsProps> = ({
  selectedFilter,
  isTooltipVisible,
  setIsTooltipVisible,
  filterMenu,
  renderButtons,
  experiences,
  occupations,
  locations,
}) => {
  return (
    <div className="flex justify-between gap-5">
      <div className="items-center bg-white border border-[#dee0e2] rounded-md grid grid-cols-[1fr_2fr] shrink-0 gap-[5px] h-[40px] text-sm font-normal leading-5 py-0 pl-[10px] pr-[7px]">
        <span className="flex items-center gap-[10px] font-medium text-[#a6acb2]">
          <IoFilterSharp /> Lọc theo:
        </span>
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
          <span className="text-sm font-normal leading-5 w-full relative cursor-pointer">
            <span className="text-[#444] leading-7 block pl-2 pr-5 overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedFilter.label}
            </span>
            <span className="absolute flex h-[25px] right-3 top-[1px] text-[#6f7882] text-[15px] items-center">
              <IoIosArrowDown />
            </span>
          </span>
        </Tooltip>
      </div>
      <div className="flex items-center gap-[15px] overflow-hidden">
        <span
          className="text-[16px] border border-solid border-[#00b14f] text-[#00b14f] cursor-pointer w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-[50%] hover:bg-[#00b14f] hover:text-white"
          onClick={() => {
            document.getElementById("scrollable-container")?.scrollBy({
              left: -200,
              behavior: "smooth",
            });
          }}
        >
          <IoIosArrowBack />
        </span>
        <div
          id="scrollable-container"
          className="w-full overflow-x-auto overflow-y-hidden relative scrollbar-hide transition-all duration-200"
        >
          <div className="whitespace-nowrap flex-grow flex items-center gap-3">
            {selectedFilter.label === "Kinh nghiệm"
              ? renderButtons(experiences)
              : selectedFilter.label === "Ngành nghề"
              ? renderButtons(occupations)
              : renderButtons(locations)}
          </div>
        </div>
        <span
          className="text-[16px] border border-solid border-[#00b14f] text-[#00b14f] cursor-pointer w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-[50%] hover:bg-[#00b14f] hover:text-white"
          onClick={() => {
            document.getElementById("scrollable-container")?.scrollBy({
              left: 200,
              behavior: "smooth",
            });
          }}
        >
          <IoIosArrowForward />
        </span>
      </div>
    </div>
  );
};

export default FilterAndScrollableButtons;
