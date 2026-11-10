"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { resetPasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setServerError(null);
    try {
      const res = await resetPasswordAction(values);
      if (!res.success) {
        setServerError(res.error || "Không thể cập nhật mật khẩu.");
        toast.error(res.error || "Cập nhật mật khẩu thất bại.");
        return;
      }

      toast.success("Mật khẩu đã được cập nhật thành công!");
      router.push("/");
      router.refresh();
    } catch {
      setServerError("Có lỗi xảy ra, vui lòng thử lại sau.");
      toast.error("Có lỗi xảy ra.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Đặt lại mật khẩu mới</h1>
        <p className="text-sm text-muted-foreground">
          Vui lòng nhập mật khẩu mới cho tài khoản của bạn
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
          <Label htmlFor="password">Mật khẩu mới</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ít nhất 6 ký tự"
              autoComplete="new-password"
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

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
            disabled={isSubmitting}
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang lưu mật khẩu...
            </>
          ) : (
            "Lưu mật khẩu mới"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline font-medium">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
