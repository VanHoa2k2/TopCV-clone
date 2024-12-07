"use client";

import {
  AliwangwangOutlined,
  ApiOutlined,
  AppstoreOutlined,
  BankOutlined,
  BugOutlined,
  ExceptionOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ALL_PERMISSIONS } from "@/lib/permissions";

const { Content, Footer, Sider } = Layout;

interface NavbarAdminProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const NavbarAdmin = (props: NavbarAdminProps) => {
  const { collapsed, setCollapsed } = props;
  const user = useAppSelector((state) => state?.account?.user);
  // let isMobile = window.matchMedia("(max-width: 600px)").matches;
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);
  const pathname = usePathname();
  const permissions = useAppSelector(
    (state) => state?.account?.user?.permissions
  );

  useEffect(() => {
    if (permissions?.length) {
      const viewCompany = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
      );

      const viewUser = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );

      const viewJob = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
      );

      const viewResume = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
      );

      const viewRole = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
      );

      const viewPermission = permissions.find(
        (item) =>
          item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath &&
          item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
      );
      const full = [
        {
          label: <Link href="/admin">Dashboard</Link>,
          key: "/admin",
          icon: (
            <AppstoreOutlined
              type="button"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          ),
        },
        ...(viewCompany
          ? [
              {
                label: <Link href="/admin/company">Company</Link>,
                key: "/admin/company",
                icon: (
                  <BankOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                ),
              },
            ]
          : []),

        ...(viewUser
          ? [
              {
                label: <Link href="/admin/user">User</Link>,
                key: "/admin/user",
                icon: (
                  <UserOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                ),
              },
            ]
          : []),
        ...(viewJob
          ? [
              {
                label: <Link href="/admin/job">Job</Link>,
                key: "/admin/job",
                icon: (
                  <ScheduleOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                ),
              },
            ]
          : []),

        ...(viewResume
          ? [
              {
                label: <Link href="/admin/resume">Resume</Link>,
                key: "/admin/resume",
                icon: (
                  <AliwangwangOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                ),
              },
            ]
          : []),
        ...(viewPermission
          ? [
              {
                label: <Link href="/admin/permission">Permission</Link>,
                key: "/admin/permission",
                icon: (
                  <ApiOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                ),
              },
            ]
          : []),
        ...(viewRole
          ? [
              {
                label: <Link href="/admin/role">Role</Link>,
                key: "/admin/role",
                icon: (
                  <ExceptionOutlined
                    type="button"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  />
                ),
              },
            ]
          : []),
      ];

      setMenuItems(full);
    } else {
      console.error("No permissions found for user.");
    }
  }, [permissions]);
  useEffect(() => {
    setActiveMenu(pathname);
  }, [pathname]);

  return (
    <>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 32, margin: 16, textAlign: "center" }}>
          <BugOutlined
            type="button"
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          />{" "}
          {user.role.name === "HR" ? "Employer" : "ADMIN"}
        </div>
        <Menu
          selectedKeys={[activeMenu]}
          mode="inline"
          items={menuItems}
          onClick={(e) => setActiveMenu(e.key)}
        />
      </Sider>
    </>
  );
};

export default NavbarAdmin;
