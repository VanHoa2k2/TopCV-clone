import http, { CustomOptions } from "@/lib/http";
import {
  IBackendRes,
  IModelPaginate,
  IJob,
  IParamsOccupation,
  IAllJob,
} from "@/types/backend";

const jobApiRequest = {
  callFetchJob: (query: string, options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`, options),

  callFetchAllJob: () => http.get<IBackendRes<IJob[]>>(`/api/v1/jobs/all`),

  callFetchAllJobForHR: (companyId: number) =>
    http.get<IBackendRes<IJob[]>>(`/api/v1/jobs/allForHR/${companyId}`),

  callFetchJobById: (id: string, options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`, {
      cache: "no-store",
      ...options,
    }),

  callFetchParamsOccupation: (options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<IParamsOccupation>>(
      `/api/v1/jobs/get-param-occupation`,
      options
    ),

  callFetchTotalJobs: (options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<number>>(`/api/v1/jobs/get-total-jobs`, options),

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
