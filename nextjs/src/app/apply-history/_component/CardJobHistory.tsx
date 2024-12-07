"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "antd";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { IJob, IResume } from "@/types/backend";
import jobApiRequest from "@/apiRequests/job";
import dayjs from "dayjs";
import { ResumeIcon } from "@radix-ui/react-icons";

interface JobResumeHistoryProps {
  resume: IResume;
}

const JobResumeHistory: React.FC<JobResumeHistoryProps> = ({ resume }) => {
  const [job, setJob] = useState<IJob>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (resume.job.id) {
          const res = await jobApiRequest.callFetchJobById(
            resume.job.id as unknown as string
          );
          setJob(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [resume.job.id]);
  return (
    <div
      key={resume.id}
      className="rounded-lg flex gap-5 p-3 border border-[#acf2cb]"
    >
      <div className="flex items-center rounded-lg h-[120px] p-[2px] w-[120px] bg-white border border-[#e9eaec] ">
        <Link href={`/job/${resume.id}`} className="flex overflow-hidden p-1.5">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${job?.company?.logo}`}
            alt={`${job?.company?.name}`}
            width={106.4}
            height={106.4}
            className="object-cover h-full"
          />
        </Link>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <Tooltip placement="top" title={resume.job.name}>
            <h3 className="text-[#212f3f] text-base font-semibold leading-6 w-[70%] m-0 mb-[5px] overflow-hidden text-ellipsis">
              <Link href={`/job/${resume.job.id}`}>{resume.job.name}</Link>
            </h3>
          </Tooltip>
          <div className="h-7 min-w-[80px] text-right">
            <label className="text-[#00b14f] text-sm font-semibold leading-[22px] whitespace-nowrap">
              {job?.salary}
            </label>
          </div>
        </div>
        <Link
          href={`/company/${job?.company?.id}`}
          className="text-[#6f7882] text-[16px] font-normal leading-[22px] flex items-center h-5 mb-2 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <Tooltip placement="top" title={job?.company?.name}>
            {job?.company?.name}
          </Tooltip>
        </Link>
        <p className="text-[#4b4f55] font-normal text-[16px] leading-[22px] flex items-center h-5 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <Tooltip placement="top" title={job?.createdAt}>
            Thời gian ứng tuyển{" "}
            {dayjs(job?.createdAt).format("DD-MM-YYYY HH:mm")}
          </Tooltip>
        </p>
        <p className="text-[#6f7882] text-sm font-normal leading-[22px] flex items-center h-5 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
          CV đã ứng tuyển:{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${resume?.url}`}
            target="_blank"
            className="text-[#00b14f] underline ml-1"
          >
            CV tải lên
          </Link>
        </p>

        <div className="border-t border-solid border-[#e7e7e7] flex justify-between mt-[12px] pt-[12px]">
          <span
            className={`${
              resume?.status === "Chưa giải quyết"
                ? "text-[#3b78dc]"
                : "text-[#f70]"
            } text-[14px] font-normal leading-[20px] w-[calc(50%-6px)]`}
          >
            {resume?.status} {dayjs(job?.createdAt).format("DD-MM-YYYY HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobResumeHistory;
