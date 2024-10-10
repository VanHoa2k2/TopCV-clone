"use client";

import authApiRequest from "@/apiRequests/auth";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";

function LogoutLogic() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (access_token === localStorage.getItem("access_token")) {
      authApiRequest
        .logoutFromNextClientToNextServer(true, signal)
        .then((res) => {
          dispatch(setLogoutAction({}));
          router.push(`/login?redirectFrom=${pathname}`);
        });
    }
    return () => {
      controller.abort();
    };
  }, [access_token, router, pathname, dispatch]);
  return <div>Logout</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  );
}
