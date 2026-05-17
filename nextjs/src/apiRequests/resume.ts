import http, { CustomOptions } from "@/lib/http";
import { IBackendRes, IModelPaginate, IResume } from "@/types/backend";

const resumeApiRequest = {
  callFetchResume: (query: string, options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`, options),

  callCreateResume: (url: string | undefined, companyId: any, jobId: any, options?: Omit<CustomOptions, "body">) =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes`, {
      url,
      companyId,
      jobId,
    }, options),

  callFetchAllResumeForHR: (companyId: number, options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<IResume[]>>(`/api/v1/resumes/allForHR/${companyId}`, options),

  UploadCVByUser: (url: string, options?: Omit<CustomOptions, "body">) =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes/upload-cv`, url, options),

  callFetchResumeByUser: (access_token: string, options?: Omit<CustomOptions, "body">) =>
    http.post<IBackendRes<IResume[]>>(`/api/v1/resumes/by-user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }, options),

  callUpdateResumeStatus: (id: number, status: string, options?: Omit<CustomOptions, "body">) =>
    http.patch<IBackendRes<IResume>>(`/api/v1/resumes/${id}`, { status }, options),

  callDeleteResume: (id: number, options?: Omit<CustomOptions, "body">) =>
    http.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`, options),

  callFetchResumeSuggest: (query: string, jobId: number | undefined, options?: Omit<CustomOptions, "body">) =>
    http.post<IBackendRes<IModelPaginate<IResume>>>(
      `/api/v1/resumes/fetch-resumes-suggest?${query}`,
      { jobId },
      options
    ),
  callConfirmInterview: (token: string, options?: Omit<CustomOptions, "body">) =>
    http.post<IBackendRes<IResume>>(`/api/v1/resumes/confirm-interview`, {
      token,
    }, options),
};

export default resumeApiRequest;
