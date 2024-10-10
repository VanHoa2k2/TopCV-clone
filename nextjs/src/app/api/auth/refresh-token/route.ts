import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const refresh_token = cookieStore.get("refresh_token");
  if (!refresh_token) {
    return Response.json(
      { message: "Không nhận được refresh token" },
      {
        status: 401,
      }
    );
  }
  try {
    const res = await authApiRequest.slideTokenFromNextServerToServer(
      refresh_token.value
    );
    const newExpiresDate = new Date(
      res?.data?.accessTokenExpires as unknown as number
    ).toUTCString();
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `access_token=${res?.data?.access_token}; Path=/; HttpOnly; SameSite=Lax; Secure`
    );
    headers.append(
      "Set-Cookie",
      `refresh_token=${res?.data?.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Secure`
    );

    return Response.json(res, {
      status: 200,
      headers,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Lỗi không xác định",
        },
        {
          status: 500,
        }
      );
    }
  }
}
