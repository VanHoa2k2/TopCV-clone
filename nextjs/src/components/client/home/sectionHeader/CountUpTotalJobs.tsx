"use client";
import React from "react";
import CountUp from "react-countup";
import { Statistic } from "antd";

const CountUpTotalJobs = ({ totalJobs }: { totalJobs: number | undefined }) => {
  const formatter = (value: number | string) => {
    return <CountUp end={Number(value)} separator="," />;
  };
  return (
    <Statistic
      value={totalJobs}
      formatter={formatter}
      valueStyle={{
        color: "#11d769",
        fontSize: "14px",
        fontWeight: "600",
        lineHeight: "22px",
        letterSpacing: ".175",
      }}
    />
  );
};

export default CountUpTotalJobs;
