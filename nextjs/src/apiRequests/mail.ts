import http from "@/lib/http";
import { IBackendRes, IMail } from "@/types/backend";

const mailApiRequest = {
  callSendMailConfirm: (mail: IMail) =>
    http.post<IBackendRes<IMail>>(`/api/v1/mail`, mail),
};

export default mailApiRequest;
