import RegisterForm from "@/app/(auth)/register-for-hr/register-form";
import Link from "next/link";

const RegisterForHRPage = () => {
  return (
    <>
      <RegisterForm />
      <div className="mt-3 text-center">
        <span className="text-sm text-[#6f37882]">
          Bạn đã có tài khoản?{" "}
          <Link href="/login" className="text-primary">
            Đăng nhập ngay
          </Link>
        </span>
      </div>
    </>
  );
};

export default RegisterForHRPage;