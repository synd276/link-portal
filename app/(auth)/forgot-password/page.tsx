import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata: Metadata = {
  title: "Quên mật khẩu | Hệ thống quản lý đa chức năng",
  description: "Đặt lại mật khẩu cho tài khoản Hệ thống quản lý đa chức năng",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
