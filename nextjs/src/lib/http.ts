import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { IAccount, IBackendRes } from "@/types/backend";
import { redirect } from "next/navigation";
import { Mutex } from "async-mutex";

interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
}

let isRefreshing = false; // Cờ để theo dõi trạng thái làm mới token
let refreshTokenPromise: Promise<AccessTokenResponse | null> | null = null; // Biến lưu trữ promise của lần gọi

// const handleRefreshToken = async () => {
//   // Kiểm tra nếu token đang được làm mới
//   if (isRefreshing) {
//     // Nếu có, chờ cho đến khi quá trình làm mới hiện tại hoàn thành
//     return refreshTokenPromise;
//   }

//   isRefreshing = true; // Bật cờ
//   refreshTokenPromise = mutex.runExclusive(async () => {
//     const res = await fetch(
//       `${envConfig.NEXT_PUBLIC_URL_BACKEND}/api/v1/auth/refresh`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       }
//     );
//     const resRefreshToken =
//       (await res.json()) as IBackendRes<AccessTokenResponse>;
//     isRefreshing = false; // Tắt cờ khi quá trình làm mới hoàn thành
//     console.log(resRefreshToken);
//     if (resRefreshToken && resRefreshToken.data) {
//       return {
//         access_token: resRefreshToken.data.access_token,
//         refresh_token: resRefreshToken.data.refresh_token,
//       };
//     } else {
//       return null;
//     }
//   });

//   return refreshTokenPromise;
// };

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

let clientLogoutRequest: null | Promise<any> = null;

export const isClient = () => typeof window !== "undefined";
const mutex = new Mutex();
const request = async <Response>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient()) {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      baseHeaders.Authorization = `Bearer ${access_token}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_URL_BACKEND
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_URL_BACKEND
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const payload: Response = await res.json();
  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    // if (res.status === AUTHENTICATION_ERROR_STATUS) {
    //   const token = await handleRefreshToken();
    //   if (token) {
    //     baseHeaders.Authorization = `Bearer ${token?.access_token}`;
    //     localStorage.setItem("access_token", token?.access_token);
    //     const resAuth = await fetch("/api/auth", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         accessToken: token?.access_token,
    //         refreshToken: token?.refresh_token,
    //       }),
    //       headers: {
    //         ...baseHeaders,
    //       } as any,
    //     });
    //   }
    // }
    if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient()) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("accessTokenExpiresAt");
            clientLogoutRequest = null;
            location.href = "/login";
          }
        }
      } else {
        const access_token = (options?.headers as any)?.Authorization.split(
          "Bearer "
        )[1];
        redirect(`/logout?access_token=${access_token}`);
      }
    }
    //  else {
    //   throw new HttpError(payload);
    // }
  }
  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient()) {
    if (
      ["/api/v1/auth/login", "/api/v1/auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      const { access_token, accessTokenExpires } = payload as IAccount;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("accessTokenExpiresAt", accessTokenExpires);
    } else if ("/api/v1/auth/logout" === normalizePath(url)) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("accessTokenExpiresAt");
    }
  }
  return payload;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PATCH", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
