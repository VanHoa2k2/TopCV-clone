"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaRegPaperPlane } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import ModalApplyJob from "./ModalApplyJob";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { IJob } from "@/types/backend";

interface IProps {
  jobDetail: IJob | undefined;
  isExpired: boolean;
}

const BtnApplyJob = (props: IProps) => {
  const { jobDetail, isExpired } = props;
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  const route = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-calc-job-detail font-semibold h-10 gap-1.5 tracking-[.175px] text-sm leading-[22px] py-2 pl-3 pr-4"
          disabled={isExpired}
        >
          {isExpired ? (
            "Công việc đã hết hạn"
          ) : (
            <>
              <span className="text-[14px] p-1">
                <FaRegPaperPlane />
              </span>
              Ứng tuyển ngay
            </>
          )}
        </Button>
      </DialogTrigger>
      {isAuthenticated ? (
        <DialogContent className="p-0 max-w-[650px] border-none">
          <DialogHeader>
            <DialogTitle
              className="bg-white pt-5 px-8 pb-4 rounded-t-lg relative"
              style={{ boxShadow: "0 3px 4px 0 rgba(0, 0, 0, .03)" }}
            >
              <div className="bg-[#f2f4f5] float-right mt-[-2px] flex items-center rounded-[50%] h-8 justify-around opacity-[1] w-8 cursor-pointer">
                <span
                  className="text-[#b3b8bd] text-[20px] leading-[20px]"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <FaXmark />
                </span>
              </div>
              <h4 className="text-[#263a4d] text-lg font-bold tracking-[-.2px]">
                Ứng tuyển{" "}
                <span className="text-[#00b14f]">{jobDetail?.name}</span>
              </h4>
            </DialogTitle>
            <ModalApplyJob
              jobDetail={jobDetail}
              setIsDialogOpen={setIsDialogOpen}
            />
          </DialogHeader>
        </DialogContent>
      ) : (
        <DialogContent className="p-0 max-w-[440px] border-none">
          <DialogHeader>
            <DialogTitle className="bg-bgHeaderUploadCV rounded-t-lg py-2.5 px-5 relative">
              <h1 className="text-white text-[20px] font-bold leading-[28px] tracking-[-0.2px]">
                Bạn chưa đăng nhập
              </h1>
            </DialogTitle>
            <div className="pt-4 pb-5 px-5">
              <p className="text-sm text-[#263a4d] mb-5">
                Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể Apply
                CV bạn nhé -.-
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  className="bg-[#f2f4f5] text-[#263a4d] border border-solid border-[#263a4d] hover:bg-[#f2f4f5]"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={() =>
                    route.push(`/login?callback=${window.location.href}`)
                  }
                >
                  Đăng nhập ngay
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default BtnApplyJob;
