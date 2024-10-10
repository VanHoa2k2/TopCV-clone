import http from "@/lib/http";
import { IBackendRes, IModelPaginate, IRole } from "@/types/backend";

const roleApiRequest = {
  callFetchRole: (query: string) =>
    http.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`),

  callFetchRoleById: (id: number) =>
    http.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`),

  callCreateRole: (role: IRole) =>
    http.post<IBackendRes<IRole>>(`/api/v1/roles`, role),

  callUpdateRole: (role: IRole, id: number) =>
    http.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, role),

  callDeleteRole: (id: number) =>
    http.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`),
};

export default roleApiRequest;
