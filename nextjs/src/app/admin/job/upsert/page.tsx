"use client";

import {
  Breadcrumb,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Radio,
  RadioChangeEvent,
  Row,
  message,
  notification,
} from "antd";
import { DebounceSelect } from "@/components/admin/user/debouce.select";
import {
  FooterToolbar,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from "@ant-design/pro-components";
import styles from "@/styles/admin.module.scss";
import {
  EMPLOYMENTTYPE_LIST,
  EXPERIENCES_LIST,
  GENDERREQ_LIST,
  LEVELS_LIST,
  LOCATION_LIST,
  OCCUPATIONS_LIST,
  SKILLS_LIST,
} from "@/lib/utils";
import { ICompanySelect } from "@/components/admin/user/modal.user";
import { useState, useEffect } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from "antd/lib/locale/en_US";
import dayjs from "dayjs";
import { IJob } from "@/types/backend";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import jobApiRequest from "@/apiRequests/job";
import companyApiRequest from "@/apiRequests/company";

const ViewUpsertJob = (props: any) => {
  const [companies, setCompanies] = useState<ICompanySelect[]>([]);
  const router = useRouter();

  const [description, setDescription] = useState<string>("");
  const [salarySelect, setSalarySelect] = useState<number>(1);
  let params = useSearchParams();

  const id = params?.get("id"); // job id
  const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
  const [initialSalaryStart, setInitialSalaryStart] = useState<number>(0);
  const [initialSalaryEnd, setInitialSalaryEnd] = useState<number>(0);

  const [form] = Form.useForm();

  // Sử dụng state để theo dõi việc có thể sử dụng `document` hay không
  const [canUseDOM, setCanUseDOM] = useState(false);

  // Sử dụng hook useEffect để thiết lập giá trị cho `canUseDOM`
  useEffect(() => {
    setCanUseDOM(typeof document !== "undefined");
  }, []);

  // Chỉ import ReactQuill khi đang chạy trong môi trường trình duyệt
  let ReactQuill;
  if (canUseDOM) {
    ReactQuill = require("react-quill");
    require("react-quill/dist/quill.snow.css");
  }

  useEffect(() => {
    const init = async () => {
      if (id) {
        const res = await jobApiRequest.callFetchJobById(id);

        if (res && res.data) {
          let startSalary = 0;
          let endSalary = 0;
          if (res.data?.salary !== "Thỏa thuận") {
            const salaryRange = res.data?.salary?.match(/\d+/g);
            startSalary = salaryRange ? parseInt(salaryRange[0], 10) : 0;
            endSalary = salaryRange ? parseInt(salaryRange[1], 10) : 0;

            setInitialSalaryStart(startSalary);
            setInitialSalaryEnd(endSalary);
          } else {
            setSalarySelect(2);
          }

          setDataUpdate(res.data);
          setDescription(res.data.description);
          setCompanies([
            {
              label: res.data.company?.name as string,
              value:
                `${res.data.company?.id}@#$${res.data.company?.logo}` as any,
              key: res.data.company?.id,
            },
          ]);

          form.setFieldsValue({
            ...res.data,
            salaryStart: startSalary && startSalary,
            salaryEnd: endSalary && endSalary,
            company: {
              label: res.data.company?.name as string,
              value:
                `${res.data.company?.id}@#$${res.data.company?.logo}` as string,
              key: res.data.company?.id,
            },
          });
        }
      }
    };
    init();
    return () => form.resetFields();
  }, [id, form]);

  // Usage of DebounceSelect
  async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
    const res = await companyApiRequest.callFetchCompany(
      `current=1&pageSize=100${name ? `&name=${name}` : ""}`
    );
    if (res && res.data) {
      const list = res.data.result;
      const temp = list.map((item) => {
        return {
          label: item.name as string,
          value: `${item.id}@#$${item.logo}` as any,
        };
      });
      return temp;
    } else return [];
  }

  const handleChangeSalary = (e: RadioChangeEvent) => {
    setSalarySelect(e.target.value);
  };

  const onFinish = async (values: any) => {
    const salary =
      salarySelect === 2
        ? "Thỏa thuận"
        : values.salaryStart === 0
        ? `Tới ${values.salaryEnd} Triệu`
        : `${values.salaryStart} - ${values.salaryEnd} Triệu`;

    if (dataUpdate?.id) {
      //update
      const cp = values?.company?.value?.split("@#$");
      const job: IJob = {
        name: values?.name,
        skills: values?.skills,
        occupations: values?.occupations,
        company: {
          id: cp && cp.length > 0 ? cp[0] : "",
          name: values?.company.label,
          logo: cp && cp.length > 1 ? cp[1] : "",
          employeeSize: "", // Add this line
          address: "", // Add this line
        },
        location: values?.location,
        salary: salary,
        quantity: values?.quantity,
        employmentType: values?.employmentType,
        genderReq: values?.genderReq,
        level: values?.level,
        experience: values?.experience,
        description: description,
        startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values?.startDate)
          ? dayjs(values?.startDate, "DD/MM/YYYY").toDate()
          : values?.startDate,
        endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values?.endDate)
          ? dayjs(values?.endDate, "DD/MM/YYYY").toDate()
          : values?.endDate,
        isActive: values?.isActive,
      };

      const res = await jobApiRequest.callUpdateJob(job, dataUpdate.id);
      if (res.data) {
        message.success("Cập nhật job thành công");
        router.push("/admin/job");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const cp = values?.company?.value?.split("@#$");
      const job = {
        name: values.name,
        skills: values.skills ? values.skills : [],
        occupations: values.occupations,
        company: {
          id: cp && cp.length > 0 ? cp[0] : "",
          name: values.company.label,
          logo: cp && cp.length > 1 ? cp[1] : "",
        },
        location: values.location,
        salary: salary,
        quantity: values.quantity,
        employmentType: values.employmentType,
        genderReq: values.genderReq,
        level: values.level,
        experience: values.experience,
        description: description,
        startDate: dayjs(values.startDate, "DD/MM/YYYY").toDate(),
        endDate: dayjs(values.endDate, "DD/MM/YYYY").toDate(),
        isActive: values.isActive,
      };

      const res = await jobApiRequest.callCreateJob(job);
      if (res.data) {
        message.success("Tạo mới job thành công");
        router.push("/admin/job");
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
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
              title: "Upsert Job",
            },
          ]}
        />
      </div>
      <div>
        <ConfigProvider locale={enUS}>
          <ProForm
            form={form}
            layout="horizontal"
            onFinish={onFinish}
            submitter={{
              searchConfig: {
                resetText: "Hủy",
                submitText: (
                  <>{dataUpdate?.id ? "Cập nhật Job" : "Tạo mới Job"}</>
                ),
              },
              onReset: () => router.push("/admin/job"),
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
            }}
          >
            <Row gutter={[20, 20]}>
              <Col span={24} md={14}>
                <ProFormText
                  label="Tên Job"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập tên job"
                />
              </Col>
              <Col span={24} md={10}>
                <ProFormSelect
                  name="skills"
                  label="Kỹ năng yêu cầu"
                  options={SKILLS_LIST}
                  placeholder="Please select a skill"
                  allowClear
                  mode="multiple"
                  fieldProps={{
                    showArrow: false,
                  }}
                />
              </Col>
              <Col span={24} md={8}>
                <ProFormSelect
                  name="occupations"
                  label="Ngành nghề"
                  options={OCCUPATIONS_LIST}
                  placeholder="Please select a occupation"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngành nghề!" },
                  ]}
                  allowClear
                  mode="multiple"
                  fieldProps={{
                    showArrow: false,
                  }}
                />
              </Col>
              <Col span={24} md={5}>
                <ProFormSelect
                  name="location"
                  label="Địa điểm"
                  options={LOCATION_LIST.filter(
                    (item: any) => item.value !== "ALL"
                  )}
                  placeholder="Please select a location"
                  rules={[
                    { required: true, message: "Vui lòng chọn địa điểm!" },
                  ]}
                />
              </Col>
              <Col span={24} md={5}>
                <ProFormDigit
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    { required: true, message: "Vui lòng không bỏ trống" },
                  ]}
                  placeholder="Nhập số lượng"
                />
              </Col>
              <Col span={24} md={6}>
                <ProFormSelect
                  name="experience"
                  label="Kinh nghiệm"
                  options={EXPERIENCES_LIST}
                  placeholder="Please select a experience"
                  rules={[
                    { required: true, message: "Vui lòng chọn experience!" },
                  ]}
                />
              </Col>

              {(dataUpdate?.id || !id) && (
                <Col span={24} md={10}>
                  <ProForm.Item
                    name="company"
                    label="Thuộc Công Ty"
                    rules={[
                      { required: true, message: "Vui lòng chọn company!" },
                    ]}
                  >
                    <DebounceSelect
                      allowClear
                      showSearch
                      defaultValue={companies}
                      value={companies}
                      placeholder="Chọn công ty"
                      fetchOptions={fetchCompanyList}
                      onChange={(newValue: any) => {
                        if (newValue?.length === 0 || newValue?.length === 1) {
                          setCompanies(newValue as ICompanySelect[]);
                        }
                      }}
                      style={{ width: "100%" }}
                    />
                  </ProForm.Item>
                </Col>
              )}
              <Col span={24} md={6}>
                <ProFormDatePicker
                  label="Ngày bắt đầu"
                  name="startDate"
                  normalize={(value) => value && dayjs(value, "DD/MM/YYYY")}
                  fieldProps={{
                    format: "DD/MM/YYYY",
                  }}
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày cấp" },
                  ]}
                  placeholder="dd/mm/yyyy"
                />
              </Col>
              <Col span={24} md={6}>
                <ProFormDatePicker
                  label="Ngày kết thúc"
                  name="endDate"
                  normalize={(value) => value && dayjs(value, "DD/MM/YYYY")}
                  fieldProps={{
                    format: "DD/MM/YYYY",
                  }}
                  // width="auto"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày cấp" },
                  ]}
                  placeholder="dd/mm/yyyy"
                />
              </Col>
              <Col span={24} md={10}>
                <Row gutter={[8, 8]}>
                  <Col span={24} md={24} className="flex items-center">
                    <span className="mr-4">Mức lương:</span>
                    <Radio.Group
                      onChange={handleChangeSalary}
                      value={salarySelect}
                    >
                      <Radio value={1}>Trong khoảng</Radio>
                      <Radio value={2}>Thỏa thuận</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                <Row gutter={[10, 10]} className="mt-2">
                  <Col span={24} md={5}>
                    <ProFormDigit
                      label="Từ"
                      name="salaryStart"
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                      ]}
                      disabled={salarySelect === 2 ? true : false}
                      initialValue={initialSalaryStart}
                    />
                  </Col>
                  <Col span={24} md={5}>
                    <ProFormDigit
                      label="Tới"
                      name="salaryEnd"
                      rules={[
                        { required: true, message: "Vui lòng không bỏ trống" },
                      ]}
                      disabled={salarySelect === 2 ? true : false}
                      initialValue={initialSalaryEnd}
                    />
                  </Col>
                  <span className="mt-1">Triệu</span>
                </Row>
              </Col>
              <Col span={24} md={6}>
                <ProFormSelect
                  name="level"
                  label="Cấp bậc"
                  options={LEVELS_LIST}
                  placeholder="Please select a level"
                  rules={[{ required: true, message: "Vui lòng chọn level!" }]}
                />
              </Col>
              <Col span={24} md={6}>
                <ProFormSelect
                  name="employmentType"
                  label="Hình thức làm việc"
                  options={EMPLOYMENTTYPE_LIST}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn hình thức làm việc!",
                    },
                  ]}
                />
              </Col>
              <Col span={24} md={6}>
                <ProFormSelect
                  name="genderReq"
                  label="Yêu cầu giới tính"
                  options={GENDERREQ_LIST}
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" },
                  ]}
                />
              </Col>
              <Col span={24} md={6}>
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
                {canUseDOM && ReactQuill && (
                  <ProForm.Item
                    name="description"
                    label="Miêu tả job"
                    rules={[
                      { required: true, message: "Vui lòng nhập miêu tả job!" },
                    ]}
                    className={styles["set-height-proFormItem"]}
                  >
                    <ReactQuill
                      className={styles["set-height-quill"]}
                      theme="snow"
                      value={description}
                      onChange={setDescription}
                    />
                  </ProForm.Item>
                )}
              </Col>
            </Row>
            <Divider />
          </ProForm>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ViewUpsertJob;
