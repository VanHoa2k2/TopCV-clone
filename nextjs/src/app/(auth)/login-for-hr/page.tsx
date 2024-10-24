import LoginForm from "@/app/(auth)/login/login-form";
import Link from "next/link";

const LoginHrPage = () => {
  return (
    <>
      <LoginForm />
      <div className="mt-3 text-center">
        <span className="text-sm text-[#6f37882]">
          Bạn chưa có tài khoản?{" "}
          <Link href="/register-for-hr" className="text-primary">
            Đăng ký ngay
          </Link>
        </span>
      </div>
    </>
  );
};

export default LoginHrPage;
