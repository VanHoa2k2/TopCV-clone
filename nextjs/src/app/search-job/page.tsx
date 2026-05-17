import React, { Suspense } from "react";
import HeaderSearchJobPage from "./_components/HeaderSearchJobPage";
import SearchJobResult from "./_components/SearchJobResult";
import SearchJobResultSkeleton from "./_components/SearchJobResultSkeleton";

interface IProps {
  searchParams: { name: string; location: string };
}

const SearchJobPage = ({ searchParams }: IProps) => {
  const { name, location } = searchParams;

  return (
    <div className="bg-[#f3f5f7]">
      <div className="bg-[#19734e] py-4">
        <HeaderSearchJobPage name={name} location={location} />
      </div>
      <Suspense fallback={<SearchJobResultSkeleton />}>
        <SearchJobResult name={name} location={location} />
      </Suspense>
    </div>
  );
};

export default SearchJobPage;
