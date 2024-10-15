import JobsList from "./JobsList";
import jobApiRequest from "@/apiRequests/job"; // Import jobApiRequest
import { IJob, IModelPaginate } from "@/types/backend"; // Import types

const BestJobs = async () => {
  // Chuyển đổi thành async function
  const { data } = await jobApiRequest.callFetchJob(`current=1&pageSize=12`); // Gọi API
  const jobsData: IModelPaginate<IJob> | null = data || null; // Lưu trữ dữ liệu

  return (
    <div className="bg-[#f3f5f7]">
      <div className="container py-6">
        <JobsList initialJobsData={jobsData} />
      </div>
    </div>
  );
};

export default BestJobs;
