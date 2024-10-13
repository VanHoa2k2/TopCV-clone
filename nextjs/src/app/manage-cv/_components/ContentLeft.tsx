"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { FaUpload, FaFile, FaCalendar, FaRegTrashCan } from "react-icons/fa6";
import Image from "next/image";
import NoCV1 from "@/assets/images/no-cv-upload.webp";
import NoCV2 from "@/assets/images/no-cv.webp";
import { FaPlus } from "react-icons/fa6";
import { message, notification, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import userApiRequest from "@/apiRequests/user";
import authApiRequest from "@/apiRequests/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModalUploadCV from "./ModalUploadCV";
import BgUpload from "@/assets/images/upload_cV_arrow_bg.webp";
import BannerUpload from "@/assets/images/banner_upload.webp";

const ContentLeft = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const user = useAppSelector((state) => state?.account?.user);
  const router = useRouter();
  const [isOpenTooltip, setIsOpenTooltip] = useState<boolean>(false);

  const text = <span>Chức năng chưa được phát triễn</span>;

  const fetchUpdateUserCV = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const data = await userApiRequest.callUpdateCVByUser("");
      if (data.statusCode === 200) {
        const res = await authApiRequest.slideTokenFromNextClientToNextServer();
        localStorage.setItem("access_token", res?.data?.access_token as string);
        localStorage.setItem(
          "accessTokenExpiresAt",
          res?.data?.accessTokenExpires as string
        );
        message.success("Xóa CV thành công!");
        router.refresh();
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notification.error({
        message: "Lỗi xóa cv",
        description: "Đã xảy ra lỗi khi xóa cv",
      });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="w-[66.66666667%] px-[15px]">
      <div className="bg-white rounded-md shadow-[-1px_1px_6px_rgba(0,0,0,0.05)] mb-4 p-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-black text-[19px] font-bold leading-6 m-0">
            CV đã tải lên TopCV
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-1 rounded-full text-white leading-none py-[11px] px-4">
                <FaUpload /> {user?.urlCV ? "Tải CV mới" : "Tải CV lên"}
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 max-w-[940px] border-none">
              <DialogHeader>
                <DialogTitle className="bg-bgHeaderUploadCV rounded-t-lg p-[30px] relative">
                  <h1 className="text-white text-[20px] font-bold leading-[28px] tracking-[-0.2px] mb-2">
                    Upload CV để các cơ hội việc làm tự tìm đến bạn
                  </h1>
                  <h2 className="text-white text-[16px] font-normal leading-[24px] tracking-[-0.16px] m-0">
                    Giảm đến 50% thời gian cần thiết để tìm được một công việc
                    phù hợp
                  </h2>
                  <span className="absolute right-[119px] top-[19px] object-cover">
                    <Image
                      src={BgUpload}
                      alt="BgUpload"
                      width={65}
                      height={120}
                    />
                  </span>
                  <span className="absolute right-0 top-0 object-cover">
                    <Image
                      src={BannerUpload}
                      alt="BannerUpload"
                      width={149}
                      height={120}
                    />
                  </span>
                </DialogTitle>
                <ModalUploadCV setIsDialogOpen={setIsDialogOpen} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col items-center">
          {user?.urlCV ? (
            <div className="pt-4 pb-6 px-8 w-full">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaFile className="mr-2 text-[#00b14f] flex items-center" />
                CV đã tải lên:
                <a
                  className="text-[#00b14f] hover:text-[#008f3f] ml-1 text-sm transition-colors duration-200 underline flex items-center"
                  href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${user?.urlCV}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="mr-1">{user?.urlCV}</span>
                </a>
                <button
                  onClick={fetchUpdateUserCV}
                  className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                  disabled={loading} // Vô hiệu hóa nút khi đang loading
                >
                  {loading ? <span>Loading...</span> : <FaRegTrashCan />}{" "}
                  {/* Hiển thị loading */}
                </button>
              </h3>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <FaCalendar className="mr-2 text-gray-400" />
                  Ngày tải lên: {new Date().toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ) : (
            <>
              <Image src={NoCV1} alt="no-cv" width={118} height={110} />
              <p className="mt-5 mb-2.5">Bạn chưa tải lên CV nào</p>
            </>
          )}
        </div>
      </div>
      <div className="bg-white rounded-md shadow-[-1px_1px_6px_rgba(0,0,0,0.05)] mb-10 mt-4 p-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-black text-[19px] font-bold leading-6 m-0">
            CV đã tạo trên TopCV
          </h1>
          <Tooltip
            placement="bottom"
            title={text}
            trigger="click"
            open={isOpenTooltip}
            onOpenChange={() => setIsOpenTooltip(false)}
          >
            <Button
              className="flex gap-1 rounded-full text-white leading-none py-[11px] px-4"
              onClick={() => setIsOpenTooltip(!isOpenTooltip)}
            >
              <FaPlus /> Tạo mới
            </Button>
          </Tooltip>
        </div>
        <div className="flex flex-col items-center">
          <Image src={NoCV2} alt="no-cv" width={82} height={100} />
          <p className="mt-5 mb-2.5">Bạn chưa tạo CV nào</p>
        </div>
      </div>
    </div>
  );
};

export default ContentLeft;
