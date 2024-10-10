"use client";
import React, { useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import parse from "html-react-parser";
import styles from "../company-detail.module.scss";

interface CompanyDescriptionProps {
  description: string;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="pt-5 pb-7 px-5">
      <div
        ref={descriptionRef}
        className={`${styles["company-description"]}`}
        style={{
          maxHeight: isExpanded
            ? `${descriptionRef.current?.scrollHeight}px`
            : "200px",
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        {parse(description)}
        {isExpanded ? "" : <div className={styles["temp"]}></div>}
      </div>

      {/* Toggle Button */}
      <div
        onClick={toggleDescription}
        className="text-[#00b14f] text-sm font-medium mt-[15px] flex items-center gap-1.5 w-full cursor-pointer"
      >
        {isExpanded ? "Thu gọn" : "Xem thêm"}
        <span
          className={`text-[18px] transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <IoIosArrowDown />
        </span>
      </div>
    </div>
  );
};

export default CompanyDescription;
