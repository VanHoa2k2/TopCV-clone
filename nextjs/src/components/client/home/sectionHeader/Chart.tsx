"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { IParamsOccupation } from "@/types/backend";

interface IProps {
  occupationData: IParamsOccupation | undefined;
}

const Chart = (props: IProps) => {
  const { occupationData } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current && Array.isArray(occupationData)) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow", // Hiển thị thanh trỏ dạng bóng
          },
          formatter: "{b}: {c} công việc", // Hiển thị tooltip khi hover
        },
        xAxis: {
          type: "category",
          data: occupationData.map((item) => item.name),
          axisLabel: {
            color: "#fff", // Màu của nhãn trên trục x
          },
          axisLine: {
            show: true,
          },
          axisTick: {
            show: false, // Ẩn các dấu tích trên trục x
          },
        },
        yAxis: {
          type: "value",
          show: true,
        },
        series: [
          {
            name: "Số lượng công việc",
            type: "bar",
            data: occupationData.map((item) => ({
              value: item.jobCount,
              itemStyle: {
                color: item.fill,
                opacity: 0.8, // Độ mờ của các cột
                shadowColor: "rgba(0, 0, 0, 0.3)", // Màu của đổ bóng
                shadowBlur: 5, // Độ mờ của đổ bóng
              },
            })),
            label: {
              show: true,
              position: "top",
              color: "#fff",
              formatter: "{c}", // Chỉ hiển thị số lượng công việc trên cột
              padding: [0, 0, 10, 0], // Tăng khoảng cách phía dưới của nhãn
            },
            barWidth: "50%", // Độ rộng của các cột
          },
        ],
        grid: {
          left: 0,
          right: 0,
          bottom: 10,
          top: 30, // Tăng khoảng cách phía trên của lưới để tránh che nhãn
          containLabel: true, // Đảm bảo các nhãn được hiển thị đầy đủ
        },
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [occupationData]);

  return <div ref={chartRef} style={{ width: "100%", height: "177px" }}></div>;
};

export default Chart;
