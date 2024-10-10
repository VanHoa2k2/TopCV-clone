"use client";

import DataTable from "@/components/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ActionType,
  ProColumns,
  ProFormSelect,
} from "@ant-design/pro-components";
import {
  Button,
  Popconfirm,
  Select,
  Space,
  Tag,
  Tooltip,
  message,
  notification,
} from "antd";
import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import { useRouter } from "next/navigation";
import { fetchJob } from "@/redux/slice/jobSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import jobApiRequest from "@/apiRequests/job";
import ModalSuggestCvFor from "@/components/admin/job/modal.suggestCvForJob";

const JobPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IJob | null>(null);
  const user = useAppSelector((state) => state?.account?.user);
  const tableRef = useRef<ActionType>();

  const isFetching = useAppSelector((state) => state.job.isFetching);
  const meta = useAppSelector((state) => state.job.meta);
  const jobs = useAppSelector((state) => state.job.result);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   const testChatbot = async () => {
  //     const response = await fetch(
  //       "http://localhost:5005/webhooks/rest/webhook",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ message: "Hello", sender: "user" }),
  //       }
  //     );
  //     const data = await response.json();
  //     console.log(data);
  //   };

  //   testChatbot();
  // }, []);

  const handleDeleteJob = async (id: number | undefined) => {
    if (id) {
      const res = await jobApiRequest.callDeleteJob(id);
      if (res && res.data) {
        message.success("Xóa Job thành công");
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const columns: ProColumns<IJob>[] = [
    {
      title: "STT",
      key: "index",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Tên Job",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      sorter: true,
    },
    {
      title: "Level",
      dataIndex: "level",
      renderFormItem: (item, props, form) => (
        <ProFormSelect
          showSearch
          mode="multiple"
          allowClear
          valueEnum={{
            INTERN: "INTERN",
            FRESHER: "FRESHER",
            JUNIOR: "JUNIOR",
            MIDDLE: "MIDDLE",
            SENIOR: "SENIOR",
          }}
          placeholder="Chọn level"
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tag color={entity.isActive ? "lime" : "red"}>
              {entity.isActive ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </>
        );
      },
      hideInSearch: true,
    },

    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
      hideInSearch: true,
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      width: 200,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
      hideInSearch: true,
    },
    {
      title: "Actions",
      hideInSearch: true,
      width: 50,
      render: (_value, entity, _index, _action) => (
        <Space>
          <Access permission={ALL_PERMISSIONS.JOBS.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: 20,
                color: "#ffa500",
              }}
              type="button"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
              onClick={() => {
                router.push(`job/upsert?id=${entity.id}`);
              }}
            />
          </Access>
          <Access permission={ALL_PERMISSIONS.JOBS.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa job"}
              description={"Bạn có chắc chắn muốn xóa job này ?"}
              onConfirm={() => handleDeleteJob(entity.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 10px" }}>
                <DeleteOutlined
                  style={{
                    fontSize: 20,
                    color: "#ff4d4f",
                  }}
                  type="button"
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                />
              </span>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
    {
      title: "CV phù hợp",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tooltip
              placement="top"
              title={<span>Xem các CV phù hợp với công việc</span>}
            >
              <Button
                type="text"
                onClick={() => {
                  router.push(
                    `job/view-resumes-suggestion?id=${entity.id}&name=${entity.name}`
                  );
                }}
              >
                <span className="text-[#5072d1] font-semibold">Xem</span>
              </Button>
            </Tooltip>
          </>
        );
      },
      hideInSearch: true,
    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `${clone.name}`;
    if (clone.salary) clone.salary = `${clone.salary}`;
    if (clone?.level?.length) {
      clone.level = clone.level.join(",");
    }
    if (user?.company?.id) clone.company = `${user?.company?.id}`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.salary) {
      sortBy = sort.salary === "ascend" ? "sort=salary" : "sort=-salary";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    //mặc định sort theo updatedAt
    if (Object.keys(sortBy).length === 0) {
      temp = `${temp}&sort=-updatedAt`;
    } else {
      temp = `${temp}&${sortBy}`;
    }

    return temp;
  };

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}>
        <DataTable<IJob>
          actionRef={tableRef}
          headerTitle="Danh sách Jobs"
          rowKey="id"
          loading={isFetching}
          columns={columns}
          dataSource={jobs}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter);
            dispatch(fetchJob({ query }));
          }}
          scroll={{ x: true }}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            showSizeChanger: true,
            total: meta.total,
            showTotal: (total, range) => {
              return (
                <div>
                  {" "}
                  {range[0]}-{range[1]} trên {total} rows
                </div>
              );
            },
          }}
          rowSelection={false}
          toolBarRender={(_action, _rows): any => {
            return (
              <Button
                icon={
                  <PlusOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                }
                type="primary"
                onClick={() => router.push("job/upsert")}
              >
                Thêm mới
              </Button>
            );
          }}
        />
      </Access>

      <ModalSuggestCvFor
        openModal={openModal}
        setOpenModal={setOpenModal}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};

export default JobPage;
