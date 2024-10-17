"use client";
import React, { useState, useEffect } from "react";

const FadingHeadline = () => {
  const [currentText, setCurrentText] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const textList = [
    "Việc làm mới",
    "Định hướng nghề nghiệp",
    "Công ty phú hợp",
    "Phúc lợi tốt",
    "Mức lương cao",
    "Thông tin thị trường",
    "CV mới",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentText((prevIndex) => (prevIndex + 1) % textList.length);
        setIsFading(false);
      }, 500); // Phải khớp với thời gian của transition
    }, 2000); // Thay đổi văn bản mỗi 2 giây

    return () => clearInterval(interval);
  }, [textList.length]);
  return (
    <h2 className="text-white text-[18px] lg:text-[26px] font-bold leading-[38px] mb-4">
      <span
        className={`text-primary transition-opacity duration-500 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {textList[currentText]}
      </span>{" "}
      dành cho bạn.
    </h2>
  );
};

export default FadingHeadline;
