"use client";

import DataTable from "@/components/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResume } from "@/types/backend";
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
  message,
  notification,
} from "antd";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import { fetchResume } from "@/redux/slice/resumeSlide";
import ViewDetailResume from "@/components/admin/resume/view.resume";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import Access from "@/components/share/access";
import resumeApiRequest from "@/apiRequests/resume";

const ResumePage = () => {
  const tableRef = useRef<ActionType>();

  const isFetching = useAppSelector((state) => state.resume.isFetching);
  const meta = useAppSelector((state) => state.resume.meta);
  const resumes = useAppSelector((state) => state.resume.result);
  const dispatch = useAppDispatch();
  const [dataInit, setDataInit] = useState<IResume | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const user = useAppSelector((state) => state?.account?.user);
  const handleDeleteResume = async (id: number | undefined) => {
    if (id) {
      const res = await resumeApiRequest.callDeleteResume(id);
      if (res && res.data) {
        message.success("Xóa Resume thành công");
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

  const columns: ProColumns<IResume>[] = [
    {
      title: "Id",
      dataIndex: "id",
      width: 40,
      render: (text, record, index, action) => {
        return (
          <a
            href="#"
            onClick={() => {
              setOpenViewDetail(true);
              setDataInit(record);
            }}
          >
            {record.id}
          </a>
        );
      },
      hideInSearch: true,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      sorter: true,
      renderFormItem: (item, props, form) => (
        <ProFormSelect
          showSearch
          mode="multiple"
          allowClear
          valueEnum={{
            PENDING: "PENDING",
            REVIEWING: "REVIEWING",
            APPROVED: "APPROVED",
            REJECTED: "REJECTED",
          }}
          placeholder="Chọn level"
        />
      ),
    },

    {
      title: "Job",
      dataIndex: ["job", "name"],
      hideInSearch: true,
    },
    {
      title: "Company",
      dataIndex: ["company", "name"],
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
    // {

    //     title: 'Actions',
    //     hideInSearch: true,
    //     width: 50,
    //     render: (_value, entity, _index, _action) => (
    //         <Space>
    //             <EditOutlined
    //                 style={{
    //                     fontSize: 20,
    //                     color: '#ffa500',
    //                 }}
    //                                   type="button"
    // onMouseEnter={() => {}}
    // onMouseLeave={() => {}}
    //                 onClick={() => {
    //                     navigate(`/admin/job/upsert?id=${entity.id}`)
    //                 }}
    //             />

    //             <Popconfirm
    //                 placement="leftTop"
    //                 title={"Xác nhận xóa resume"}
    //                 description={"Bạn có chắc chắn muốn xóa resume này ?"}
    //                 onConfirm={() => handleDeleteResume(entity.id)}
    //                 okText="Xác nhận"
    //                 cancelText="Hủy"
    //             >
    //                 <span style={{ cursor: "pointer", margin: "0 10px" }}>
    //                     <DeleteOutlined
    //                         style={{
    //                             fontSize: 20,
    //                             color: '#ff4d4f',
    //                         }}
    // type="button"
    // onMouseEnter={() => {}}
    // onMouseLeave={() => {}}
    //                     />
    //                 </span>
    //             </Popconfirm>
    //         </Space>
    //     ),

    // },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (user?.company?.name) clone.company = `${user?.company?.name}`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.status) {
      sortBy = sort.status === "ascend" ? "sort=status" : "sort=-status";
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

    temp +=
      "&populate=company,job&fields=company.id, company.name, company.logo, job.id, job.name";
    return temp;
  };

  return (
    <div>
      <Access permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}>
        <DataTable<IResume>
          actionRef={tableRef}
          headerTitle="Danh sách Resumes"
          rowKey="id"
          loading={isFetching}
          columns={columns}
          dataSource={resumes}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter);
            dispatch(fetchResume({ query }));
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
            return <></>;
          }}
        />
      </Access>
      <ViewDetailResume
        user={user}
        open={openViewDetail}
        onClose={setOpenViewDetail}
        dataInit={dataInit}
        setDataInit={setDataInit}
        reloadTable={reloadTable}
      />
    </div>
  );
};

export default ResumePage;
