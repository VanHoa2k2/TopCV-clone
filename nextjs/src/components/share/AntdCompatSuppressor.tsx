"use client";

import { useEffect } from "react";

export default function AntdCompatSuppressor() {
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      const firstArg = args[0];
      if (
        typeof firstArg === "string" &&
        (firstArg.includes("antd v5 support React") ||
          firstArg.includes("[antd: compatible]"))
      ) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
