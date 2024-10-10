import http from "@/lib/http";
import {
  IBackendRes,
  IModelPaginate,
  IJob,
  IParamsOccupation,
} from "@/types/backend";

const jobApiRequest = {
  callFetchJob: (query: string) =>
    http.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`),

  callFetchJobById: (id: string) =>
    http.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`, {
      cache: "no-store",
    }),

  callFetchParamsOccupation: () =>
    http.get<IBackendRes<IParamsOccupation>>(
      `/api/v1/jobs/get-param-occupation`
    ),

  callFetchTotalJobs: () =>
    http.get<IBackendRes<number>>(`/api/v1/jobs/get-total-jobs`),

  callCreateJob: (job: IJob) =>
    http.post<IBackendRes<IJob>>(`/api/v1/jobs`, job),

  callUpdateJob: (job: IJob, id: number) =>
    http.patch<IBackendRes<IJob>>(`/api/v1/jobs/${id}`, job),

  callDeleteJob: (id: number) =>
    http.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`),

  callGetJobsSuggestByCv: (query: string, fileName: string | undefined) =>
    http.post<IBackendRes<IModelPaginate<IJob>>>(
      `/api/v1/jobs/jobs-suggest?${query}`,
      {
        fileName,
      }
    ),
};

export default jobApiRequest;
