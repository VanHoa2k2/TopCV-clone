import http from "@/lib/http";
import { IAllUser, IBackendRes, IModelPaginate, IUser } from "@/types/backend";

const userApiRequest = {
  callFetchUser: (query: string) =>
    http.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`),

  callFetchUserById: (id: number) =>
    http.get<IBackendRes<IUser>>(`/api/v1/users/${id}`),

  callFetchAllUser: () => http.get<IBackendRes<IUser[]>>(`/api/v1/users/all`),

  callCreateUser: (user: IUser) =>
    http.post<IBackendRes<IUser>>(`/api/v1/users`, user),

  callUpdateUser: (user: IUser) =>
    http.patch<IBackendRes<IUser>>(`/api/v1/users`, user),

  callDeleteUser: (id: number) =>
    http.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`),

  callUpdateCVByUser: (urlCV: string) =>
    http.patch<IBackendRes<IUser>>(`/api/v1/users/upload-cv`, { urlCV }),
};

export default userApiRequest;
