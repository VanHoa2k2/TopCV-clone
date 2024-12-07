import notifyApiRequest from "@/apiRequests/notify";
import resumeApiRequest from "@/apiRequests/resume";
import userApiRequest from "@/apiRequests/user";
import { IResume, IUser } from "@/types/backend";
import {
  Badge,
  Button,
  Descriptions,
  Drawer,
  Form,
  Select,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
const { Option } = Select;

interface IProps {
  user: IUser | null | any;
  onClose: (v: boolean) => void;
  open: boolean;
  dataInit: IResume | null | any;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

const ViewDetailResume = (props: IProps) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [userResume, setUserResume] = useState<IUser>();
  const { user, onClose, open, dataInit, setDataInit, reloadTable } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    const gethUserById = async () => {
      const res = await userApiRequest.callFetchUserById(dataInit?.userId);
      // console.log(res);
      setUserResume(res?.data);
    };
    gethUserById();
  }, [dataInit?.userId]);

  const handleChangeStatus = async () => {
    setIsSubmit(true);

    const status = form.getFieldValue("status");
    let title = "";
    let description = "";
    switch (status) {
      case "REVIEWING":
        title = "Nhà tuyển dụng vừa xem CV ứng tuyển của bạn";
        description = `${user?.name}, ${dataInit?.company?.name} vừa xem CV ứng tuyển của bạn`;
        break;
      case "APPROVED":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${dataInit?.company?.name} vừa đánh giá CV của bạn là phù hợp`;
        break;
      case "REJECTED":
        title = "NTD vừa đánh giá CV của bạn";
        description = `${user?.name}, ${dataInit?.company?.name} vừa đánh giá CV của bạn là chưa phù hợp`;
        break;
    }
    const res = await resumeApiRequest.callUpdateResumeStatus(
      dataInit?.id,
      status
    );
    if (res.data) {
      message.success("Update Resume status thành công!");
      await notifyApiRequest.callCreateNotify({
        status,
        title,
        description,
        isActive: true,
        jobId: dataInit?.job?.id,
        nameJob: dataInit?.job?.name,
        user: dataInit?.createdBy?.id,
      });
      setDataInit(null);
      onClose(false);
      reloadTable();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }

    setIsSubmit(false);
  };

  useEffect(() => {
    if (dataInit) {
      form.setFieldValue("status", dataInit.status);
    }
    return () => form.resetFields();
  }, [dataInit]);

  return (
    <>
      <Drawer
        title="Thông Tin Resume"
        placement="right"
        onClose={() => {
          onClose(false);
          setDataInit(null);
        }}
        open={open}
        width={"40vw"}
        maskClosable={false}
        destroyOnClose
        extra={
          <Button
            loading={isSubmit}
            type="primary"
            onClick={handleChangeStatus}
          >
            Change Status
          </Button>
        }
      >
        <Descriptions title="" bordered column={2} layout="vertical">
          <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Form form={form}>
              <Form.Item name={"status"}>
                <Select
                  // placeholder="Select a option and change input text above"
                  // onChange={onGenderChange}
                  // allowClear
                  style={{ width: "100%" }}
                  defaultValue={dataInit?.status}
                >
                  <Option value="Chưa giải quết">Chưa giải quết</Option>
                  <Option value="Đang xém xét">Đang xém xét</Option>
                  <Option value="APPROVED">APPROVED</Option>
                  <Option value="REJECTED">REJECTED</Option>
                </Select>
              </Form.Item>
            </Form>
          </Descriptions.Item>
          <Descriptions.Item label="Tên Job">
            {dataInit?.job?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Tên Công Ty">
            {dataInit?.company?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dataInit && dataInit.createdAt
              ? dayjs(dataInit.createdAt).format("DD-MM-YYYY HH:mm:ss")
              : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sửa">
            {dataInit && dataInit.updatedAt
              ? dayjs(dataInit.updatedAt).format("DD-MM-YYYY HH:mm:ss")
              : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Hồ sơ ứng viên">
            <a
              href={`${process.env.NEXT_PUBLIC_URL_BACKEND}/images/resume/${dataInit?.url}`}
              target="_blank"
            >
              {dataInit?.url}
            </a>
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};

export default ViewDetailResume;
