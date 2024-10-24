"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Header from "./client/header-client/Header.client";
import Footer from "./client/Footer.client";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("./share/ChatWidget"), { ssr: false });

interface IProps {
  children: React.ReactNode;
}

function AppContent(props: IProps) {
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pathname]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isSpecialPage =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/login-for-hr" ||
    pathname === "/register" ||
    pathname === "/register-for-hr";

  return isClient && !isSpecialPage ? (
    <div className="layout-app" ref={rootRef}>
      {isClient && <ChatWidget />}
      <Header />
      <div>{props.children}</div>
      <Footer />
    </div>
  ) : (
    props.children
  );
}

export default AppContent;
