"use client";

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import NavbarAdmin from "@/components/admin/NavbarAdmin";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import ProtectedRoute from "@/components/share/protected-route.ts";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-admin">
      <NavbarAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ padding: "15px" }}>
          <ProtectedRoute>{children}</ProtectedRoute>
        </Content>
      </Layout>
    </Layout>
  );
}
