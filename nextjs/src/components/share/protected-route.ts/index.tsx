"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import Loading from "../loading";
import NotPermitted from "./not-permitted";
import { useEffect } from "react";

const RoleBaseRoute = (props: any) => {
  const user = useAppSelector((state) => state?.account?.user);
  const userRole = user?.role?.name;

  if (userRole !== "NORMAL_USER") {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};

const ProtectedRoute = (props: any) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(
    (state) => state?.account?.isAuthenticated
  );
  const isLoading = useAppSelector((state) => state?.account?.isLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <Loading />;
  }

  return <RoleBaseRoute>{props.children}</RoleBaseRoute>;
};

export default ProtectedRoute;
