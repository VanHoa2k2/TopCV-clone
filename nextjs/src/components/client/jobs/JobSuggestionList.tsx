"use client";
import React from "react";
import { IJob } from "@/types/backend";
import PaginationControls from "@/components/share/PaginationControls";
import JobCardSuggest from "./JobCardSuggest";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import jobApiRequest from "@/apiRequests/job";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Robot from "@/assets/images/dashboard-item.webp";
import { FaUpload } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModalUploadCV from "@/app/manage-cv/_components/ModalUploadCV";
import BgUpload from "@/assets/images/upload_cV_arrow_bg.webp";
import BannerUpload from "@/assets/images/banner_upload.webp";

const JobSuggestionList = () => {
  const user = useAppSelector((state) => state?.account?.user);
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchJobs = useCallback(
    async (page: number, sort?: any, activeFilter?: string) => {
      setIsLoading(true);
      if (user?.urlCV) {
        const res = await jobApiRequest.callGetJobsSuggestByCv(
          `current=${page}&pageSize=6`,
          user.urlCV
        );
        setPages(res.data?.meta?.pages || 0);
        setJobs(res?.data?.result || []);
      }
      setIsLoading(false);
    },
    [user?.urlCV]
  );

  useEffect(() => {
    if (user?.urlCV) {
      fetchJobs(currentPage);
    }
  }, [currentPage, user?.urlCV, fetchJobs]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < (pages ?? 1)) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  return (
    <>
      <div className="flex justify-between pb-4">
        <div className="text-[#00b14f] text-2xl font-semibold">
          <h2>
            {user.urlCV
              ? "Gợi ý việc làm phù hợp với CV của bạn"
              : "Upload CV để các cơ hội việc làm tự tìm đến bạn"}
          </h2>
        </div>
        {user.urlCV ? (
          <PaginationControls
            currentPage={currentPage}
            totalPages={pages}
            hidePageNumbers={true}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        ) : (
          ""
        )}
      </div>
      {user.urlCV ? (
        <>
          <div className="grid grid-cols-2 gap-5 mb-4">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => <JobCardSkeleton key={index} />)
              : jobs.map((job) => <JobCardSuggest job={job} key={job.id} />)}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={pages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </>
      ) : (
        <div className="flex justify-between items-center">
          <div className="w-[650px]">
            <h2 className="text-primary text-[18px] font-normal leading-[24px] tracking-[-0.16px] m-0">
              Giảm đến 50% thời gian cần thiết để tìm được một công việc phù hợp
            </h2>
            <p className="text-[#212f3f] text-[14px] font-normal leading-[22px] tracking-[0.14px] mt-2">
              Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự động
              đề xuất CV của bạn tới những nhà tuyển dụng uy tín.
              <br />
              Tiết kiệm thời gian, tìm việc thông minh, nắm bắt cơ hội và làm
              chủ đường đua nghề nghiệp của chính mình.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex gap-1 rounded-full text-white leading-none py-[11px] px-4 mt-6">
                  <FaUpload /> Tải CV ngay
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

          <Image
            src={Robot}
            alt={"Robot"}
            width={400}
            height={174}
            className="object-cover h-[174px]"
          />
        </div>
      )}
    </>
  );
};

const JobCardSkeleton = () => (
  <div className="rounded-lg flex gap-5 p-3 bg-[#f2fbf6] border border-[#acf2cb]">
    <Skeleton className="h-[120px] w-[120px] rounded-lg" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-[70%] mb-2" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-5 w-[60%] mb-2" />
      <Skeleton className="h-5 w-[50%] mb-2" />
    </div>
  </div>
);

export default JobSuggestionList;
