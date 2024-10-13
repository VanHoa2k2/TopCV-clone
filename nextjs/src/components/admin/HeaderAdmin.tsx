"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLogoutAction } from "@/redux/slice/accountSlide";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Space, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import authApiRequest from "@/apiRequests/auth";

interface HeaderAdminProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const HeaderAdmin = (props: HeaderAdminProps) => {
  const { collapsed, setCollapsed } = props;
  const user = useAppSelector((state) => state?.account?.user);
  const route = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const res = await authApiRequest.logoutFromNextClientToNextServer();
      if (res && res.data) {
        dispatch(setLogoutAction({}));
        message.success("Đăng xuất thành công");
        route.push("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      message.error("Đăng xuất không thành công. Vui lòng thử lại.");
    }
  };

  // if (isMobile) {
  //     items.push({
  //         label: <label
  //             style={{ cursor: 'pointer' }}
  //             onClick={() => handleLogout()}
  //         >Đăng xuất</label>,
  //         key: 'logout',
  //         icon: <LogoutOutlined />
  //     })
  // }

  const itemsDropdown = [
    {
      label: <Link href={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  return (
    <>
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginRight: 20,
        }}
      >
        <Button
          type="text"
          icon={
            collapsed
              ? React.createElement(MenuUnfoldOutlined)
              : React.createElement(MenuFoldOutlined)
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />

        <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            Welcome {user?.name}
            <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
          </Space>
        </Dropdown>
      </div>
    </>
  );
};

export default HeaderAdmin;
