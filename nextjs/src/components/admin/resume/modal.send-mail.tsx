import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, message, notification, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useState, useEffect } from "react";
import { IResume, IUser } from "@/types/backend";
import styles from "@/styles/admin.module.scss";
import userApiRequest from "@/apiRequests/user";
import mailApiRequest from "@/apiRequests/mail";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: IResume | null;
  setDataInit: (v: any) => void;
}

const ModalSendMail = (props: IProps) => {
  const { openModal, setOpenModal, dataInit, setDataInit } = props;
  const [form] = Form.useForm();
  const [userResume, setUserResume] = useState<IUser>();
  const [contentMail, setContentMail] = useState<string>("");

  const [canUseDOM, setCanUseDOM] = useState(false);

  useEffect(() => {
    setCanUseDOM(typeof document !== "undefined");
  }, []);

  useEffect(() => {
    const getUserById = async () => {
      if (dataInit?.createdBy?.id) {
        const res = await userApiRequest.callFetchUserById(
          dataInit?.createdBy?.id as number
        );
        setUserResume(res?.data);
        form.setFieldsValue(res?.data);
      }
    };
    getUserById();
  }, [dataInit?.createdBy?.id, form]);

  const handleReset = async () => {
    form.resetFields();
    setDataInit(null);
    setOpenModal(false);
  };

  let ReactQuill;
  if (canUseDOM) {
    ReactQuill = require("react-quill");
    require("react-quill/dist/quill.snow.css");
  }
  console.log(dataInit);
  const submitSendMail = async (valuesForm: any) => {
    const { name, email, title } = valuesForm;

    const res = await mailApiRequest.callSendMailConfirm({
      name,
      nameJob: dataInit?.job?.name as string,
      email,
      title,
      contentMail,
      token: dataInit?.token as string,
    });
    if (res.statusCode === 201) {
      message.success("Gửi mail thành công!");
      handleReset();
      // reloadTable();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <>
      <ModalForm
        title={"Gửi mail"}
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
          okText: "Gửi",
          cancelText: "Hủy",
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitSendMail}
        initialValues={userResume}
      >
        <Row gutter={8}>
          <Col lg={24} md={24} sm={24} xs={24}>
            <ProFormText label="Email người nhận" name="email" disabled />
          </Col>
          <Col lg={24} md={24} sm={24} xs={24}>
            <ProFormText
              label="Tên người nhận"
              name="name"
              rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            />
          </Col>
          <Col lg={24} md={24} sm={24} xs={24}>
            <ProFormText
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              placeholder="Thư mời phỏng vấn"
            />
          </Col>
          <Col span={24}>
            {canUseDOM && ReactQuill && (
              <ProForm.Item
                name="contentMail"
                label="Nội dung email"
                rules={[
                  { required: true, message: "Vui lòng nhập miêu tả mail!" },
                ]}
                className={styles["set-height-proFormItem"]}
              >
                <ReactQuill
                  className={styles["set-height-quill"]}
                  theme="snow"
                  value={contentMail}
                  onChange={setContentMail}
                />
              </ProForm.Item>
            )}
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default ModalSendMail;
