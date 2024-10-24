"use client";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
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
import { useEffect, useState } from "react";

import {
  registerForHRBody,
  RegisterForHRBodyType,
} from "@/schemaValidations/auth.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { message, notification } from "antd";
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import notifyApiRequest from "@/apiRequests/notify";
import companyApiRequest from "@/apiRequests/company";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IAllCompany, ICompany } from "@/types/backend";

const RegisterForm = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [companyId, setCompanyId] = useState<number | undefined>(undefined);
  console.log(companyId);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await companyApiRequest.callFetchAllCompany();
      if (res && res.data) setCompanies(res.data as unknown as ICompany[]);
    };
    fetchCompanies();
  }, []);

  const form = useForm<RegisterForHRBodyType>({
    resolver: zodResolver(registerForHRBody),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      company: "",
    },
  });

  async function onSubmit(values: RegisterForHRBodyType) {
    if (isSubmit) return;
    setIsSubmit(true);
    if (isTermsAccepted) {
      const res = await authApiRequest.registerForHR({
        ...values,
        company: { id: companyId as number },
      });
      setIsSubmit(false);
      if (res?.data?.id) {
        message.success("Đăng ký tài khoản thành công!");
        await notifyApiRequest.callCreateNotify({
          status: "REGISTER",
          title: `Welcome ${res?.data?.name}`,
          description:
            "Chào mừng bạn đến với website TopCV, hãy upload cv để được gợi ý những việc làm phù hợp nhé!^^",
          user: res?.data?.id,
        });
        router.push("/login-for-hr");
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
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-[#4d5965]"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <div className="relative">
                <AiOutlineUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <FormControl>
                  <Input
                    placeholder="Nhập họ tên"
                    {...field}
                    className={`pl-10 p-y-[7px] h-10 ${
                      form.formState.errors.name ? "border-[#ff453a]" : ""
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
          name="email"
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
                      form.formState.errors.email ? "border-[#ff453a]" : ""
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <div className="relative">
                <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <FormControl>
                  <Input
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                    {...field}
                    className={`pl-10 p-y-[7px] h-10 ${
                      form.formState.errors.confirmPassword
                        ? "border-[#ff453a]"
                        : ""
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
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thuộc công ty</FormLabel>
              <Select
                onValueChange={(value) => {
                  setCompanyId(
                    companies.find((company) => company.name === value)?.id
                  );
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Chọn công ty của bạn"
                      defaultValue={field.value}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <Input
                    placeholder="Tìm kiếm công ty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2"
                  />
                  {companies
                    .filter(
                      (company) =>
                        company.name &&
                        company.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.name as unknown as string}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-3">
          <Checkbox
            id="terms"
            checked={isTermsAccepted}
            onCheckedChange={(checked: boolean) => setIsTermsAccepted(checked)}
            className="text-[#fff]"
          />
          <label
            htmlFor="terms"
            className="text-sm text-[#4d5965] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tôi đã đọc và đồng ý với{" "}
            <span className="text-primary">Điều khoản dịch vụ</span> và{" "}
            <span className="text-primary">Chính sách bảo mật</span> của TopCV
          </label>
        </div>
        <Button
          type="submit"
          className={`h-10 w-full text-[#fff] ${
            isTermsAccepted ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isTermsAccepted}
        >
          Đăng ký
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
