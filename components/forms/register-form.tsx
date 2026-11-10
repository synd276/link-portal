"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Compass, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { registerSchema, type RegisterInput } from "@/lib/validations";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setServerError(null);
    try {
      const res = await registerAction(values);
      if (!res.success) {
        setServerError(res.error || "Đăng ký không thành công.");
        toast.error(res.error || "Đăng ký không thành công.");
        return;
      }

      if ((res.data as any)?.needsEmailConfirmation) {
        setConfirmationNotice(true);
        toast.info("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.");
        return;
      }

      toast.success("Tạo tài khoản thành công! Đang chuyển hướng...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Có lỗi xảy ra trong quá trình xử lý.");
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (confirmationNotice) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Kiểm tra hộp thư của bạn</h1>
        <p className="text-sm text-muted-foreground">
          Chúng tôi đã gửi một liên kết xác thực đến email của bạn. Hãy nhấn vào liên kết để kích hoạt tài khoản trước khi đăng nhập.
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Về trang đăng nhập</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Tạo tài khoản mới</h1>
        <p className="text-sm text-muted-foreground">
          Bắt đầu tổ chức các website và liên kết quan trọng của bạn
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
          <Label htmlFor="full_name">Họ và tên</Label>
          <Input
            id="full_name"
            type="text"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            disabled={isSubmitting}
            {...register("full_name")}
            className={errors.full_name ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.full_name && (
            <p className="text-xs text-destructive">{errors.full_name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password">Mật khẩu</Label>
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
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
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
              Đang tạo tài khoản...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
