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

  callFetchAllResumeForHR: (companyId: number) =>
    http.get<IBackendRes<IResume[]>>(`/api/v1/resumes/allForHR/${companyId}`),

  UploadCVByUser: (url: string) =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes/upload-cv`, url),

  callFetchResumeByUser: (access_token: string) =>
    http.post<IBackendRes<IResume[]>>(`/api/v1/resumes/by-user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),

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
