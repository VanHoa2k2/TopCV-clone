"use client";
import Link from "next/link";
import Image from "next/image";
import TopCV from "@/assets/images/topcv_white.webp";
import { usePathname } from "next/navigation";

const BgAuth = () => {
  const pathname = usePathname();
  const isSpecialPage = pathname === "/login-for-hr";
  return (
    <div
      className={`fixed top-0 right-0 ${
        isSpecialPage ? "bg-auth02" : "bg-auth"
      } bg-no-repeat bg-cover bg-[0_0] min-w-[500px] h-[100vh] overflow-hidden`}
    >
      {isSpecialPage ? (
        ""
      ) : (
        <div className="absolute left-[35px] mt-[-32px] max-w-[300px] top-[50%] translate-y-[-50%]">
          <Link href="/">
            <Image src={TopCV} alt="Icon TopCV" width={160} height={68} />
          </Link>
          <h1 className="text-[40px] leading-[60px] text-[#fff] font-bold mt-6">
            Tiếp lợi thế <br />
            Nối thành công
          </h1>
          <p className="text-[14px] leading-[22px] text-[#fff] mb-4">
            TopCV - Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt
            Nam
          </p>
        </div>
      )}
      <div className="absolute bg-auth-arrow bg-no-repeat bg-cover w-[211.08px] h-[608px] right-[16px] top-[50%] translate-y-[-50%]"></div>
    </div>
  );
};

export default BgAuth;
