"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const HeaderContent = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case "/login-for-hr":
        setTitle("Đăng nhập với tài khoản nhà tuyển dụng");
        setSubTitle(
          "Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel"
        );
        break;
      case "/register-for-hr":
        setTitle("Đăng ký tài khoản nhà tuyển dụng");
        setSubTitle(
          "Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel"
        );
        break;
      default:
        setTitle("Chào mừng bạn đến với TopCV");
        setSubTitle(
          "Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng"
        );
    }
  }, [pathname]); // Chạy lại khi pathname thay đổi

  return (
    <div className="mb-6">
      <h2 className="text-primary text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-[#6c757d]">{subTitle}</p>
    </div>
  );
};

export default HeaderContent;
