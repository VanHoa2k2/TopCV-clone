import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/redux/provider";
import FetchAccount from "@/components/FetchAccount";
import { cookies } from "next/headers";
import RefreshToken from "@/components/refresh-token";
import AppContent from "@/components/app.content";
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
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <FetchAccount access_token={access_token?.value as string} />
          <AntdRegistry>
            <AppContent>{children}</AppContent>
          </AntdRegistry>
          <RefreshToken />
        </Providers>
      </body>
    </html>
  );
}
