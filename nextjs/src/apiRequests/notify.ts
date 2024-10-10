import http from "@/lib/http";
import { IBackendRes, IResume } from "@/types/backend";

const notifyApiRequest = {
  callCreateNotify: (data: {
    status?: string;
    title?: string;
    description?: string;
    isActive?: boolean;
    jobId?: number;
    nameJob?: string;
    user?: number;
  }) => http.post<IBackendRes<IResume>>(`/api/v1/notifies`, data),

  callUpdateNotify: (id: number, isActive?: boolean) =>
    http.patch<IBackendRes<IResume>>(`/api/v1/notifies/${id}`, { isActive }),
};

export default notifyApiRequest;
