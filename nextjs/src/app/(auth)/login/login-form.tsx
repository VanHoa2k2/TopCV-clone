"use client";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import authApiRequest from "@/apiRequests/auth";
import { useState } from "react";
import { message, notification } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import accountApiRequest from "@/apiRequests/account";
import { Suspense } from "react";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callback = searchParams.get("callback");

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    const { username, password } = values;
    if (isSubmit) return;
    setIsSubmit(true);

    const res = await authApiRequest.login(username, password);
    setIsSubmit(false);
    if (res?.data) {
      const resAuth = await authApiRequest.auth({
        accessToken: res.data?.access_token as string,
        accessTokenExpires: res.data?.accessTokenExpires as string,
        refreshToken: res.data?.refresh_token as string,
      });
      if (resAuth) {
        localStorage.setItem("access_token", res?.data?.access_token);
        localStorage.setItem(
          "accessTokenExpiresAt",
          res?.data?.accessTokenExpires
        );
        dispatch(setUserLoginInfo(res?.data?.user));
        message.success("Đăng nhập tài khoản thành công!");
        if (res?.data?.user?.role?.name !== "NORMAL_USER") {
          router.push("admin");
        } else {
          router.push(callback ? callback : "/");
        }
      }
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-[#4d5965]"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="relative">
                <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <FormControl>
                  <Input
                    placeholder="Nhập email"
                    type="email"
                    {...field}
                    className={`pl-10 p-y-[7px] h-10 ${
                      form.formState.errors.username ? "border-[#ff453a]" : ""
                    }`}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <FormControl>
                  <Input
                    placeholder="Nhập mật khẩu"
                    type="password"
                    {...field}
                    className={`pl-10 p-y-[7px] h-10 ${
                      form.formState.errors.password ? "border-[#ff453a]" : ""
                    }`}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="h-10 w-full text-[#fff]">
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
};

// Wrap LoginForm in a Suspense boundary
const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
