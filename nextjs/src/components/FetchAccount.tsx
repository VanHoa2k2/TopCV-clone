"use client";

import { useAppDispatch } from "@/redux/hooks";
import { fetchAccount } from "@/redux/slice/accountSlide";
import { cookies } from "next/headers";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const FetchAccount = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Lấy access_token từ cookies sau khi trang đã được tải
    const cookieStore = cookies();
    const token = cookieStore.get("access_token");
    setAccessToken(token?.value || null);
  }, []);

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") return;
    if (accessToken) {
      // Kiểm tra accessToken
      dispatch(fetchAccount(accessToken)).catch((error) => {
        console.error("Error fetching account:", error); // Xử lý lỗi
      });
    }
  }, [dispatch, accessToken, pathname]);

  return <></>;
};

export default FetchAccount;
