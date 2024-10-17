"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import userApiRequest from "@/apiRequests/user";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { setUserUpdateInfo } from "@/redux/slice/accountSlide";
import { useRouter } from "next/navigation";
import authApiRequest from "@/apiRequests/auth";

const ContentLeft = () => {
  const user = useAppSelector((state) => state?.account?.user);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await userApiRequest.callUpdateUser({
      id: user?.id ?? 0,
      name,
      phone,
      email: user?.email,
      role: { id: user.role.id ?? 0 },
    });

    if (data.statusCode === 200) {
      message.success("Cập nhật thông tin thành công!");
      dispatch(setUserUpdateInfo({ name, phone }));
      const res = await authApiRequest.slideTokenFromNextClientToNextServer();
      localStorage.setItem("access_token", res?.data?.access_token as string);
      localStorage.setItem(
        "accessTokenExpiresAt",
        res?.data?.accessTokenExpires as string
      );
      router.refresh();
    }
  };

  return (
    <div className="w-full lg:w-[66.66666667%] lg:px-[15px]">
      <div className="bg-white rounded-lg mb-6 p-6">
        <div>
          <h4 className="text-[#212f3f] text-[18px] font-bold leading-[26px] mt-0 mb-[10px]">
            Cài đặt thông tin cá nhân
          </h4>
          <span className="flex items-center text-[#4d5965] text-sm font-medium leading-5">
            <span className="text-[#dc2f2f] mr-1">(*)</span>
            Các thông tin bắt buộc
          </span>
        </div>
        <form action="" onSubmit={handleSubmit} className="my-[10px]">
          <div className="mb-4">
            <p className="text-[#212f3f] text-sm font-medium mb-[10px]">
              Họ và tên <span className="text-[#dc2f2f]">(*)</span>
            </p>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#e9eaec] rounded-[6px] text-[14px] font-medium leading-[20px] -webkit-appearance-none box-shadow-none color-rgba(0,0,0,.87) h-[40px] outline-none px-[18px] py-[10px]"
            />
          </div>
          <div className="mb-4">
            <p className="text-[#212f3f] text-sm font-medium mb-[10px]">
              Số điện thoại
            </p>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-[#e9eaec] rounded-[6px] text-[14px] font-medium leading-[20px] -webkit-appearance-none box-shadow-none color-rgba(0,0,0,.87) h-[40px] outline-none px-[18px] py-[10px]"
            />
          </div>
          <div>
            <p className="text-[#212f3f] text-sm font-medium mb-[10px]">
              Email
            </p>
            <input
              type="text"
              value={user?.email}
              disabled
              className="w-full bg-[#f4f5f5] text-[#a6acb2] border border-[#e9eaec] rounded-[6px] text-[14px] font-medium leading-[20px] cursor-not-allowed -webkit-appearance-none box-shadow-none color-rgba(0,0,0,.87) h-[40px] outline-none px-[18px] py-[10px]"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#00b14f] rounded-md text-white text-sm font-semibold h-10 leading-5 w-[100px] mt-6"
          >
            Lưu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContentLeft;
