"use client";

import companyApiRequest from "@/apiRequests/company";
import jobApiRequest from "@/apiRequests/job";
import userApiRequest from "@/apiRequests/user";
import {
  IAllCompany,
  IAllJob,
  IAllUser,
  IBackendRes,
  IJob,
  IParamsOccupation,
  IUser,
} from "@/types/backend";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import * as echarts from "echarts";
import Chart from "@/components/client/home/sectionHeader/Chart";
import { useAppSelector } from "@/redux/hooks";
import resumeApiRequest from "@/apiRequests/resume";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Admin = () => {
  const user = useAppSelector((state) => state?.account?.user);
  const isHrRole = user.role.name === "HR";
  const [userTotal, setUserTotal] = useState<number>();
  const [jobTotal, setJobTotal] = useState<number>();
  const [jobExpiredTotal, setJobExpiredTotal] = useState([]);
  const [resumeTotal, setResumeTotal] = useState<number>();
  const [companyTotal, setCompanyTotal] = useState<number>();
  const [occupations, setOccupations] = useState<IParamsOccupation>();
  const [userRoles, setUserRoles] = useState<{ [key: string]: number }>({
    admin: 0,
    candidate: 0,
    hr: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const users = await userApiRequest.callFetchAllUser();
      let jobs;
      if (isHrRole) {
        jobs = await jobApiRequest.callFetchAllJobForHR(
          user?.company?.id as number
        );
        let resumes = await resumeApiRequest.callFetchAllResumeForHR(
          user?.company?.id as number
        );
        setResumeTotal(resumes?.data?.length);
        let jobExpired: any = [];
        jobs?.data?.map((job: IJob) => {
          if (dayjs().isAfter(dayjs(job?.endDate))) {
            jobExpired.push(job);
          }
        });
        setJobExpiredTotal(jobExpired);
      } else {
        jobs = await jobApiRequest.callFetchAllJob();
      }
      const companies = await companyApiRequest.callFetchAllCompany();
      setUserTotal(users?.data?.length);
      setJobTotal(jobs?.data?.length);
      setCompanyTotal(companies?.data?.length);

      const resOccupations = await jobApiRequest.callFetchParamsOccupation();
      setOccupations(resOccupations.data);

      const rolesCount = {
        admin: 0,
        candidate: 0,
        hr: 0,
      };

      // Đếm số lượng người dùng theo role.id
      users?.data?.forEach((user: IUser) => {
        if (user.role?.id === 1) {
          rolesCount.admin += 1;
        } else if (user.role?.id === 2) {
          rolesCount.candidate += 1;
        } else if (user.role?.id === 3) {
          rolesCount.hr += 1;
        }
      });

      setUserRoles(rolesCount);
    };

    fetchData();

    // Khởi tạo biểu đồ ECharts
    const chartDom = document.getElementById("userChart");
    const myChart = echarts.init(chartDom);
    myChart.setOption(getOption());

    return () => {
      myChart.dispose();
    };
  }, []);

  // Thêm useEffect để cập nhật biểu đồ khi userRoles thay đổi
  useEffect(() => {
    const chartDom = document.getElementById("userChart");
    const myChart = echarts.init(chartDom);
    myChart.setOption(getOption());

    return () => {
      myChart.dispose();
    };
  }, [userRoles]); // Theo dõi userRoles

  const formatter = (value: number | string) => {
    return <CountUp end={Number(value)} separator="," />;
  };

  const getOption = () => {
    const roles = [
      {
        name: "Admin",
        value: userRoles.admin,
        itemStyle: { color: "#4A90E2" },
      },
      {
        name: "Ứng viên",
        value: userRoles.candidate,
        itemStyle: { color: "#50E3C2" },
      },
      { name: "HR", value: userRoles.hr, itemStyle: { color: "#F5A623" } },
    ].filter((role) => role.value > 0);

    return {
      title: {
        text: "Phân bố người dùng theo vai trò",
        subtext: "Dữ liệu từ hệ thống",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "Số lượng người dùng",
          type: "pie",
          radius: "50%",
          data: roles,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          itemStyle: {
            // Sử dụng màu sắc từ dữ liệu
            normal: {
              color: (params: any) => {
                return roles[params.dataIndex].itemStyle.color;
              },
            },
          },
        },
      ],
      backgroundColor: "#f9f9f9", // Thay đổi màu nền
    };
  };

  return (
    <Row gutter={[20, 20]}>
      {isHrRole ? (
        <>
          <Col span={24} md={8}>
            <Card title="Tổng tin tuyển dụng" bordered={false}>
              <Statistic value={jobTotal} formatter={formatter} />
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card title="Tin tuyển dụng hết hạn" bordered={false}>
              <Statistic value={jobExpiredTotal.length} formatter={formatter} />
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card title="Ứng viên ứng tuyển" bordered={false}>
              <Statistic value={resumeTotal} formatter={formatter} />
            </Card>
          </Col>
        </>
      ) : (
        <>
          <Col span={24} md={8}>
            <Card title="Tổng người dùng" bordered={false}>
              <Statistic value={userTotal} formatter={formatter} />
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card title="Tổng việc làm" bordered={false}>
              <Statistic value={jobTotal} formatter={formatter} />
            </Card>
          </Col>
          <Col span={24} md={8}>
            <Card title="Tổng công ty" bordered={false}>
              <Statistic value={companyTotal} formatter={formatter} />
            </Card>
          </Col>
        </>
      )}
      <Col span={24} md={12}>
        <div id="userChart" style={{ height: "400px" }} />
      </Col>
      <Col span={24} md={12}>
        <div className="px-5 pb-5 bg-[#f9f9f9]">
          <Chart
            occupationData={occupations}
            heightChart={"380px"}
            titleChart={"Nhu cầu tuyển dụng theo ngành nghề"}
          />
        </div>
      </Col>
    </Row>
  );
};

export default Admin;
