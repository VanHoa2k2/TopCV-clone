"use client";
import {
  message,
  Modal,
  notification,
  Select,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd";
import "@/styles/reset.scss";
import "react-quill/dist/quill.snow.css";
import { useAppSelector } from "@/redux/hooks";
import resumeApiRequest from "@/apiRequests/resume";
import dayjs from "dayjs";
import notifyApiRequest from "@/apiRequests/notify";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { IJob, IResume } from "@/types/backend";
import { useState } from "react";

const { Option } = Select;

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IJob | null;
  setDataInit: (v: any) => void;
}

// Fetcher function for useSWR
const fetchResumes = async (url: string, jobId: number) => {
  const res = await resumeApiRequest.callFetchResumeSuggest(url, jobId);
  return res?.data;
};

const ModalSuggestCvFor = (props: IProps) => {
  const { openModal, setOpenModal, dataInit } = props;
  const user = useAppSelector((state) => state?.account?.user);
  const router = useRouter();

  // State để quản lý phân trang
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Reset pagination khi đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setPagination((prev) => ({
      ...prev,
      current: 1, // Reset current page về 1 khi modal đóng
    }));
  };

  // Use useSWR to fetch resumes data
  const { data, isLoading, error } = useSWR(
    dataInit?.id
      ? [
          `current=${pagination.current}&pageSize=${pagination.pageSize}`,
          dataInit?.id,
        ]
      : null,
    ([url, jobId]) => fetchResumes(url, jobId),
    {
      onSuccess: (data) => {
        setPagination((prev: any) => ({
          ...prev,
          total: data?.meta?.total || 0, // Set tổng số bản ghi từ API response
        }));
      },
    }
  );

  const handleChangeStatus = async (
    newStatus: string,
    resume: IResume | null | any
  ) => {
    let title = "";
    let description = "";
    switch (newStatus) {
      case "Chưa giải quyết":
        title = "Nhà tuyển dụng vừa xem CV ứng tuyển của bạn";
        description = `${user?.name}, ${resume?.company?.name} vừa xem CV ứng tuyển của bạn`;
        break;
      case "APPROVED":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${resume?.company?.name} vừa đánh giá CV của bạn là phù hợp`;
        break;
      case "REJECTED":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${resume?.company?.name} vừa đánh giá CV của bạn là chưa phù hợp`;
        break;
    }

    const res = await resumeApiRequest.callUpdateResumeStatus(
      resume?.id as number,
      newStatus
    );

    if (res.data) {
      message.success("Update Resume status thành công!");

      // Cập nhật dữ liệu cache trong SWR
      mutate(
        [
          `current=${pagination.current}&pageSize=${pagination.pageSize}`,
          dataInit?.id,
        ],
        (currentData: IResume[] | undefined) => {
          return currentData?.map((item) =>
            item.id === resume.id ? { ...item, status: newStatus } : item
          );
        },
        false
      );

      await notifyApiRequest.callCreateNotify({
        status: newStatus,
        title,
        description,
        isActive: true,
        jobId: resume?.job?.id,
        nameJob: resume?.job?.name,
        user: resume?.createdBy?.id,
      });

      router.refresh();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const columns: TableColumnsType<IResume> = [
    {
      title: "Hồ sơ ứng viên",
      dataIndex: "url",
      render: (url) => (
        <a
          href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${url}`}
          target="_blank"
        >
          {url}
        </a>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      width: 120,
      render: (status, record) => (
        <Select
          style={{ width: "100%" }}
          defaultValue={status}
          onChange={(newStatus) => handleChangeStatus(newStatus, record)}
        >
          <Option value="PENDING">PENDING</Option>
          <Option value="Chưa giải quyết">Chưa giải quyết</Option>
          <Option value="APPROVED">APPROVED</Option>
          <Option value="REJECTED">REJECTED</Option>
        </Select>
      ),
    },
    {
      title: "Job",
      dataIndex: ["job", "name"],
    },
    {
      title: "Company",
      dataIndex: ["company", "name"],
    },
    {
      title: "Ngày ứng tuyển",
      dataIndex: "createdAt",
      width: 200,
      sorter: true,
      render: (createdAt) => {
        return <>{dayjs(createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
  ];

  const onChange: TableProps<IResume>["onChange"] = (
    paginationConfig,
    filters,
    sorter,
    extra
  ) => {
    setPagination({
      ...pagination,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    });
  };

  return (
    <>
      {openModal && (
        <Modal
          title={
            <span>
              Các CV phù hợp với công việc{" "}
              <span className="text-primary">{dataInit?.name}</span>
            </span>
          }
          centered
          open={openModal}
          onCancel={handleCloseModal}
          width={1300}
          footer={<></>}
        >
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={data?.result}
            pagination={pagination}
            onChange={onChange}
            showSorterTooltip={{ target: "sorter-icon" }}
          />
        </Modal>
      )}
    </>
  );
};

export default ModalSuggestCvFor;
