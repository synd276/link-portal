import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập | Hệ thống quản lý đa chức năng",
  description: "Đăng nhập vào Hệ thống quản lý đa chức năng để quản lý các website của bạn",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
