import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/admin", "/personal-info", "/manage-cv"];
const authPaths = ["/login", "/register"];
const authHrPaths = ["/login-for-hr"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access_token = request.cookies.get("access_token")?.value;
  // Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !access_token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // Đăng nhập rồi thì không cho vào login/register nữa
  if (authPaths.some((path) => pathname.startsWith(path)) && access_token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Hr đăng nhập rồi thì không cho vào login-for-hr nữa
  if (authHrPaths.some((path) => pathname.startsWith(path)) && access_token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  // return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/admin/:path*",
    "/personal-info",
    "/manage-cv",
  ],
};
