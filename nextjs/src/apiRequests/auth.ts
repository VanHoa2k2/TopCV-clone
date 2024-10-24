import http from "@/lib/http";
import {
  LoginBodyType,
  RegisterBodyType,
  RegisterForHRBodyType,
} from "@/schemaValidations/auth.schema";
import {
  AccessTokenResponse,
  IAccount,
  IBackendRes,
  IRegisterForHR,
  IUser,
} from "@/types/backend";

const authApiRequest = {
  login: (username: string, password: string) =>
    http.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
      username,
      password,
    }),
  register: (body: RegisterBodyType) =>
    http.post<IBackendRes<IUser>>("/api/v1/auth/register", {
      ...body,
      role: {
        id: 2,
      },
    }),
  registerForHR: (body: IRegisterForHR) =>
    http.post<IBackendRes<IUser>>("/api/v1/auth/register", {
      ...body,
      role: {
        id: 3,
      },
    }),
  logoutFromNextServerToServer: (access_token: string) =>
    http.post<IBackendRes<string>>(
      "/api/v1/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    ),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<IBackendRes<string>>(
      "/api/auth/logout",
      {
        force,
      },
      {
        baseUrl: "",
        signal,
      }
    ),
  auth: (body: {
    accessToken: string;
    accessTokenExpires: string;
    refreshToken: string;
  }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  slideTokenFromNextServerToServer: (refreshToken: string) =>
    http.post<IBackendRes<AccessTokenResponse>>("/api/v1/auth/refresh", {
      refreshToken,
    }),
  slideTokenFromNextClientToNextServer: () =>
    http.post<IBackendRes<IAccount>>(
      "/api/auth/refresh-token",
      {},
      { baseUrl: "" }
    ),
};

export default authApiRequest;
