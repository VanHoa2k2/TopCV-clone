import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "antd";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { IJob } from "@/types/backend";

interface JobCardSuggestProps {
  job: IJob;
}

const JobCardSuggest: React.FC<JobCardSuggestProps> = ({ job }) => {
  return (
    <div
      key={job.id}
      className="rounded-lg flex gap-5 p-3 bg-[#f2fbf6] border border-[#acf2cb] hover:bg-[#f2fbf6] hover:border hover:border-[#00b14f]"
    >
      <div className="flex items-center rounded-lg h-[120px] p-[2px] w-[120px] bg-white border border-[#e9eaec] ">
        <Link href={`/job/${job.id}`} className="flex overflow-hidden p-1.5">
          <Image
            src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${job.company?.logo}`}
            alt={`${job.company?.name}`}
            width={106.4}
            height={106.4}
            className="object-cover h-full"
          />
        </Link>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <Tooltip placement="top" title={job.name}>
            <h3 className="text-[#212f3f] text-base font-semibold leading-6 h-[50px] w-[70%] m-0 mb-[5px] overflow-hidden text-ellipsis">
              <Link href={`/job/${job.id}`}>{job.name}</Link>
            </h3>
          </Tooltip>
          <div className="h-7 min-w-[80px] text-right">
            <label className="text-[#00b14f] text-sm font-semibold leading-[22px] whitespace-nowrap">
              {job.salary}
            </label>
          </div>
        </div>
        <Link
          href={`/company/${job.company?.id}`}
          className="text-[#6f7882] text-sm font-normal leading-[22px] flex items-center h-5 mb-2 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <span className="w-4 mr-1">
            <HiOutlineBuildingOffice2 />
          </span>{" "}
          <Tooltip placement="top" title={job.company?.name}>
            {job.company?.name}
          </Tooltip>
        </Link>
        <p className="text-[#6f7882] text-sm font-normal leading-[22px] flex items-center h-5 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="w-4 mr-1">
            <IoLocationOutline />
          </span>{" "}
          <Tooltip placement="top" title={job.location}>
            {job.location}
          </Tooltip>
        </p>
      </div>
    </div>
  );
};

export default JobCardSuggest;
