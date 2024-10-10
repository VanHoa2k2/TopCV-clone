"use client";
import { useAppSelector } from "@/redux/hooks";
import { Avatar, message, notification } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AvatarDefault from "@/assets/avatar/avatar-default.jpg";
import { FaCamera } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import bannerApp from "@/assets/images/banner--app.webp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import fileUploadApiRequest from "@/apiRequests/fileUpload";
import userApiRequest from "@/apiRequests/user";
import { setUserAvatar } from "@/redux/slice/accountSlide";
import authApiRequest from "@/apiRequests/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface IAvatar {
  name: string;
  uid: string;
}

const ContentRight = () => {
  const [dataAvatar, setDataAvatar] = useState<IAvatar[]>([]);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useAppSelector((state) => state?.account?.user);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user?.id && user?.avatar) {
      const avatar = {
        name: user?.avatar,
        uid: uuidv4(),
      };
      const avatarArr = [];
      avatarArr.push(avatar);
      setDataAvatar(avatarArr);
    }
  }, [user]);

  const handleUploadFileAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoadingUpload(true);
      try {
        const res = await fileUploadApiRequest.callUploadSingleFile(
          file,
          "avatar"
        );
        if (res && res.data) {
          setDataAvatar([
            {
              name: res.data.fileName,
              uid: uuidv4(),
            },
          ]);
        } else if (res.statusCode === 422) {
          event.target.value = "";
          notification.error({
            message: "Kích thước ảnh quá lớn!",
            description: "Vui lòng tải ảnh có kích thước dưới 5MB",
          });
          setDataAvatar([]);
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        notification.error({
          message: "Lỗi tải lên",
          description: "Đã xảy ra lỗi khi tải lên ảnh đại diện",
        });
      } finally {
        setLoadingUpload(false);
      }
    }
  };

  const handleDialogClose = () => {
    setDataAvatar([]);
  };

  const fetchUpdateUser = async () => {
    const data = await userApiRequest.callUpdateUser({
      id: user?.id ?? 0,
      name: user?.name,
      avatar:
        dataAvatar.length > 0 && dataAvatar[0].name
          ? dataAvatar[0].name
          : "empty-avatar",
      email: user?.email,
      role: { id: user.role.id ?? 0 },
    });

    try {
      if (data.statusCode === 200) {
        message.success("Tải ảnh đại diện thành công!");
        dispatch(setUserAvatar({ avatar: data.data?.avatar }));
        const res = await authApiRequest.slideTokenFromNextClientToNextServer();
        localStorage.setItem("access_token", res?.data?.access_token as string);
        localStorage.setItem(
          "accessTokenExpiresAt",
          res?.data?.accessTokenExpires as string
        );
        router.refresh();
        setIsDialogOpen(false); // Close the dialog
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notification.error({
        message: "Lỗi tải lên",
        description: "Đã xảy ra lỗi khi tải lên ảnh đại diện",
      });
    }
  };

  return (
    <div className="w-[33.33333333%] px-[15px]">
      <div className="bg-white rounded-[8px] p-4 mb-4">
        <div className="border-b border-[#eef1f5] flex gap-6 justify-start pb-4">
          <div className="relative">
            <Avatar
              size={83}
              src={
                <Image
                  alt="avatar"
                  width={83}
                  height={83}
                  src={
                    user?.avatar
                      ? `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/avatar/${user?.avatar}`
                      : AvatarDefault
                  }
                />
              }
            ></Avatar>
            <span className="text-white top-0 right-0 text-[9px] leading-[12px] py-[1px] px-[4px] absolute bg-gray-500">
              VERIFIED
            </span>
            <div className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-[#00b14f] rounded-full p-0.5 cursor-pointer">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <FaCamera onClick={() => setIsDialogOpen(true)} />
                </DialogTrigger>
                <DialogContent className="p-0 max-w-none border-none !w-auto">
                  <DialogHeader>
                    <DialogTitle className="w-full py-2.5 px-0 text-[16px] bg-[#1f8c67] text-white text-center uppercase font-bold rounded-t-lg">
                      Chỉnh sửa ảnh đại diện
                    </DialogTitle>
                    <div className="flex">
                      <div className="relative overflow-hidden w-[450px] h-[300px] flex flex-col items-center">
                        <h4 className="pt-[10px] text-[16px] mt-[10px] leading-[1.1] font-medium">
                          Ảnh gốc
                        </h4>
                        <div
                          className={`mt-5 w-[450px] h-[230px] pb-0 ${
                            dataAvatar.length > 0 ? "block" : "hidden"
                          }`}
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/avatar/${dataAvatar[0]?.name}`}
                            alt="avatar"
                            width={230}
                            height={230}
                            className="object-cover h-full mx-auto"
                          />
                        </div>
                        <div
                          className={`flex justify-center items-center h-[210px] align-middle leading-[60px] mt-5 w-[90%]
                           text-[#999] border-2 border-dashed border-[#0b85a1] cursor-pointer ${
                             dataAvatar.length > 0 ? "hidden" : "block"
                           }
                           `}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {loadingUpload ? (
                            <span>Đang tải lên...</span>
                          ) : (
                            "Click chọn ảnh để tải lên!"
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleUploadFileAvatar}
                            accept="image/*"
                            className="hidden"
                            disabled={loadingUpload}
                          />
                        </div>
                      </div>
                      <div className="w-[300px] flex flex-col items-center">
                        <h4 className="pt-[10px] text-[16px] mt-[10px] leading-[1.1] font-medium">
                          Ảnh đại diện hiển thị
                        </h4>
                        <div className="p-[10px]">
                          <div className="w-40 h-40 overflow-hidden mx-auto border border-[#efefef] rounded-full flex justify-center">
                            <Image
                              src={
                                user?.avatar
                                  ? `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/avatar/${user?.avatar}`
                                  : AvatarDefault
                              }
                              alt="avatar"
                              width={150}
                              height={150}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <button
                              className="inline-block text-white py-1 cursor-pointer mt-3 rounded-sm w-[76px] bg-[#4a8cf7] outline-none mr-2"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUploadFileAvatar}
                                accept="image/*"
                                className="hidden"
                                disabled={loadingUpload}
                              />
                              Đổi ảnh
                            </button>
                            <button
                              className="inline-block text-white py-1 cursor-pointer mt-3 rounded-sm w-[76px] bg-[red]"
                              onClick={() => setDataAvatar([])}
                            >
                              Xóa ảnh
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => fetchUpdateUser()}
                              className="inline-block text-white py-[5px] px-[5px] cursor-pointer mt-[3px] rounded-[3px] border-none w-[160px] text-[1.2em] leading-[1.5em] bg-[#1f8c67]"
                            >
                              Xong
                            </button>
                          </div>
                          <div
                            onClick={() => setIsDialogOpen(false)}
                            className="mt-[5px] block text-sm underline text-red-500 text-center cursor-pointer"
                          >
                            Đóng lại (Không lưu)
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            <div className="text-[#212f3f] text-[14px] font-normal tracking-[0.14px] leading-[22px]">
              Chào bạn trở lại,
            </div>
            <h4 className="text-[#212f3f] text-base font-semibold tracking-[-0.16px] leading-6 mb-0">
              {user?.name}
            </h4>
            <div>
              <span className="rounded-[2px] text-white text-xs py-[3px] px-[7px] bg-gray-500 inline-block mt-2">
                Tài khoản đã xác thực
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-2.5 text-[#212f3f] text-[14px] font-normal tracking-[0.14px] leading-[22px] mt-4">
            Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn
            qua:
          </p>
          <ul className="text-[#212f3f] text-[14px] font-normal tracking-[0.14px] leading-[22px] mt-4 list-none mb-[10px]">
            <li className="mb-2 flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 mr-2 text-[12px] font-normal text-[#00b14f] bg-[#e3faed] rounded-[20px]">
                <FaCheck />
              </span>
              Nhắn tin qua Top Connect trên TopCV
            </li>
            <li className="mb-2 flex items-center">
              <span className="inline-flex items-center justify-center w-5 h-5 mr-2 text-[12px] font-normal text-[#00b14f] bg-[#e3faed] rounded-[20px]">
                <FaCheck />
              </span>
              Email và Số điện thoại của bạn
            </li>
          </ul>
          <Image
            src={bannerApp}
            alt="banner-app"
            width={300}
            height={300}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentRight;
