import { Metadata } from "next";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Hệ thống quản lý đa chức năng",
  description: "Tạo tài khoản mới trên Hệ thống quản lý đa chức năng",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
