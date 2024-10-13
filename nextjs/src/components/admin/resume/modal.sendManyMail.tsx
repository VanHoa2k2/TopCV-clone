import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, message, notification, Row } from "antd";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { IResume } from "@/types/backend";
import styles from "@/styles/admin.module.scss";
import mailApiRequest from "@/apiRequests/mail";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  selectedResumes: IResume[];
  resetSelectedResumes: () => void;
}

const ModalSendManyMail = (props: IProps) => {
  const { openModal, setOpenModal, selectedResumes, resetSelectedResumes } =
    props;
  const [form] = Form.useForm();
  const [contentMail, setContentMail] = useState<string>("");

  const [canUseDOM, setCanUseDOM] = useState(false);

  useEffect(() => {
    setCanUseDOM(typeof document !== "undefined");
  }, []);

  const handleReset = async () => {
    form.resetFields();
    setOpenModal(false);
  };

  let ReactQuill;
  if (canUseDOM) {
    ReactQuill = require("react-quill");
    require("react-quill/dist/quill.snow.css");
  }

  const submitSendMail = async (valuesForm: any) => {
    const { title } = valuesForm;

    // Tạo một Set để lưu trữ các email đã gửi
    const sentEmails = new Set();
    console.log(selectedResumes);
    const promises = selectedResumes.map(async (resume: IResume) => {
      // Kiểm tra xem email đã được gửi chưa
      if (!sentEmails.has(resume.email)) {
        sentEmails.add(resume.email); // Đánh dấu email là đã gửi
        return await mailApiRequest.callSendMailConfirm({
          name: resume?.createdBy?.name as string,
          nameJob: resume?.job?.name as string,
          email: resume.email,
          title,
          contentMail,
          token: resume.token, // Giả sử resume có token
        });
      }
    });

    try {
      const results = await Promise.all(promises);

      const successCount = results.filter(
        (res) => res && res.statusCode === 201 // Kiểm tra res có tồn tại và statusCode là 201
      ).length;

      const totalSentEmails = selectedResumes.length;

      message.success(`Gửi mail thành công cho ${totalSentEmails} ứng viên!`);
      handleReset();
      resetSelectedResumes(); // Reset selected resumes after sending emails
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Không thể gửi mail cho tất cả ứng viên.",
      });
    }
  };

  return (
    <ModalForm
      title={"Gửi mail cho nhiều ứng viên"}
      open={openModal}
      modalProps={{
        onCancel: handleReset,
        afterClose: handleReset,
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
    >
      <Row gutter={8}>
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
  );
};

export default ModalSendManyMail;
