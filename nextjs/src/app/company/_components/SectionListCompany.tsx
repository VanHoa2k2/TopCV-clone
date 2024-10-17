import React from "react";
import companyApiRequest from "@/apiRequests/company";
import { IAllCompany, ICompany } from "@/types/backend";
import Image from "next/image";
import Link from "next/link";
import ImageCoverDefault from "@/assets/images/company_cover_1.webp";
import parse from "html-react-parser";
import SkeletonCompanyCard from "./SkeletonCompanyCard";

const SectionListCompany = async () => {
  let companies: IAllCompany[];
  try {
    const response = await companyApiRequest.callFetchAllCompany();
    companies = response.data as unknown as IAllCompany[];
  } catch (error) {
    console.error("Error fetching companies:", error); // Xử lý lỗi
    companies = []; // Đặt giá trị mặc định nếu có lỗi
  }

  const isLoading = !companies;

  return (
    <div className="container max-w-[1320px] px-[7.5px]">
      <h1 className="text-center py-6 text-[#333] text-sm lg:text-2xl font-semibold">
        DANH SÁCH CÁC CÔNG TY NỔI BẬT
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[15px]">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCompanyCard key={index} />
            ))
          : companies.map((company: ICompany) => (
              <div
                key={company.id}
                className="rounded-[5px] shadow-[-1px_1px_4px_rgba(0,0,0,0.051)] h-[400px] mb-6 overflow-hidden hover:shadow-[0_5px_10px_0_rgba(0,0,0,0.07)] transition-shadow duration-300"
              >
                <div className="relative">
                  <div className="h-[180px] mb-4 overflow-hidden">
                    <div className="h-[150px]">
                      <Link href={`/company/${company.id}`}>
                        <Image
                          src={
                            company?.coverImage
                              ? `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/coverImage/${company?.coverImage}`
                              : ImageCoverDefault
                          }
                          alt={`${company?.name}`}
                          width={400}
                          height={150}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="absolute bottom-0 left-4 w-16 h-16 bg-white border border-gray-200 rounded-md">
                      <Link href={`/company/${company.id}`}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${company?.logo}`}
                          alt={`${company?.name}`}
                          width={62}
                          height={62}
                          className="w-full object-cover"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="px-4">
                  <h3 className="text-sm font-medium text-[#333] uppercase">
                    <Link href={`/company/${company.id}`}>{company.name}</Link>
                  </h3>

                  <div className="text-[#555] text-[14px] leading-normal pt-4 h-[140px] overflow-hidden line-clamp-6">
                    {parse(company?.description ?? "")}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default SectionListCompany;
