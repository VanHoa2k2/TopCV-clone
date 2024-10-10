"use client";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderContent = () => {
  const pathname = usePathname();
  const isSpecialPage = pathname === "/login-for-hr";
  return (
    <div className="mb-6">
      <h2 className="text-primary text-xl font-semibold mb-2">
        {isSpecialPage
          ? "Đăng nhập với tài khoản nhà tuyển dụng"
          : "Chào mừng bạn đến với TopCV"}
      </h2>
      <p className="text-sm text-[#6c757d]">
        {isSpecialPage
          ? "Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel"
          : "Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng"}
      </p>
    </div>
  );
};

export default HeaderContent;
