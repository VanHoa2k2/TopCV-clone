import CompaniesCarousel from "@/components/client/companies/CompaniesCarousel";
import BestJobs from "@/components/client/jobs/BestJobs";
import React from "react";
import SectionJobHeader from "./_components/SectionJobHeader";
import SuggestJobsByCV from "@/components/client/jobs/SuggestJobsByCV";

const jobClient = () => {
  return (
    <>
      <SectionJobHeader />
      <SuggestJobsByCV />
      <CompaniesCarousel />
      <BestJobs />
    </>
  );
};

export default jobClient;
