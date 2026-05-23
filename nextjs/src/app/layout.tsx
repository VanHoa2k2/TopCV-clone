import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/redux/provider";
import FetchAccount from "@/components/FetchAccount";
import RefreshToken from "@/components/refresh-token";
import AppContent from "@/components/app.content";
import AntdCompatSuppressor from "@/components/share/AntdCompatSuppressor";
import { baseOpenGraph } from "@/lib/shared-metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TopCV clone - Phạm Văn Hòa",
  description: "Sản phẩm luận văn tốt nghiệp ctu - Được tạo bởi Hòa Dev",
  openGraph: baseOpenGraph,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <FetchAccount />
          <AntdCompatSuppressor />
          <AntdRegistry>
            <AppContent>{children}</AppContent>
          </AntdRegistry>
          <RefreshToken />
        </Providers>
      </body>
    </html>
  );
}
