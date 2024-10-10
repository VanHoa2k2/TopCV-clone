import http from "@/lib/http";
import { IBackendRes, IGetAccount } from "@/types/backend";

const accountApiRequest = {
  callFetchAccount: (access_token: string) =>
    http.get<IBackendRes<IGetAccount>>("/api/v1/auth/account", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }),
};

export default accountApiRequest;
