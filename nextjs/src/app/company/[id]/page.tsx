import companyApiRequest from "@/apiRequests/company";
import Image from "next/image";
import Link from "next/link";
import React, { cache } from "react";
import { FaAngleRight } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import ImageCoverDefault from "@/assets/images/company_cover_1.webp";
import CompanyDetailDesc from "./_components/CompanyDetailDesc";
import { Metadata } from "next";
import { baseOpenGraph } from "@/lib/shared-metadata";
import SkeletonCompanyDetail from "./_components/SkeletonCompanyDetail";

const callFetchCompanyById = cache(companyApiRequest.callFetchCompanyById);

interface IProps {
  params: { id: string };
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { data } = await callFetchCompanyById(params?.id);
  const url = process.env.NEXT_PUBLIC_URL + "/company/" + data?.id;
  return {
    title: data?.name,
    description: data?.name,
    openGraph: {
      ...baseOpenGraph,
      title: data?.name,
      description: data?.name,
      url,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${data?.logo}`,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

export async function generateStaticParams() {
  // Giả sử bạn có một API gọi để lấy danh sách tất cả các công ty
  const companies = await companyApiRequest.callFetchAllCompany();

  return Array.isArray(companies?.data)
    ? companies.data.map((company: { id: string }) => ({
        id: company.id,
      }))
    : [];
}

const CompanyDetailPage = async ({ params }: IProps) => {
  try {
    const res = await callFetchCompanyById(params.id);
    const companyDetail = res.data;

    if (!companyDetail) {
      return <SkeletonCompanyDetail />;
    }

    return (
      <div className="bg-[#f4f5f5] pb-10">
        <div className="container">
          <div className="flex flex-wrap items-center py-5">
            <Link
              href={`/company`}
              className="text-[#00b14f] text-sm font-semibold leading-[22px] tracking-[0.175px]"
            >
              Danh sách công ty
            </Link>
            <span className="flex items-center justify-center w-4 h-4 mx-1 text-sm font-normal text-[#212f3f]">
              <FaAngleRight />
            </span>
            <span className="text-[#212f3f] text-sm font-normal leading-[22px] tracking-[0.14px]">
              {companyDetail?.name}
            </span>
          </div>

          <div className="bg-bgCompanyDetail rounded-[10px] h-[358px] overflow-hidden mb-6">
            <div className="h-[224px] overflow-hidden">
              <Image
                src={
                  companyDetail?.coverImage
                    ? `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/coverImage/${companyDetail?.coverImage}`
                    : ImageCoverDefault
                }
                alt={`${companyDetail?.name}`}
                width={1170}
                height={224}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-center bg-white border-[4.5px] border-solid border-white rounded-[99px] h-[180px] w-[180px] overflow-hidden absolute top-[-90px] left-10">
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${companyDetail?.logo}`}
                  alt={`${companyDetail?.name}`}
                  width={180}
                  height={180}
                  className="w-[80%] h-[80%] object-contain"
                />
              </div>
            </div>

            <div className="pl-[252px] pr-[40px] my-[30px]">
              <h1 className="text-white text-[20px] font-semibold leading-[28px] mb-4 mt-0 max-w-full overflow-hidden line-clamp-2">
                {companyDetail?.name}
              </h1>
              <div className="flex items-center gap-5 w-full">
                <div className="flex whitespace-nowrap">
                  <span className="flex items-center justify-center text-[white] text-[16px] mr-4">
                    <FaGlobe />
                  </span>
                  <Link
                    href={`${companyDetail?.linkWebsite}`}
                    target="_blank"
                    className="text-[white] text-sm text-ellipsis whitespace-nowrap overflow-hidden"
                  >
                    {companyDetail?.linkWebsite}
                  </Link>
                </div>
                <div className="flex whitespace-nowrap">
                  <span className="flex items-center justify-center text-[white] text-[16px] mr-4">
                    <HiOutlineBuildingOffice2 />
                  </span>
                  <span className="text-[white] text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                    {companyDetail?.employeeSize}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-[30px]">
            <div className="w-[66.66666667%] mb-8 rounded-[10px] bg-white overflow-hidden">
              <h2 className="bg-bgCompanyDetail text-white text-[18px] font-semibold leading-[26px] py-3 px-5">
                Giới thiệu công ty
              </h2>
              <CompanyDetailDesc
                description={companyDetail?.description as string}
              />
            </div>

            <div className="w-[33.33333333%] h-full mb-8 rounded-[10px] bg-white overflow-hidden">
              <h2 className="bg-bgCompanyDetail text-white text-[18px] font-semibold leading-[26px] py-3 px-5">
                Thông tin liên hệ
              </h2>
              <div className="pt-5 pb-7 px-5">
                <div className="flex items-center mb-2">
                  <span className="text-[#00b14f] text-[19.2px] font-black h-[25.6px] leading-[26px] mr-[7.2px] text-center w-[25.6px]">
                    <FaLocationDot />
                  </span>
                  <span className="text-sm text-[#212f3f] font-medium">
                    Địa chỉ công ty
                  </span>
                </div>
                <div className="text-[#4d5965] text-[14px]">
                  {companyDetail?.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching company details:", error); // Xử lý lỗi
    return <div>Error loading company details.</div>; // Hiển thị thông báo lỗi
  }
};

export default CompanyDetailPage;
