"use client";

import { useAppDispatch } from "@/redux/hooks";
import { fetchAccount } from "@/redux/slice/accountSlide";
// import { cookies } from "next/headers";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const FetchAccount = (props: { access_token: string | undefined }) => {
  const { access_token } = props;
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pathname === "/login" || pathname === "/register") return;
    if (access_token) {
      dispatch(fetchAccount(access_token)).catch((error) => {
        console.error("Error fetching account:", error); // Xử lý lỗi
      });
    }
  }, [dispatch, access_token, pathname]);

  return <></>;
};

export default FetchAccount;
