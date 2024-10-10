import { z } from "zod";

export const registerBody = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty({ message: "Họ và tên không được để trống" })
      .min(2, { message: "Họ và tên phải có tối thiểu 2 kí tự" })
      .max(256, { message: "Họ và tên không được vượt quá 256 kí tự" }),
    email: z
      .string()
      .nonempty({ message: "Email không được để trống" })
      .email({ message: "Email không hợp lệ" }),
    password: z
      .string()
      .nonempty({ message: "Mật khẩu không được để trống" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 kí tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 kí tự" }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Vui lòng nhập lại mật khẩu" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 kí tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 kí tự" }),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterBodyType = z.TypeOf<typeof registerBody>;

export const LoginBody = z
  .object({
    username: z.string().email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;
