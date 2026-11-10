import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu | Link Portal",
  description: "Nhập mật khẩu mới cho tài khoản của bạn",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
