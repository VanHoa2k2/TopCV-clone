"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setRefreshTokenAction } from "@/app/redux/slice/accountSlide";
import { message } from "antd";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface IProps {
  children: React.ReactNode;
}

const LayoutApp = (props: IProps) => {
  const isRefreshToken = useAppSelector(
    (state) => state?.account?.isRefreshToken
  );
  const errorRefreshToken = useAppSelector(
    (state) => state?.account?.errorRefreshToken
  );
  const route = useRouter();
  const dispatch = useAppDispatch();
  //handle refresh token error
  useEffect(() => {
    if (isRefreshToken === true) {
      localStorage.removeItem("access_token");
      message.error(errorRefreshToken);
      dispatch(setRefreshTokenAction({ status: false, message: "" }));
      route.push("/login");
    }
  }, [isRefreshToken]);

  return <>{props.children}</>;
};

export default LayoutApp;
