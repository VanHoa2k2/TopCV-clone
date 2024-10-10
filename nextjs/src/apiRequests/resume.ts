import http from "@/lib/http";
import { IBackendRes, IModelPaginate, IResume } from "@/types/backend";

const resumeApiRequest = {
  callFetchResume: (query: string) =>
    http.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`),

  callCreateResume: (url: string | undefined, companyId: any, jobId: any) =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes`, {
      url,
      companyId,
      jobId,
    }),

  UploadCVByUser: (url: string) =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes/upload-cv`, url),

  callFetchResumeByUser: () =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes/by-user`, {}),

  callUpdateResumeStatus: (id: number, status: string) =>
    http.patch<IBackendRes<IResume>>(`/api/v1/resumes/${id}`, { status }),

  callDeleteResume: (id: number) =>
    http.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`),

  callFetchResumeSuggest: (query: string, jobId: number | undefined) =>
    http.post<IBackendRes<IModelPaginate<IResume>>>(
      `/api/v1/resumes/fetch-resumes-suggest?${query}`,
      { jobId }
    ),
  callConfirmInterview: (token: string) =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes/confirm-interview`, {
      token,
    }),
};

export default resumeApiRequest;
