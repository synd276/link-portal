import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata: Metadata = {
  title: "Quên mật khẩu | Link Portal",
  description: "Đặt lại mật khẩu cho tài khoản Link Portal",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
