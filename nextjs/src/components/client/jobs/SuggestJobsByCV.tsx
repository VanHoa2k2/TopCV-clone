"use client";
import { useAppSelector } from "@/redux/hooks";
import JobSuggestionList from "./JobSuggestionList";

const SuggestJobsByCV = () => {
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <div className="bg-[#f3f5f7] ">
      <div className="container py-6">
        <JobSuggestionList />
      </div>
    </div>
  );
};

export default SuggestJobsByCV;
