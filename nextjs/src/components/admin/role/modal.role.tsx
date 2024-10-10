import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import { IPermission, IRole } from "@/types/backend";
import { CheckSquareOutlined } from "@ant-design/icons";
import ModuleApi from "./module.api";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetSingleRole } from "@/redux/slice/roleSlide";
import roleApiRequest from "@/apiRequests/role";
import permissionApiRequest from "@/apiRequests/permission";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
}

const ModalRole = (props: IProps) => {
  const { openModal, setOpenModal, reloadTable } = props;
  const singleRole = useAppSelector((state) => state.role.singleRole);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [listPermissions, setListPermissions] = useState<
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null
  >(null);
  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissions: value as IPermission[] };
      })
      .value();
  };

  useEffect(() => {
    const init = async () => {
      const res = await permissionApiRequest.callFetchPermission(
        `current=1&pageSize=100`
      );
      if (res.data?.result) {
        setListPermissions(groupByPermission(res.data?.result));
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (listPermissions?.length && singleRole?.id) {
      const initialValues = {
        name: singleRole.name,
        isActive: singleRole.isActive,
        description: singleRole.description,
      } as any;
      const userPermissions = groupByPermission(singleRole.permissions);

      listPermissions.forEach((x) => {
        let allCheck = true;

        x.permissions?.forEach((y) => {
          const temp = userPermissions.find((z) => z.module === x.module);

          if (temp) {
            const isExist = temp.permissions.find((k) => k.id === y.id);
            if (isExist) {
              initialValues[`permissions.${y.id}`] = true;
            } else {
              allCheck = false;
            }
          } else {
            allCheck = false;
          }
        });

        initialValues[`permissions.${x.module}`] = allCheck;
      });
      form.setFieldsValue(initialValues);
    }
  }, [listPermissions, singleRole, form]);

  const submitRole = async (valuesForm: any) => {
    const { description, isActive, name } = valuesForm;
    const checkedPermissions: number[] = [];
    if (valuesForm) {
      Object.keys(valuesForm).map((item) => {
        if (valuesForm[item] === true && item.includes("permissions")) {
          const itemReplace = item.replace("permissions.", "");
          if (itemReplace) {
            const permissionId = parseInt(itemReplace); // convert string -> number
            if (permissionId) {
              checkedPermissions.push(permissionId);
            }
          }
        }
      });
    }
    if (singleRole?.id) {
      //update
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      const res = await roleApiRequest.callUpdateRole(role, singleRole.id);
      if (res.data) {
        message.success("Cập nhật role thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      const res = await roleApiRequest.callCreateRole(role);
      if (res.data) {
        message.success("Thêm mới role thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setOpenModal(false);
    dispatch(resetSingleRole({}));
  };

  return (
    <>
      <ModalForm
        title={<>{singleRole?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
        open={openModal}
        modalProps={{
          onCancel: () => {
            handleReset();
          },
          afterClose: () => handleReset(),
          destroyOnClose: true,
          width: isMobile ? "100%" : 900,
          keyboard: false,
          maskClosable: false,
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitRole}
        submitter={{
          render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
          submitButtonProps: {
            icon: (
              <CheckSquareOutlined
                type="button"
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              />
            ),
          },
          searchConfig: {
            resetText: "Hủy",
            submitText: <>{singleRole?.id ? "Cập nhật" : "Tạo mới"}</>,
          },
        }}
      >
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormText
              label="Tên Role"
              name="name"
              rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              placeholder="Nhập name"
            />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormSwitch
              label="Trạng thái"
              name="isActive"
              checkedChildren="ACTIVE"
              unCheckedChildren="INACTIVE"
              initialValue={true}
              fieldProps={{
                defaultChecked: true,
              }}
            />
          </Col>

          <Col span={24}>
            <ProFormTextArea
              label="Miêu tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              placeholder="Nhập miêu tả role"
              fieldProps={{
                autoSize: { minRows: 2 },
              }}
            />
          </Col>
          <Col span={24}>
            <ProCard
              title="Quyền hạn"
              subTitle="Các quyền hạn được phép cho vai trò này"
              headStyle={{ color: "#d81921" }}
              style={{ marginBottom: 20 }}
              headerBordered
              size="small"
              bordered
            >
              <ModuleApi form={form} listPermissions={listPermissions} />
            </ProCard>
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default ModalRole;
