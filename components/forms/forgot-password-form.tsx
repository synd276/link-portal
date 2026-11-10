"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { forgotPasswordAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setServerError(null);
    try {
      const res = await forgotPasswordAction(values);
      if (!res.success) {
        setServerError(res.error || "Không thể gửi yêu cầu đặt lại mật khẩu.");
        toast.error(res.error || "Gửi yêu cầu thất bại.");
        return;
      }

      setIsSubmitted(true);
      toast.success("Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.");
    } catch {
      setServerError("Có lỗi xảy ra, vui lòng thử lại sau.");
      toast.error("Có lỗi xảy ra.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Kiểm tra hộp thư</h1>
        <p className="text-sm text-muted-foreground">
          Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra và làm theo hướng dẫn.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang đăng nhập
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
          <KeyRound className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Quên mật khẩu?</h1>
        <p className="text-sm text-muted-foreground">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
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
          <Label htmlFor="email">Email tài khoản</Label>
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang gửi yêu cầu...
            </>
          ) : (
            "Gửi liên kết đặt lại mật khẩu"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="inline-flex items-center text-primary hover:underline font-medium">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
