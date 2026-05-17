import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number | undefined;
  hidePageNumbers?: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hidePageNumbers = false,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex items-center justify-center gap-[11px]">
      <span
        onClick={onPrevPage}
        className={`text-[16px] border border-solid w-8 flex items-center justify-center rounded-[50%] aspect-square ${
          currentPage === 1
            ? "border-[#dee0e2] text-[#dee0e2] cursor-not-allowed pointer-events-none"
            : "border-[#7c3aed] text-[#7c3aed] cursor-pointer hover:bg-[#7c3aed] hover:text-white"
        }`}
      >
        <IoIosArrowBack />
      </span>
      {!hidePageNumbers && (
        <div className="text-[#a6acb2] text-sm font-medium">
          {currentPage} / {totalPages} trang
        </div>
      )}
      <span
        onClick={onNextPage}
        className={`text-[16px] border border-solid w-8 flex items-center justify-center rounded-[50%] aspect-square ${
          currentPage === totalPages
            ? "border-[#dee0e2] text-[#dee0e2] cursor-not-allowed pointer-events-none"
            : "border-[#7c3aed] text-[#7c3aed] cursor-pointer hover:bg-[#7c3aed] hover:text-white"
        }`}
      >
        <IoIosArrowForward />
      </span>
    </div>
  );
};

export default PaginationControls;
