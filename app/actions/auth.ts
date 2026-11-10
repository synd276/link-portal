"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileSchema,
  changePasswordSchema,
} from "@/lib/validations";
import { logError } from "@/lib/logger";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function loginAction(values: unknown): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào file .env.local.",
    };
  }

  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ";
    await logError({
      action: "LOGIN_VALIDATION_ERROR",
      message: `Lỗi xác thực dữ liệu đăng nhập: ${errorMsg}`,
    });
    return {
      success: false,
      error: errorMsg,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    let message = "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.";
    if (error.message.includes("Invalid login credentials")) {
      message = "Email hoặc mật khẩu không chính xác.";
    } else if (error.message.includes("Email not confirmed")) {
      message = "Email chưa được xác thực. Vui lòng kiểm tra hộp thư của bạn.";
    }

    await logError({
      action: "AUTH_LOGIN_FAILED",
      message: `Đăng nhập thất bại cho tài khoản '${parsed.data.email}': ${error.message}`,
      details: {
        email: parsed.data.email,
        error_message: error.message,
      },
      userEmail: parsed.data.email,
    });

    return { success: false, error: message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function registerAction(values: unknown): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào file .env.local.",
    };
  }

  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Thông tin đăng ký không hợp lệ",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
    },
  });

  if (error) {
    let message = error.message;
    if (error.message.includes("User already registered")) {
      message = "Email này đã được sử dụng. Vui lòng chọn đăng nhập hoặc dùng email khác.";
    }

    await logError({
      action: "AUTH_REGISTER_FAILED",
      message: `Đăng ký tài khoản thất bại cho '${parsed.data.email}': ${error.message}`,
      details: {
        email: parsed.data.email,
        full_name: parsed.data.full_name,
        error_message: error.message,
      },
      userEmail: parsed.data.email,
      userName: parsed.data.full_name,
    });

    return { success: false, error: message };
  }

  // If Supabase has email confirmation enabled and session is null
  if (data.user && !data.session) {
    return {
      success: true,
      data: { needsEmailConfirmation: true },
    };
  }

  revalidatePath("/", "layout");
  return { success: true, data: { needsEmailConfirmation: false } };
}

export async function forgotPasswordAction(values: unknown): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào file .env.local.",
    };
  }

  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Email không hợp lệ",
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    await logError({
      action: "AUTH_FORGOT_PASSWORD_FAILED",
      message: `Yêu cầu đặt lại mật khẩu thất bại cho '${parsed.data.email}': ${error.message}`,
      userEmail: parsed.data.email,
    });
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function resetPasswordAction(values: unknown): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào file .env.local.",
    };
  }

  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Mật khẩu không hợp lệ",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    await logError({
      action: "AUTH_RESET_PASSWORD_FAILED",
      message: `Cập nhật mật khẩu mới thất bại: ${error.message}`,
    });
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updateProfileAction(values: unknown): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Chưa kết nối database." };
  }

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn chưa đăng nhập." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      avatar_url: parsed.data.avatar_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    await logError({
      action: "UPDATE_PROFILE_ERROR",
      message: `Cập nhật thông tin tài khoản thất bại: ${error.message}`,
      userId: user.id,
      userEmail: user.email,
    });
    return { success: false, error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function changePasswordAction(values: unknown): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Chưa kết nối database." };
  }

  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    await logError({
      action: "CHANGE_PASSWORD_ERROR",
      message: `Đổi mật khẩu thất bại: ${error.message}`,
    });
    return { success: false, error: error.message };
  }

  return { success: true };
}
