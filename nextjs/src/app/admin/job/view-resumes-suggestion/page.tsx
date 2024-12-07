"use client";
import {
  Breadcrumb,
  Button,
  message,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
  Tooltip,
} from "antd";
import "@/styles/reset.scss";
import "react-quill/dist/quill.snow.css";
import { useAppSelector } from "@/redux/hooks";
import resumeApiRequest from "@/apiRequests/resume";
import dayjs from "dayjs";
import notifyApiRequest from "@/apiRequests/notify";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import { IJob, IResume } from "@/types/backend";
import { useRef, useState } from "react";
import Link from "next/link";
import styles from "@/styles/admin.module.scss";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import { DeleteOutlined, EditOutlined, MailOutlined } from "@ant-design/icons";
import ModalSendMail from "@/components/admin/resume/modal.send-mail";
import { ActionType } from "@ant-design/pro-components";
import ModalSendManyMail from "@/components/admin/resume/modal.sendManyMail";

const { Option } = Select;

// Fetcher function for useSWR
const fetchResumes = async (url: string, jobId: number) => {
  const res = await resumeApiRequest.callFetchResumeSuggest(url, jobId);
  return res?.data;
};

const ViewResumesSuggestion = (props: any) => {
  let params = useSearchParams();

  const [openModalModalSendManyMail, setOpenModalSendManyMail] =
    useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IResume | null>(null);
  const [listDataInit, setListDataInit] = useState<IResume[]>([]);
  const [selectedResumes, setSelectedResumes] = useState<IResume[]>([]); // Thêm trạng thái để quản lý ứng viên đã chọn

  const id = params?.get("id"); // job id
  const name = params?.get("name"); // job id

  const user = useAppSelector((state) => state?.account?.user);
  const router = useRouter();

  // State để quản lý phân trang
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Use useSWR to fetch resumes data
  const { data, isLoading, error } = useSWR(
    id
      ? [`current=${pagination.current}&pageSize=${pagination.pageSize}`, id]
      : null,
    ([url, jobId]) => fetchResumes(url, jobId as unknown as number),
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
      case "Đang xem xét":
        title = "Nhà tuyển dụng vừa xem CV ứng tuyển của bạn";
        description = `${user?.name}, ${resume?.company?.name} vừa xem CV ứng tuyển của bạn`;
        break;
      case "Phù hợp":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${resume?.company?.name} vừa đánh giá CV của bạn là phù hợp`;
        break;
      case "Chưa phù hợp":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${resume?.company?.name} vừa đánh giá CV của bạn là chưa phù hợp`;
        break;
      case "Trúng tuyển":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${resume?.company?.name} thông báo bạn đã trúng tuyển việc làm ${resume?.job?.name}`;
        break;
      case "Chưa trúng tuyển":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${resume?.company?.name} thông báo bạn chưa trúng tuyển việc làm ${resume?.job?.name}`;
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
        [`current=${pagination.current}&pageSize=${pagination.pageSize}`, id],
        (currentData: IResume[] | undefined) => {
          // Nếu currentData không phải là một mảng, trả về chính currentData mà không thay đổi
          if (!Array.isArray(currentData)) {
            console.warn("currentData is not an array:", currentData);
            return currentData;
          }

          // Nếu currentData là mảng, thực hiện map như bình thường
          return currentData.map((item) =>
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

  const statusOptions = [
    { label: "Chưa giải quyết", value: "Chưa giải quyết" },
    { label: "Đang xem xét", value: "Đang xem xét" },
    { label: "Phù hợp", value: "Phù hợp" },
    { label: "Chưa phù hợp", value: "Chưa phù hợp" },
    { label: "Liên hệ", value: "Liên hệ" },
    { label: "Đã xác nhận", value: "Đã xác nhận" },
    { label: "Đã phỏng vấn", value: "Đã phỏng vấn" },
    { label: "Trúng tuyển", value: "Trúng tuyển" },
    { label: "Chưa trúng tuyển", value: "Chưa trúng tuyển" },
  ];

  const handleDeleteResume = async (id: number | undefined) => {
    if (id) {
      const res = await resumeApiRequest.callDeleteResume(id);
      if (res && res.data) {
        message.success("Xóa Resume thành công");
        router.refresh();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleSelectResume = (resume: IResume) => {
    setSelectedResumes((prev) => {
      if (prev.includes(resume)) {
        return prev.filter((r) => r.id !== resume.id); // Bỏ chọn nếu đã chọn
      }
      return [...prev, resume]; // Thêm vào danh sách đã chọn
    });
  };

  const handleSendEmailToSelected = () => {
    // Logic để gửi email cho tất cả các ứng viên đã chọn
    setOpenModalSendManyMail(true);
    setListDataInit(selectedResumes); // Set the selected resumes to be sent
  };

  const columns: TableColumnsType<IResume> = [
    {
      title: "STT",
      dataIndex: "index",
      width: 10,
      render: (value, record, index) => {
        return (
          ((pagination.current as number) - 1) *
            (pagination.pageSize as number) +
          index +
          1
        );
      },
    },
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
      title: "Trạng thái tuyển dụng",
      dataIndex: "status",
      width: 120,
      render: (status, record) => (
        <Select
          style={{ width: "100%" }}
          defaultValue={status}
          onChange={(newStatus) => handleChangeStatus(newStatus, record)}
        >
          {statusOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Company",
      dataIndex: ["company", "name"],
    },
    {
      title: "Thời gian ứng tuyển",
      dataIndex: "createdAt",
      width: 200,
      render: (createdAt) => {
        return <>{dayjs(createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "Chọn",
      render: (record) => (
        <input
          type="checkbox"
          checked={selectedResumes.includes(record)}
          onChange={() => handleSelectResume(record)}
        />
      ),
    },
    {
      title: "Actions",
      render: (record) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.RESUMES.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa resume"}
              description={"Bạn có chắc chắn muốn xóa resume này ?"}
              onConfirm={() => handleDeleteResume(record.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 10px" }}>
                <DeleteOutlined
                  style={{
                    fontSize: 18,
                    color: "#ff4d4f",
                  }}
                  type="button"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                />
              </span>
            </Popconfirm>
          </Access>
          <Access permission={ALL_PERMISSIONS.RESUMES.UPDATE} hideChildren>
            <Button
              style={{
                fontSize: 16,
                color: "green",
              }}
              type="text"
              icon={<MailOutlined />}
              onClick={() => {
                setOpenModal(true);
                setDataInit(record);
              }}
            >
              Gửi email
            </Button>
          </Access>
        </Space>
      ),
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
    <div className={styles["upsert-job-container"]}>
      <div className={styles["title"]}>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link href="/admin/job">Manage Job</Link>,
            },
            {
              title: "View Resumes Suggestion",
            },
          ]}
        />
      </div>
      <div>
        <h3 className="text-base font-semibold mb-4">
          Danh sách CV phù hợp với công việc{" "}
          <span className="text-primary">{name}</span>
        </h3>

        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data?.result}
          pagination={pagination}
          onChange={onChange}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
      </div>

      <Tooltip
        placement="top"
        title={<span>Chọn các ứng viên để gửi mail</span>}
      >
        <Button
          type="primary"
          onClick={handleSendEmailToSelected}
          disabled={selectedResumes.length === 0} // Vô hiệu hóa nếu không có ứng viên nào được chọn
        >
          Gửi email cho các ứng viên đã chọn
        </Button>
      </Tooltip>

      <ModalSendMail
        openModal={openModal}
        setOpenModal={setOpenModal}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />

      <ModalSendManyMail
        openModal={openModalModalSendManyMail}
        setOpenModal={setOpenModalSendManyMail}
        selectedResumes={listDataInit}
        resetSelectedResumes={() => setSelectedResumes([])} // Reset selected resumes
      />
    </div>
  );
};

export default ViewResumesSuggestion;
