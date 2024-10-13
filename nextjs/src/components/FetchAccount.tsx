"use client";

import { useAppDispatch } from "@/redux/hooks";
import { fetchAccount } from "@/redux/slice/accountSlide";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const FetchAccount = ({ access_token }: { access_token: string }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") return;
    if (access_token) {
      // Kiểm tra access_token
      dispatch(fetchAccount(access_token)).catch((error) => {
        console.error("Error fetching account:", error); // Xử lý lỗi
      });
    }
  }, [dispatch, access_token, pathname]);

  return <></>;
};

export default FetchAccount;
