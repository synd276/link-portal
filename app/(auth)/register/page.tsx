import { Metadata } from "next";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Link Portal",
  description: "Tạo tài khoản mới trên Link Portal",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
