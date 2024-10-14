import { cookies } from "next/headers";
import JobSuggestionList from "./JobSuggestionList";

const SuggestJobsByCV = () => {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  if (!access_token) {
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
