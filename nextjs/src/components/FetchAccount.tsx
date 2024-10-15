"use client";

import { useAppDispatch } from "@/redux/hooks";
import { fetchAccount } from "@/redux/slice/accountSlide";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const FetchAccount = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);
  }, []);

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") return;
    if (accessToken) {
      dispatch(fetchAccount(accessToken)).catch((error) => {
        console.error("Error fetching account:", error); // Xử lý lỗi
      });
    }
  }, [dispatch, accessToken, pathname]);

  return <></>;
};

export default FetchAccount;
