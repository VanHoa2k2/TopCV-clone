import CompaniesCarousel from "@/components/client/companies/CompaniesCarousel";
import CompaniesCarouselSkeleton from "@/components/client/companies/CompaniesCarouselSkeleton";
import BestJobs from "@/components/client/jobs/BestJobs";
import React, { Suspense } from "react";
import SectionJobHeader from "./_components/SectionJobHeader";
import SectionJobHeaderSkeleton from "./_components/SectionJobHeaderSkeleton";
import SuggestJobsByCV from "@/components/client/jobs/SuggestJobsByCV";

const jobClient = () => {
  return (
    <>
      <Suspense fallback={<SectionJobHeaderSkeleton />}>
        <SectionJobHeader />
      </Suspense>
      <SuggestJobsByCV />
      <Suspense fallback={<CompaniesCarouselSkeleton />}>
        <CompaniesCarousel />
      </Suspense>
      <BestJobs />
    </>
  );
};

export default jobClient;
