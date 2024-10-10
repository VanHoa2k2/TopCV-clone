import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tooltip } from "antd";
import { IJob } from "@/types/backend";

interface JobCardProps {
  job: IJob;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="pl-3 bg-white rounded-sm flex hover:bg-[#f6f6f6] hover:outline hover:outline-1 hover:outline-[#d3d5d9]">
      <Link
        href={`/job/${job.id}`}
        className="p-[2px] flex-shrink-0 flex items-center justify-center h-full"
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${job.company?.logo}`}
          alt={`${job?.company?.name}`}
          width={70}
          height={70}
          className="object-contain"
        />
      </Link>
      <div className="flex flex-col p-3 min-h-[44px] w-full !overflow-hidden !text-ellipsis !whitespace-nowrap">
        <Tooltip placement="top" title={job.name}>
          <h3 className="text-sm font-semibold text-[#212f3f] hover:text-primary">
            <Link
              href={`/job/${job.id}`}
              className="block overflow-hidden text-ellipsis whitespace-nowrap mb-[3px]l"
            >
              {job.name}
            </Link>
          </h3>
        </Tooltip>
        <Tooltip placement="top" title={job.company?.name}>
          <Link
            href={`/company/${job.company?.id}`}
            className="block text-xs text-[#a6acb2] font-medium overflow-hidden text-ellipsis whitespace-nowrap  mt-1"
          >
            {job.company?.name}
          </Link>
        </Tooltip>
        <div className="flex items-center gap-1 mt-2">
          <div className="bg-[#f4f5f5] text-xs text-[#212f3f] font-medium py-1 px-2 rounded-sm">
            {job.salary}
          </div>
          <div className="bg-[#f4f5f5] text-xs text-[#212f3f] font-medium py-1 px-2 rounded-sm">
            {job.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
