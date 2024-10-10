import http from "@/lib/http";
import { IBackendRes, ICompany, IModelPaginate } from "@/types/backend";

const fileUploadApiRequest = {
  callUploadSingleFile: (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append("fileUpload", file);

    return http.post<IBackendRes<{ fileName: string }>>(
      `/api/v1/files/upload`,
      bodyFormData,
      {
        headers: {
          folder_type: folderType,
        },
      }
    );
  },
};

export default fileUploadApiRequest;
