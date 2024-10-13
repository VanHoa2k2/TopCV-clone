import resumeApiRequest from "@/apiRequests/resume";
import React from "react";
import { FaCircleCheck } from "react-icons/fa6";

interface IProps {
  searchParams: { token: string; nameJob: string };
}

// Nhận searchParams từ context của Server Component
const verifyInterview = async ({ searchParams }: IProps) => {
  const token = searchParams.token;
  const nameJob = searchParams.nameJob;

  const res = await resumeApiRequest.callConfirmInterview(token);

  return (
    <div className="container mx-auto py-8">
      {res.statusCode === 400 ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-lg">
          {res.message}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-6 max-w-md mx-auto flex items-center space-x-4">
          <FaCircleCheck className="text-green-500 text-3xl" />
          <div className="text-lg font-semibold text-gray-700">
            Xác nhận phỏng vấn thành công công việc {nameJob}!
          </div>
        </div>
      )}
    </div>
  );
};

export default verifyInterview;
