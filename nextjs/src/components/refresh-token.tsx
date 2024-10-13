"use client";

import authApiRequest from "@/apiRequests/auth";
import { useEffect } from "react";
import { differenceInMinutes } from "date-fns";
import { useAppSelector } from "@/redux/hooks";

export default function RefreshToken() {
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  useEffect(() => {
    if (isAuthenticated === true) {
      const interval = setInterval(async () => {
        const now = new Date();
        const accessTokenExpiresAt = localStorage.getItem(
          "accessTokenExpiresAt"
        );
        const expiresAt = accessTokenExpiresAt
          ? new Date(parseInt(accessTokenExpiresAt))
          : new Date();

        // kiểm tra access_token mỗi 5p một lần
        // khi access_token sắp hết hạn, còn dưới 10p thì sẽ được refresh token nhận được access và refresh token mới và set vào cookie
        // accessTokenExpires và access_token mới cũng được lưu vào local storage
        if (differenceInMinutes(expiresAt, now) < 10) {
          try {
            const res =
              await authApiRequest.slideTokenFromNextClientToNextServer();
            localStorage.setItem(
              "access_token",
              res?.data?.access_token as string
            );
            localStorage.setItem(
              "accessTokenExpiresAt",
              res?.data?.accessTokenExpires as string
            );
          } catch (error) {
            console.error("Error refreshing token:", error); // Xử lý lỗi
          }
        }
      }, 1000 * 60 * 5);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);
  return <></>;
}
