"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Compass, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/lib/validations";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      const res = await loginAction(values);
      if (!res.success) {
        setServerError(res.error || "Đăng nhập không thành công.");
        toast.error(res.error || "Đăng nhập không thành công.");
        return;
      }

      toast.success("Đăng nhập thành công! Đang chuyển hướng...");
      router.push(redirectedFrom);
      router.refresh();
    } catch {
      setServerError("Có lỗi xảy ra trong quá trình xử lý.");
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Chào mừng quay trở lại</h1>
        <p className="text-sm text-muted-foreground">
          Đăng nhập vào Link Portal để truy cập các liên kết của bạn
        </p>
      </div>

      {serverError && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            {...register("email")}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register("password")}
              className={errors.password ? "border-destructive pr-10 focus-visible:ring-destructive" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
