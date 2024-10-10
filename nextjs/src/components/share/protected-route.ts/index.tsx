"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import Loading from "../loading";
import NotPermitted from "./not-permitted";

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
  return (
    <>
      {isLoading === true ? (
        <Loading />
      ) : (
        <>
          {isAuthenticated === true ? (
            <>
              <RoleBaseRoute>{props.children}</RoleBaseRoute>
            </>
          ) : (
            router.push("/login")
          )}
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
