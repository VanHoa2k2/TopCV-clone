import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;
  const headers = new Headers();
  if (force) {
    headers.append("Set-Cookie", `access_token=; Path=/; HttpOnly; Max-Age=0`);
    headers.append("Set-Cookie", `refresh_token=; Path=/; HttpOnly; Max-Age=0`);
    return Response.json(
      {
        message: "Buộc đăng xuất thành công",
      },
      {
        status: 200,
        headers,
      }
    );
  }
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  if (!access_token) {
    return Response.json(
      { message: "Không nhận được access token" },
      {
        status: 401,
      }
    );
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      access_token.value
    );
    headers.append("Set-Cookie", `access_token=; Path=/; HttpOnly; Max-Age=0`);
    headers.append("Set-Cookie", `refresh_token=; Path=/; HttpOnly; Max-Age=0`);
    return Response.json(result, {
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
