import companyApiRequest from "@/apiRequests/company";
import { Metadata } from "next";
import { cache } from "react";
import { baseOpenGraph } from "@/lib/shared-metadata";
import SkeletonCompanyDetail from "./_components/SkeletonCompanyDetail";
import CompanyDetailContent from "./_components/CompanyDetailContent";
import { Suspense } from "react";

const callFetchCompanyById = cache(companyApiRequest.callFetchCompanyById);

interface IProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { id } = await params;
  const { data } = await callFetchCompanyById(id);
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

const CompanyDetailPage = async ({ params }: IProps) => {
  const { id } = await params;
  return (
    <Suspense fallback={<SkeletonCompanyDetail />}>
      <CompanyDetailContent id={id} />
    </Suspense>
  );
};

export default CompanyDetailPage;
