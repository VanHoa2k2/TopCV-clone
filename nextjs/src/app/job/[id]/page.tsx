import jobApiRequest from "@/apiRequests/job";
import { Metadata } from "next";
import { cache } from "react";
import { baseOpenGraph } from "@/lib/shared-metadata";
import SkeletonJobDetail from "./_components/SkeletonJobDetail";
import JobDetailContent from "./_components/JobDetailContent";
import { Suspense } from "react";

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

const JobDetailPage = ({ params }: IProps) => {
  return (
    <Suspense fallback={<SkeletonJobDetail />}>
      <JobDetailContent id={params.id} />
    </Suspense>
  );
};

export default JobDetailPage;
