"use client";
import React, { useState } from "react";
import UploadCloud from "@/assets/images/upload-cloud.webp";
import Image from "next/image";
import { LuFileHeart } from "react-icons/lu";
import { FaChartLine } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { message, notification } from "antd";
import fileUploadApiRequest from "@/apiRequests/fileUpload";
import userApiRequest from "@/apiRequests/user";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import authApiRequest from "@/apiRequests/auth";
import { fetchAccount, setUserCV } from "@/redux/slice/accountSlide";
import { useRouter } from "next/navigation";

interface ICV {
  name: string;
  uid: string;
}

interface IProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalUploadCV = (props: IProps) => {
  const { setIsDialogOpen } = props;
  const user = useAppSelector((state) => state?.account?.user);
  const [dataCV, setDataCV] = useState<ICV[]>([]);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

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
        if (resFile && resFile.data) {
          const urlCV = resFile.data.fileName;
          setDataCV([
            {
              name: urlCV,
              uid: uuidv4(),
            },
          ]);
        } else if (resFile.statusCode === 413) {
          event.target.value = "";
          notification.error({
            message: "Kích thước tệp quá lớn!",
            description: "Vui lòng tải tệp có kích thước dưới 5MB",
          });
          setDataCV([]);
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

  const fetchUpdateUserCV = async () => {
    setLoadingUpdate(true);
    const data = await userApiRequest.callUpdateCVByUser(dataCV[0]?.name);

    try {
      if (data.statusCode === 200) {
        const res = await authApiRequest.slideTokenFromNextClientToNextServer();
        message.success("Tải CV lên thành công!");
        dispatch(setUserCV({ urlCV: data.data?.urlCV }));
        localStorage.setItem("access_token", res?.data?.access_token as string);
        localStorage.setItem(
          "accessTokenExpiresAt",
          res?.data?.accessTokenExpires as string
        );
        dispatch(fetchAccount(res?.data?.access_token as string) as any);
        router.refresh();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notification.error({
        message: "Lỗi tải lên",
        description: "Đã xảy ra lỗi khi tải lên cv",
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-[-1px_1px_6px_rgba(0,0,0,0.05)] max-h-[500px] overflow-y-auto">
      <div className="py-6 px-8">
        <p className="text-[#212f3f] text-[14px] font-normal leading-[22px] tracking-[0.14px] mb-[20px]">
          Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự động đề
          xuất CV của bạn tới những nhà tuyển dụng uy tín.
          <br />
          Tiết kiệm thời gian, tìm việc thông minh, nắm bắt cơ hội và làm chủ
          đường đua nghề nghiệp của chính mình.
        </p>
        <div
          className="flex flex-col items-center gap-2 pt-4 pb-6 px-8 text-center bg-white border border-dashed border-[#b3b8bd] rounded-md cursor-pointer transition-all duration-400 mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex items-center gap-3">
            <Image
              src={UploadCloud}
              alt="UploadCloud"
              width={41.778}
              height={28}
            />
            <span className="text-[#263a4d] text-[14px] font-semibold leading-[135%]">
              Tải lên CV từ máy tính, chọn hoặc kéo thả
            </span>
          </div>
          {dataCV.length > 0 ? (
            <div>
              <p className="text-[#00b14f] mb-[10px] text-center">
                {dataCV[0].name}
              </p>
              <p className="text-[#00b14f] mb-[10px] text-center">
                Chọn tệp khác
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[#7f878f] text-[14px] font-normal leading-[20px] mb-2 text-center">
                Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB
              </p>
              <button className="bg-[#f2f4f5] border-none rounded-[4px] text-[#263a4d] text-[14px] font-semibold h-[36px] tracking-[0.175px] leading-[22px] px-4">
                Chọn CV
              </button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadFileCV}
            accept=".pdf"
            className="hidden"
            disabled={loadingUpload}
          />
        </div>
        <div className="border-b border-[#eee] pb-8 text-center">
          <button
            className="bg-[#00b14f] text-white text-[14px] font-semibold h-[40px] tracking-[0.175px] leading-[22px] px-4 w-[125px]"
            onClick={() => fetchUpdateUserCV()}
            disabled={loadingUpload || loadingUpdate}
          >
            Tải CV lên
          </button>
          {loadingUpload && (
            <div className="mt-2">
              <span>Đang tải lên...</span>
            </div>
          )}
          {loadingUpdate && (
            <div className="mt-2">
              <span>Đang tải lên CV...</span>
            </div>
          )}
        </div>

        <div className="grid gap-5 grid-cols-2 my-6">
          <div className="flex flex-col items-center justify-center gap-2 border border-[#e6e7e8] rounded-[10px] py-5">
            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full mb-3 text-2xl bg-[#f2fbf6] text-[#00b14f]">
              <LuFileHeart />
            </div>
            <h3 className="text-[#212f3f] text-[16px] font-semibold leading-[24px] tracking-[-0.16px] m-0 text-center">
              Nhận về các cơ hội tốt nhất
            </h3>
            <h4 className="text-[#7f878f] font-inter text-[14px] font-normal leading-[22px] tracking-[0.14px] m-0 text-center w-[70%]">
              CV của bạn sẽ được ưu tiên hiển thị với các nhà tuyển dụng đã xác
              thực. Nhận được lời mời với những cơ hội việc làm hấp dẫn từ các
              doanh nghiệp uy tín.
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 border border-[#e6e7e8] rounded-[10px] py-5">
            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full mb-3 text-2xl bg-[#fdf5f5] text-[#f70]">
              <FaChartLine />
            </div>
            <h3 className="text-[#212f3f] text-[16px] font-semibold leading-[24px] tracking-[-0.16px] m-0 text-center">
              Theo dõi số liệu, tối ưu CV
            </h3>
            <h4 className="text-[#7f878f] font-inter text-[14px] font-normal leading-[22px] tracking-[0.14px] m-0 text-center w-[70%]">
              Theo dõi số lượt xem CV. Biết chính xác nhà tuyển dụng nào trên
              TopCV đang quan tâm đến CV của bạn.
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 border border-[#e6e7e8] rounded-[10px] py-5">
            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full mb-3 text-2xl bg-[#f5f8fd] text-[#3b78dc]">
              <FaPaperPlane />
            </div>
            <h3 className="text-[#212f3f] text-[16px] font-semibold leading-[24px] tracking-[-0.16px] m-0 text-center">
              Chia sẻ CV bất cứ nơi đâu
            </h3>
            <h4 className="text-[#7f878f] font-inter text-[14px] font-normal leading-[22px] tracking-[0.14px] m-0 text-center w-[70%]">
              Upload một lần và sử dụng đường link gửi tới nhiều nhà tuyển dụng.
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 border border-[#e6e7e8] rounded-[10px] py-5">
            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full mb-3 text-2xl bg-[#fdf5f5] text-[#dc2f2f]">
              <BiSolidMessageSquareDetail />
            </div>
            <h3 className="text-[#212f3f] text-[16px] font-semibold leading-[24px] tracking-[-0.16px] m-0 text-center">
              Kết nối nhanh chóng với nhà tuyển dụng
            </h3>
            <h4 className="text-[#7f878f] font-inter text-[14px] font-normal leading-[22px] tracking-[0.14px] m-0 text-center w-[70%]">
              Dễ dàng kết nối với các nhà tuyển dụng nào xem và quan tâm tới CV
              của bạn
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUploadCV;
