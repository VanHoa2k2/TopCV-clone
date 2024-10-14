import parse from "html-react-parser";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import jobApiRequest from "@/apiRequests/job";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa6";
import { GoClockFill } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { FaIdBadge } from "react-icons/fa";
import { BsFillBackpack4Fill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import styles from "./job-detail.module.scss";
import BtnApplyJob from "./_components/BtnApplyJob";
import { Metadata } from "next";
import { cache } from "react";
import { baseOpenGraph } from "@/lib/shared-metadata";
import SkeletonJobDetail from "./_components/SkeletonJobDetail";
dayjs.extend(relativeTime);

const callFetchJobById = cache(jobApiRequest.callFetchJobById);

interface IProps {
  params: { id: string };
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { data } = await callFetchJobById(params?.id);
  const url = process.env.NEXT_PUBLIC_URL + "/job/" + data?.id;
  return {
    title: data?.name,
    description: data?.name,
    openGraph: {
      ...baseOpenGraph,
      title: data?.name,
      description: data?.name,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

// export async function generateStaticParams() {
//   // Giả sử bạn có một API gọi để lấy danh sách tất cả các công ty
//   const jobs = await jobApiRequest.callFetchAllJob();

//   return Array.isArray(jobs?.data)
//     ? jobs.data.map((job: { id: number }) => ({
//         id: String(job.id), // Ensure id is a string
//       }))
//     : [];
// }

const JobDetailPage = async ({ params }: IProps) => {
  try {
    const id = params?.id; // job id

    const res = await callFetchJobById(id);
    const jobDetail = res.data;

    if (!jobDetail) {
      return <SkeletonJobDetail />;
    }

    const skillJob = jobDetail?.skills ?? [];

    // Kiểm tra nếu công việc đã hết hạn
    const isExpired = dayjs().isAfter(dayjs(jobDetail?.endDate));

    const infoItems = [
      {
        icon: <AiFillDollarCircle />,
        label: "Mức lương",
        value: jobDetail?.salary,
      },
      {
        icon: <FaLocationDot />,
        label: "Địa điểm",
        value: jobDetail?.location,
      },
      {
        icon: <FaHourglassHalf />,
        label: "Kinh nghiệm",
        value: jobDetail?.experience,
      },
    ];

    return (
      <div className="bg-[#f4f5f5] pb-10">
        <div className="container">
          <div className="flex flex-wrap items-center py-3">
            <Link
              href={`/`}
              className="text-[#00b14f] text-sm font-semibold leading-[22px] tracking-[0.175px]"
            >
              Trang chủ
            </Link>
            <span className="flex items-center justify-center w-4 h-4 mx-1 text-sm font-normal text-[#212f3f]">
              <FaAngleRight />
            </span>
            <span className="text-[#212f3f] text-sm font-normal leading-[22px] tracking-[0.14px]">
              {jobDetail?.name}
            </span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-6 w-[67%]">
              <div className="flex flex-col gap-4 bg-white rounded-lg py-5 px-6 w-full">
                <h1 className="text-[#263a4d] text-xl tracking-[-.2px] font-bold overflow-hidden text-ellipsis">
                  {jobDetail?.name}
                </h1>
                <div className="flex items-center">
                  {infoItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 w-[33.3333333333%]"
                    >
                      <div className="flex items-center bg-bgJobDetailIcon rounded-[30px] flex-col gap-2.5 h-10 justify-center p-2.5 w-10">
                        <span className="text-[20px] text-white">
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-[#263a4d] text-[14px] leading-[22px] tracking-[.14px]">
                          {item.label}
                        </div>
                        <div className="text-[#212f3f] text-[14px] font-semibold leading-[22px] tracking-[.175px]">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-18px">
                  <div className="flex items-center bg-[#f2f4f5] rounded-sm text-[#263a4d] text-[14px] leading-[22px] gap-[6px] tracking-[.14px] py-0.5 pr-2 pl-1">
                    <span className="p-1">
                      <GoClockFill />
                    </span>
                    Hạn nộp hồ sơ:{" "}
                    {dayjs(jobDetail?.endDate).format("DD/MM/YYYY")}
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-3 mt-1">
                  <BtnApplyJob jobDetail={jobDetail} isExpired={isExpired} />
                  <Tooltip
                    placement="top"
                    title={<span>Chức năng chưa được phát triễn</span>}
                  >
                    <div className="bg-white border border-solid border-[#99e0b9] text-primary w-[130px] flex items-center justify-center rounded-[6px] cursor-pointer text-sm leading-[22px] font-semibold gap-[6px] h-10 tracking-[.175] py-2 pr-4 pl-3">
                      <span className="text-[14px] p-1">
                        <FaRegHeart />
                      </span>
                      Lưu tin
                    </div>
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-col gap-5 bg-white rounded-lg py-5 px-6 w-full">
                <div className="h-10 flex items-center">
                  <h2 className="border-l-[6px] border-solid border-primary text-[#212f3f] text-[20px] font-bold tracking-[-.2px] leading-[28px] pl-2.5">
                    Chi tiết tin tuyển dụng
                  </h2>
                </div>
                <div className={styles["job-description"]}>
                  {parse(jobDetail?.description as string)}
                  <p className="mt-[26px]">
                    Hạn nộp hồ sơ:{" "}
                    {dayjs(jobDetail?.endDate).format("DD/MM/YYYY")}
                  </p>

                  <Button
                    className="font-semibold h-10 gap-1.5 tracking-[.175px] text-sm leading-[22px] py-2 px-4"
                    disabled={isExpired}
                  >
                    {isExpired ? "Công việc đã hết hạn" : "Ứng tuyển ngay"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-col gap-6 w-calc-left-content-job-detail ">
              <div className="flex flex-col gap-4 rounded-lg bg-white p-5 w-full">
                <div className="flex flex-col w-full">
                  <div className="flex gap-4 mb-3">
                    <Tooltip
                      placement="top"
                      title={<span>{jobDetail?.company?.name}</span>}
                    >
                      <Link
                        href={`/company/${jobDetail?.company?.id}`}
                        className="flex justify-center items-center bg-white border border-solid border-[#e9eaec] rounded-lg w-[88px] h-[88px]"
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${jobDetail?.company?.logo}`}
                          alt={`${jobDetail?.company?.name}`}
                          width={73.92}
                          height={73.92}
                          className="object-contain"
                        />
                      </Link>
                    </Tooltip>
                    <Tooltip
                      placement="top"
                      title={<span>{jobDetail?.company?.name}</span>}
                    >
                      <h2 className="flex flex-col gap-1 w-calc-name-company text-[30px]">
                        <Link
                          href={`/company/${jobDetail?.company?.id}`}
                          className="self-stretch text-[#212f3f] text-[16px] font-semibold tracking-[-0.16px] leading-[24px] max-h-[70px] overflow-hidden text-ellipsis w-full 
               [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]"
                        >
                          {jobDetail?.company?.name}
                        </Link>
                      </h2>
                    </Tooltip>
                  </div>

                  <div className="flex gap-4 mb-2">
                    <div className="flex items-center text-[#7f878f] text-[14px] gap-2 tracking-[.14px] leading-[22px] w-[88px]">
                      <HiUsers />
                      Quy mô
                    </div>
                    <div
                      className="text-[#212f3f] text-[14px] leading-[22px] tracking-[.14px] font-medium"
                      style={{ width: "calc(100% - 104px)" }}
                    >
                      {jobDetail?.company?.employeeSize}
                    </div>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div className="flex items-center text-[#7f878f] text-[14px] gap-2 tracking-[.14px] leading-[22px] w-[88px]">
                      <FaLocationDot />
                      Địa điểm
                    </div>
                    <div
                      className="text-[#212f3f] text-[14px] leading-[22px] tracking-[.14px] font-medium overflow-hidden text-ellipsis [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                      style={{ width: "calc(100% - 104px)" }}
                    >
                      {jobDetail?.company?.address}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/company/${jobDetail?.company?.id}`}
                  className="flex items-center gap-2.5 justify-center w-full text-[#00b14f] text-[14px] leading-[22px] font-semibold tracking-[.175] hover:underline"
                >
                  Xem trang công ty <BsBoxArrowUpRight />
                </Link>
              </div>

              <div className="bg-white rounded-2 p-5 w-full">
                <h2 className="text-[#212f3f] text-[20px] font-bold leading-[28px] mb-4 tracking-[-.2px]">
                  Thông tin chung
                </h2>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-[#00b14f] rounded-[30px] gap-[10px] h-[40px] w-[40px] p-[10px]">
                      <span className="text-[16px] text-white">
                        <FaIdBadge />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[#4d5965] text-[14px] leading-[22px] tracking-[.14px]">
                        Cấp bậc
                      </div>
                      <div className="text-[#212f3f] text-[14px] font-semibold leading-[22px] tracking-[.14px]">
                        {jobDetail?.level}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-[#00b14f] rounded-[30px] gap-[10px] h-[40px] w-[40px] p-[10px]">
                      <span className="text-[16px] text-white">
                        <FaHourglassHalf />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[#4d5965] text-[14px] leading-[22px] tracking-[.14px]">
                        Kinh nghiệm
                      </div>
                      <div className="text-[#212f3f] text-[14px] font-semibold leading-[22px] tracking-[.14px]">
                        {jobDetail?.experience}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-[#00b14f] rounded-[30px] gap-[10px] h-[40px] w-[40px] p-[10px]">
                      <span className="text-[16px] text-white">
                        <HiUsers />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[#4d5965] text-[14px] leading-[22px] tracking-[.14px]">
                        Số lượng tuyển
                      </div>
                      <div className="text-[#212f3f] text-[14px] font-semibold leading-[22px] tracking-[.14px]">
                        {jobDetail?.quantity} người
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-[#00b14f] rounded-[30px] gap-[10px] h-[40px] w-[40px] p-[10px]">
                      <span className="text-[16px] text-white">
                        <BsFillBackpack4Fill />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[#4d5965] text-[14px] leading-[22px] tracking-[.14px]">
                        Hình thức làm việc
                      </div>
                      <div className="text-[#212f3f] text-[14px] font-semibold leading-[22px] tracking-[.14px]">
                        {jobDetail?.employmentType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2 p-5 w-full flex flex-col gap-5">
                <div>
                  <div className="mb-3 text-[#212f3f] text-[20px] leading-[28px] font-bold tracking-[-.2px]">
                    Ngành nghề
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {jobDetail?.occupations.map((occupation, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center bg-[#f4f5f5] rounded-[3px] text-[#212f3f] text-[12px] font-normal tracking-[.12px] leading-[16px] p-[4px]"
                      >
                        {occupation as unknown as string}
                      </div>
                    ))}
                  </div>
                </div>
                {skillJob.length > 0 ? (
                  <div>
                    <div className="mb-3 text-[#212f3f] text-[20px] leading-[28px] font-bold tracking-[-.2px]">
                      Kỹ năng
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {skillJob.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center bg-[#f4f5f5] rounded-[3px] text-[#212f3f] text-[12px] font-normal tracking-[.12px] leading-[16px] p-[4px]"
                        >
                          {skill as unknown as string}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div>
                  <div className="mb-3 text-[#212f3f] text-[20px] leading-[28px] font-bold tracking-[-.2px]">
                    Khu vực
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex items-center justify-center bg-[#f4f5f5] rounded-[3px] text-[#212f3f] text-[12px] font-normal tracking-[.12px] leading-[16px] p-[4px]">
                      {jobDetail?.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching job details:", error);
    return <div>Error loading job details.</div>;
  }
};

export default JobDetailPage;
