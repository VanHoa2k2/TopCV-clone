import React, { Suspense } from "react";
import SectionCompanyHeader from "./_components/SectionCompanyHeader";
import SectionListCompany from "./_components/SectionListCompany";
import SectionListCompanySkeleton from "./_components/SectionListCompanySkeleton";

const companyClient = () => {
  return (
    <>
      <SectionCompanyHeader />
      <Suspense fallback={<SectionListCompanySkeleton />}>
        <SectionListCompany />
      </Suspense>
    </>
  );
};

export default companyClient;
