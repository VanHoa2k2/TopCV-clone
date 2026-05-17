import http, { CustomOptions } from "@/lib/http";
import {
  IAllCompany,
  IBackendRes,
  ICompany,
  IModelPaginate,
} from "@/types/backend";

const companyApiRequest = {
  callFetchCompany: (query: string, options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<IModelPaginate<ICompany>>>(
      `/api/v1/companies?${query}`,
      options
    ),

  callFetchAllCompany: (options?: Omit<CustomOptions, "body">) =>
    http.get<IBackendRes<ICompany[]>>(`/api/v1/companies/all`, options),

  callFetchCompanyById: (id: string) =>
    http.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`),

  callCreateCompany: (
    name: string,
    fields: string[],
    address: string,
    linkWebsite: string | null,
    employeeSize: string,
    description: string,
    logo: string,
    coverImage: string | null
  ) =>
    http.post<IBackendRes<ICompany>>(`/api/v1/companies`, {
      name,
      fields,
      address,
      linkWebsite,
      employeeSize,
      description,
      logo,
      coverImage,
    }),

  callUpdateCompany: (
    id: number,
    name: string,
    fields: string[],
    address: string,
    linkWebsite: string | null,
    employeeSize: string,
    description: string,
    logo: string,
    coverImage: string | null
  ) =>
    http.patch<IBackendRes<ICompany>>(`/api/v1/companies/${id}`, {
      id,
      name,
      fields,
      address,
      linkWebsite,
      employeeSize,
      description,
      logo,
      coverImage,
    }),

  callDeleteCompany: (id: number) =>
    http.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`),
};

export default companyApiRequest;
