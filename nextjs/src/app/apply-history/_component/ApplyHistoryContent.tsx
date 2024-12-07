"use client";
import React, { useEffect, useState } from "react";
import resumeApiRequest from "@/apiRequests/resume";
import { IResume } from "@/types/backend";
import JobResumeHistory from "./CardJobHistory";
import Link from "next/link";
import Image from "next/image";
import Banner from "@/assets/images/Banner-job-search.webp";
import Report from "@/assets/images/recruiment_report_2023_2024.webp";

const ApplyHistoryContent = () => {
  const [resumes, setResumes] = useState<IResume[] | undefined>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Lấy access_token từ localStorage chỉ khi đang ở client
    setAccessToken(localStorage?.getItem("access_token"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          const res = await resumeApiRequest.callFetchResumeByUser(accessToken);
          setResumes(res?.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [accessToken]);

  return (
    <div className="container">
      <div className="flex pb-10 gap-5">
        <div className="w-[66.66666667%] flex flex-col gap-4 bg-[#fff] p-4 rounded-[12px] shadow-[0_-1px_6px_rgba(0,0,0,0.05)] h-[100%]">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[20px] font-normal tracking-[-0.2px] leading-[28px]">
              Việc làm đã ứng tuyển
            </div>
          </div>
          {resumes?.map((resume) => (
            <JobResumeHistory key={resume.id} resume={resume} />
          ))}
        </div>
        <div className="w-[33.33333333%]">
          <div className="sticky top-[85px] flex flex-col gap-5">
            <Link href="/">
              <Image
                src={Banner}
                alt="Banner"
                width={365}
                height={660}
                className="rounded-[8px]"
              />
            </Link>
            <Link href="/">
              <Image
                src={Report}
                alt="Report"
                width={351}
                height={276}
                className="rounded-[8px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyHistoryContent;
