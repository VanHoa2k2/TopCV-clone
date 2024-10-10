import http from "@/lib/http";
import { IBackendRes, IModelPaginate, IPermission } from "@/types/backend";

const permissionApiRequest = {
  callFetchPermission: (query: string) =>
    http.get<IBackendRes<IModelPaginate<IPermission>>>(
      `/api/v1/permissions?${query}`
    ),

  callFetchPermissionById: (id: number) =>
    http.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`),

  callCreatePermission: (permission: IPermission) =>
    http.post<IBackendRes<IPermission>>(`/api/v1/permissions`, permission),

  callUpdatePermission: (permission: IPermission, id: number) =>
    http.patch<IBackendRes<IPermission>>(
      `/api/v1/permissions/${id}`,
      permission
    ),

  callDeletePermission: (id: number) =>
    http.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`),
};

export default permissionApiRequest;
