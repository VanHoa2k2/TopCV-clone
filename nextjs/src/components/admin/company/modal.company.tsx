import {
  CheckSquareOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import {
  Col,
  ConfigProvider,
  Form,
  Modal,
  Row,
  Upload,
  message,
  notification,
} from "antd";
import "@/styles/reset.scss";
import { isMobile } from "react-device-detect";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { ICompany } from "@/types/backend";
import { v4 as uuidv4 } from "uuid";
import enUS from "antd/lib/locale/en_US";
import Image from "next/image";
import dynamic from "next/dynamic";
import companyApiRequest from "@/apiRequests/company";
import fileUploadApiRequest from "@/apiRequests/fileUpload";
import { EMPLOYEE_SIZE_LIST, FIELDS_LIST } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  dataInit?: ICompany | null;
  setDataInit: (v: any) => void;
  reloadTable: () => void;
}

interface ICompanyForm {
  name: string;
  fields: string[];
  address: string;
  linkWebsite: string;
  employeeSize: string;
  logo: string;
  coverImage: string;
}

interface ICompanyImage {
  name: string;
  uid: string;
}

export interface IField {
  id?: number;
  name: string;
}
[];

const ModalCompany = (props: IProps) => {
  const router = useRouter();
  const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

  //modal animation
  const [animation, setAnimation] = useState<string>("open");

  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const [dataLogo, setDataLogo] = useState<ICompanyImage[]>([]);
  const [dataCoverImage, setDataCoverImage] = useState<ICompanyImage[]>([]);
  const [dataFields, setDataFields] = useState<IField[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [value, setValue] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataInit?.id && dataInit?.description) {
      setValue(dataInit.description);
    }
  }, [dataInit]);

  useEffect(() => {
    if (dataInit?.id && dataInit?.fields) {
      setDataFields(dataInit.fields);
      form.setFieldsValue({
        fields: dataInit.fields.map((field) => field.name),
      });
    } else {
      setDataFields([]);
    }
  }, [dataInit, form]);
  console.log(dataInit);

  useEffect(() => {
    if (dataInit?.id && dataInit?.logo) {
      const logo = {
        name: dataInit?.logo,
        uid: uuidv4(),
      };

      const logoArr = [];
      logoArr.push(logo);
      setDataLogo(logoArr);
    }
  }, [dataInit]);

  useEffect(() => {
    if (dataInit?.id && dataInit?.coverImage) {
      const coverImage = {
        name: dataInit?.coverImage,
        uid: uuidv4(),
      };

      const coverImageArr = [];
      coverImageArr.push(coverImage);
      setDataCoverImage(coverImageArr);
    }
  }, [dataInit]);

  const submitCompany = async (valuesForm: ICompanyForm) => {
    const { name, fields, address, linkWebsite, employeeSize } = valuesForm;

    if (dataLogo.length === 0) {
      message.error("Vui lòng upload ảnh Logo");
      return;
    }
    if (dataInit?.id) {
      //update
      const fieldsReq: string[] = [];

      fields.map((field: any) => {
        fieldsReq.push(field.name ? field.name : field);
      });
      const res = await companyApiRequest.callUpdateCompany(
        dataInit.id,
        name,
        fieldsReq,
        address,
        linkWebsite ? linkWebsite : null,
        employeeSize,
        value,
        dataLogo[0].name,
        dataCoverImage[0]?.name
      );
      if (res.data) {
        message.success("Cập nhật company thành công");
        setDataFields([]);
        setDataCoverImage([]);
        handleReset();
        reloadTable();
        router.refresh();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const res = await companyApiRequest.callCreateCompany(
        name,
        fields,
        address,
        linkWebsite ? linkWebsite : null,
        employeeSize,
        value,
        dataLogo[0].name,
        dataCoverImage[0]?.name ? dataCoverImage[0]?.name : null
      );
      if (res.data) {
        message.success("Thêm mới company thành công");
        setDataFields([]);
        setDataCoverImage([]);
        handleReset();
        reloadTable();
        router.refresh();
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
    setValue("");
    setDataInit(null);

    //add animation when closing modal
    setAnimation("close");
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation("open");
  };

  const handleRemoveFile = (file: any, type: "logo" | "coverImage") => {
    if (type === "logo") {
      setDataLogo([]);
    } else if (type === "coverImage") {
      setDataCoverImage([]);
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }

    getBase64(file.originFileObj, (url: string) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
    }
    if (info.file.status === "done") {
      setLoadingUpload(false);
    }
    if (info.file.status === "error") {
      setLoadingUpload(false);
      message.error(
        info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file."
      );
    }
  };

  const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
    const res = await fileUploadApiRequest.callUploadSingleFile(
      file,
      "company"
    );
    if (res && res.data) {
      setDataLogo([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataLogo([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  const handleUploadFileCoverImage = async ({
    file,
    onSuccess,
    onError,
  }: any) => {
    const res = await fileUploadApiRequest.callUploadSingleFile(
      file,
      "coverImage"
    );
    if (res && res.data) {
      setDataCoverImage([
        {
          name: res.data.fileName,
          uid: uuidv4(),
        },
      ]);
      if (onSuccess) onSuccess("ok");
    } else {
      if (onError) {
        setDataCoverImage([]);
        const error = new Error(res.message);
        onError({ event: error });
      }
    }
  };

  return (
    <>
      {openModal && (
        <>
          <ModalForm
            title={<>{dataInit?.id ? "Cập nhật Company" : "Tạo mới Company"}</>}
            open={openModal}
            modalProps={{
              onCancel: () => {
                handleReset();
              },
              afterClose: () => handleReset(),
              destroyOnClose: true,
              width: isMobile ? "100%" : 900,
              footer: null,
              keyboard: false,
              maskClosable: false,
              className: `modal-company ${animation}`,
              rootClassName: `modal-company-root ${animation}`,
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitCompany}
            initialValues={dataInit?.id ? dataInit : {}}
            submitter={{
              render: (_: any, dom: any) => (
                <FooterToolbar>{dom}</FooterToolbar>
              ),
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
                submitText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
              },
            }}
          >
            <Row gutter={16}>
              <Col span={16}>
                <ProFormText
                  label="Tên công ty"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập tên công ty"
                />
              </Col>
              <Col span={8}>
                <ProFormSelect
                  name="fields"
                  label="Lĩnh vực"
                  placeholder="Chọn lĩnh vực"
                  options={FIELDS_LIST}
                  mode="multiple"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn lĩnh vực",
                    },
                  ]}
                  onChange={(value) => {
                    setDataFields(
                      value.map((name: string, index: number) => ({
                        id: index + 1,
                        name,
                      }))
                    );
                  }}
                  fieldProps={{
                    value: dataFields.map((field) => field.name),
                  }}
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Ảnh bìa"
                  name="coverImage"
                >
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name="coverImage"
                      listType="picture-card"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileCoverImage}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file, "coverImage")}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?.id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.coverImage ?? "",
                                status: "done",
                                url: `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/coverImage/${dataInit?.coverImage}`,
                              },
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? (
                          <LoadingOutlined
                            type="button"
                            onMouseEnter={() => {}}
                            onMouseLeave={() => {}}
                          />
                        ) : (
                          <PlusOutlined
                            type="button"
                            onMouseEnter={() => {}}
                            onMouseLeave={() => {}}
                          />
                        )}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>
              <Col span={8}>
                <ProFormText
                  label="Website"
                  name="linkWebsite"
                  placeholder="https://"
                />
              </Col>
              <Col span={8}>
                <ProFormSelect
                  name="employeeSize"
                  label="Quy mô"
                  options={EMPLOYEE_SIZE_LIST}
                  placeholder="Chọn quy mô công ty"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn quy mô công ty!",
                    },
                  ]}
                  allowClear
                  fieldProps={{
                    showArrow: false,
                  }}
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  label="Ảnh Logo"
                  name="logo"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng không bỏ trống",
                      validator: () => {
                        if (dataLogo.length > 0) return Promise.resolve();
                        else return Promise.reject(false);
                      },
                    },
                  ]}
                >
                  <ConfigProvider locale={enUS}>
                    <Upload
                      name="logo"
                      listType="picture-circle"
                      className="avatar-uploader"
                      maxCount={1}
                      multiple={false}
                      customRequest={handleUploadFileLogo}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      onRemove={(file) => handleRemoveFile(file, "logo")}
                      onPreview={handlePreview}
                      defaultFileList={
                        dataInit?.id
                          ? [
                              {
                                uid: uuidv4(),
                                name: dataInit?.logo ?? "",
                                status: "done",
                                url: `${process.env.NEXT_PUBLIC_URL_BACKEND}/images/company/${dataInit?.logo}`,
                              },
                            ]
                          : []
                      }
                    >
                      <div>
                        {loadingUpload ? (
                          <LoadingOutlined
                            type="button"
                            onMouseEnter={() => {}}
                            onMouseLeave={() => {}}
                          />
                        ) : (
                          <PlusOutlined
                            type="button"
                            onMouseEnter={() => {}}
                            onMouseLeave={() => {}}
                          />
                        )}
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </ConfigProvider>
                </Form.Item>
              </Col>

              <Col span={16}>
                <ProFormTextArea
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập địa chỉ công ty"
                  fieldProps={{
                    autoSize: { minRows: 4 },
                  }}
                />
              </Col>

              <ProCard
                title="Miêu tả"
                // subTitle="mô tả công ty"
                headStyle={{ color: "#d81921" }}
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ReactQuill theme="snow" value={value} onChange={setValue} />
                </Col>
              </ProCard>
            </Row>
          </ModalForm>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            style={{ zIndex: 1500 }}
          >
            <Image
              alt="example"
              src={previewImage}
              width={500}
              height={300}
              style={{ width: "100%", height: "100%" }}
            />
          </Modal>
        </>
      )}
    </>
  );
};

export default ModalCompany;
