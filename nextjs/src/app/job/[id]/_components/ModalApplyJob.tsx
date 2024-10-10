"use client";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { RiFolderUserFill } from "react-icons/ri";
import UploadCloud from "@/assets/images/upload-cloud.webp";
import { Button } from "@/components/ui/button";
import fileUploadApiRequest from "@/apiRequests/fileUpload";
import { message, notification } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { IJob } from "@/types/backend";
import resumeApiRequest from "@/apiRequests/resume";
import { FaRegFileLines } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

interface IProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jobDetail: IJob | undefined;
}

interface ICV {
  name: string;
  uid: string;
}

const ModalApplyJob = (props: IProps) => {
  const { setIsDialogOpen, jobDetail } = props;
  const user = useAppSelector((state) => state?.account?.user);
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const [valueCV, setValueCV] = useState<string>(
    user.urlCV ? "current-cv" : "new-cv"
  );
  const [urlNewCV, setUrlNewCV] = useState<string | undefined>("");

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const route = useRouter();

  const handleApplyCV = async () => {
    if (valueCV === "new-cv" && !urlNewCV && isAuthenticated) {
      message.error("Vui lòng upload CV!");
      return;
    }

    if (!isAuthenticated) {
      setIsDialogOpen(false);
      route.push(`/login?callback=${window.location.href}`);
    } else {
      if (jobDetail) {
        const res = await resumeApiRequest.callCreateResume(
          valueCV === "current-cv" ? user.urlCV : urlNewCV,
          jobDetail?.company?.id,
          jobDetail?.id
        );
        if (res.data) {
          message.success("Apply CV thành công!");
          setIsDialogOpen(false);
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: res.message,
          });
        }
      }
    }
  };

  const handleUploadFileCV = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoadingUpload(true);
      try {
        const resFile = await fileUploadApiRequest.callUploadSingleFile(
          file,
          "resume"
        );
        console.log(resFile);
        if (resFile && resFile.data) {
          setUrlNewCV(resFile.data.fileName);
        } else if (resFile.statusCode === 413) {
          event.target.value = "";
          notification.error({
            message: "Kích thước tệp quá lớn!",
            description: "Vui lòng tải tệp có kích thước dưới 5MB",
          });
          setUrlNewCV("");
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

  return (
    <div className="max-h-[100vh] pr-7 pl-8">
      <div className="mt-4 flex gap-2">
        <span className="text-[22px] text-[#15bf61]">
          <RiFolderUserFill />
        </span>{" "}
        <span className="text-[#263a4d] text-[16px] leading-6 font-semibold">
          Chọn CV để ứng tuyển
        </span>
      </div>

      <div className="grid gap-3 mt-2.5">
        {user?.urlCV && (
          <div
            className={`border ${
              valueCV === "current-cv"
                ? "border-solid border-[#00b14f]"
                : "border-dashed border-[#b3b8bd]"
            } rounded-[6px] cursor-pointer px-2.5 py-[16px]`}
            onClick={() => setValueCV("current-cv")}
          >
            <div className="flex items-center">
              <input type="radio" className="hidden" name="last_apply_id" />
              <label
                htmlFor="last_apply_id"
                className="inline-flex items-center w-full"
              >
                <div className="flex items-center relative">
                  <span
                    className={`aspect-square border-[2px] border-solid ${
                      valueCV === "current-cv"
                        ? "border-[#00b14f]"
                        : "border-[#b3b8bd]"
                    } rounded-full mr-2 relative w-5 flex items-center justify-center`}
                  >
                    {valueCV === "current-cv" ? (
                      <span className="bg-[#00b14f] rounded-full block w-2.5 h-2.5"></span>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
                <span
                  className="text-[#00b14f] [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] text-[14px] leading-[22px]
              overflow-hidden text-ellipsis"
                >
                  CV ứng tuyển: {user?.urlCV}
                </span>
              </label>
              <div>
                <Link
                  href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${user?.urlCV}`}
                  target="_blank"
                  className="text-primary text-[14px] leading-[22px] font-semibold tracking-[.175]"
                >
                  Xem
                </Link>
              </div>
            </div>
            <div className="mt-2.5 grid gap-1">
              <div className="flex gap-2.5">
                <span className="text-[#263a4d] text-[14px] leading-[22px] tracking-[.14]">
                  Họ và tên:
                </span>
                <span className="text-[#263a4d] text-[14px] leading-[22px] font-bold tracking-[.175]">
                  {user?.name}
                </span>
              </div>
              <div className="flex gap-2.5">
                <span className="text-[#263a4d] text-[14px] leading-[22px] tracking-[.14]">
                  Email:
                </span>
                <span className="text-[#263a4d] text-[14px] leading-[22px] font-bold tracking-[.175]">
                  {user?.email}
                </span>
              </div>
              <div className="flex gap-2.5">
                <span className="text-[#263a4d] text-[14px] leading-[22px] tracking-[.14]">
                  Số điện thoại:
                </span>
                <span className="text-[#263a4d] text-[14px] leading-[22px] font-bold tracking-[.175]">
                  {user?.phone}
                </span>
              </div>
            </div>
          </div>
        )}
        <div
          className={`border ${
            valueCV === "new-cv"
              ? "border-solid border-[#00b14f]"
              : "border-dashed border-[#b3b8bd]"
          } rounded-[6px] cursor-pointer px-2.5 py-[16px] relative`}
          onClick={() => setValueCV("new-cv")}
        >
          <div className="absolute flex items-center cursor-pointer gap-2 top-4 left-4">
            <div className="relative">
              <div
                className={`absolute aspect-square border-[2px] border-solid ${
                  valueCV === "new-cv" ? "border-[#00b14f]" : "border-[#b3b8bd]"
                }  rounded-full mr-2 w-5 flex items-center justify-center`}
              >
                {valueCV === "new-cv" ? (
                  <span className="bg-[#00b14f] rounded-full block w-2.5 h-2.5"></span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="max-w-[404px] mx-auto">
            <div className="cursor-pointer grid gap-2 items-center">
              <div className="mr-5 flex items-center gap-3 mt-auto justify-center text-[14px] font-bold text-[#263a4d] leading-[135%] tracking-[.175px]">
                <Image
                  src={UploadCloud}
                  alt="UploadCloud"
                  width={41.778}
                  height={28}
                />{" "}
                Tải lên CV từ máy tính, chọn hoặc kéo thả
              </div>
              <span className="text-sm text-[#7f878f]">
                Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB
              </span>
              <div className="flex items-center justify-center gap-2.5">
                {urlNewCV && (
                  <>
                    <div className="text-[26px] text-primary">
                      <FaRegFileLines />
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        className="text-[#00b14f] [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] max-w-[174px] font-semibold overflow-hidden text-ellipsis"
                        href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${urlNewCV}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {urlNewCV}
                      </Link>

                      <div
                        className="bg-[#fff1f0] text-[#d83324] text-[16px] flex items-center justify-center rounded-sm p-2"
                        onClick={() => setUrlNewCV("")}
                      >
                        <FaRegTrashAlt />
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="flex items-center justify-center bg-[#f2f4f5] rounded-[4px] text-[#263a4d]
                 font-bold text-[14px] gap-[8px] h-[32px] tracking-[0.175px] leading-[22px] mx-auto px-[24px] hover:text-white hover:bg-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn CV
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadFileCV}
              accept=".pdf"
              className="hidden"
              disabled={loadingUpload}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white shadow-[0_-3px_4px_0_rgba(0,0,0,0.03)] gap-[12px] py-[16px]">
        <Button
          className="bg-[#f2f4f5] hover:bg-[#f2f4f5] rounded-[4px] text-[#263a4d] text-[14px] font-semibold h-[40px] tracking-[0.175px] leading-[22px] px-[16px] py-[8px] w-[60px]"
          onClick={() => setIsDialogOpen(false)}
        >
          Hủy
        </Button>

        <Button
          className="rounded-[4px] text-[14px] font-semibold h-[40px] tracking-[0.175px] leading-[22px] px-[16px] py-[8px] w-full"
          onClick={() => handleApplyCV()}
        >
          Nộp hồ sơ ứng tuyển
        </Button>
      </div>
    </div>
  );
};

export default ModalApplyJob;
