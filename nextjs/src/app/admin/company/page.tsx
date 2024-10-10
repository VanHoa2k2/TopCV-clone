"use client";

import DataTable from "@/components/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCompany } from "@/redux/slice/companySlide";
import { ICompany } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, message, notification } from "antd";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import queryString from "query-string";
import Access from "@/components/share/access";
import ModalCompany from "@/components/admin/company/modal.company";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import companyApiRequest from "@/apiRequests/company";

const CompanyPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<ICompany | null>(null);

  const tableRef = useRef<ActionType>();

  const isFetching = useAppSelector((state) => state?.company?.isFetching);
  const meta = useAppSelector((state) => state?.company?.meta);
  const companies = useAppSelector((state) => state?.company?.result);
  const dispatch = useAppDispatch();

  const handleDeleteCompany = async (id: number | undefined) => {
    if (id) {
      const res = await companyApiRequest.callDeleteCompany(id);
      if (res && res.data) {
        message.success("Xóa Company thành công");
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

  const columns: ProColumns<ICompany>[] = [
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
      title: "Id",
      dataIndex: "id",
      render: (text, record, index, action) => {
        return <span>{record.id}</span>;
      },
      hideInSearch: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Field",
      dataIndex: "fields",
      render: (text, record, index, action) => {
        return <div>{record.fields[0].name}</div>;
      },
      sorter: true,
    },
    {
      title: "LinkWebsite",
      dataIndex: "linkWebsite",
      width: 160,
      render: (text, record, index, action) => {
        return (
          <a href={record.linkWebsite as any} target="_blank">
            {record.linkWebsite}
          </a>
        );
      },
    },
    {
      title: "EmployeeSize",
      dataIndex: "employeeSize",
      sorter: true,
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      width: 160,
      sorter: true,
      render: (text, record, index, action) => {
        return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
      hideInSearch: true,
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      width: 160,
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
          <Access permission={ALL_PERMISSIONS.COMPANIES.UPDATE} hideChildren>
            <EditOutlined
              style={{
                fontSize: "20px",
                color: "#ffa500",
              }}
              type="button"
              onClick={() => {
                setOpenModal(true);
                setDataInit(entity);
              }}
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          </Access>
          <Access permission={ALL_PERMISSIONS.COMPANIES.DELETE} hideChildren>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa company"}
              description={"Bạn có chắc chắn muốn xóa company này ?"}
              onConfirm={() => handleDeleteCompany(entity.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <span style={{ cursor: "pointer", margin: "0 10px" }}>
                <DeleteOutlined
                  style={{
                    fontSize: "20px",
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
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `${clone.name}`;
    if (clone.address) clone.address = `${clone.address}`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.address) {
      sortBy = sort.address === "ascend" ? "sort=address" : "sort=-address";
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
      <Access permission={ALL_PERMISSIONS.COMPANIES.GET_PAGINATE}>
        <DataTable<ICompany>
          actionRef={tableRef}
          headerTitle="Danh sách Công Ty"
          rowKey="id"
          loading={isFetching}
          columns={columns}
          dataSource={companies}
          request={async (params, sort, filter): Promise<any> => {
            const query = buildQuery(params, sort, filter);
            dispatch(fetchCompany({ query }));
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
              <Access
                permission={ALL_PERMISSIONS.COMPANIES.CREATE}
                hideChildren
              >
                <Button
                  icon={
                    <PlusOutlined
                      type="button"
                      onMouseEnter={() => {}}
                      onMouseLeave={() => {}}
                    />
                  }
                  type="primary"
                  onClick={() => setOpenModal(true)}
                >
                  Thêm mới
                </Button>
              </Access>
            );
          }}
        />
      </Access>
      <ModalCompany
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};

export default CompanyPage;
