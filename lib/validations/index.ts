import { z } from "zod";

// ================= AUTH SCHEMAS =================
export const loginSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ================= WEBSITE SCHEMA =================
const urlRegex = /^https?:\/\/.+/i;

export const websiteSchema = z.object({
  name: z.string().min(1, "Tên website không được để trống").max(100, "Tối đa 100 ký tự"),
  url: z
    .string()
    .min(1, "URL không được để trống")
    .regex(urlRegex, "URL phải bắt đầu bằng http:// hoặc https://"),
  description: z.string().max(300, "Mô tả tối đa 300 ký tự").optional().or(z.literal("")),
  category_id: z.string().min(1, "Vui lòng chọn danh mục"),
  favicon_url: z
    .string()
    .regex(urlRegex, "Favicon URL phải bắt đầu bằng http:// hoặc https://")
    .optional()
    .or(z.literal("")),
  is_featured: z.boolean(),
  sort_order: z.number().int().min(0, "Thứ tự phải lớn hơn hoặc bằng 0"),
  is_global: z.boolean(),
});

export type WebsiteInput = z.infer<typeof websiteSchema>;

// ================= CATEGORY SCHEMA =================
export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").max(50, "Tối đa 50 ký tự"),
  description: z.string().max(200, "Mô tả tối đa 200 ký tự").optional().or(z.literal("")),
  icon: z.string().max(50).optional().or(z.literal("")),
  is_global: z.boolean(),
  sort_order: z.number().int().min(0, "Thứ tự phải lớn hơn hoặc bằng 0"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ================= NOTE SCHEMA =================
export const noteSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").max(120, "Tối đa 120 ký tự"),
  content: z.string(),
});

export type NoteInput = z.infer<typeof noteSchema>;

// ================= PROFILE SCHEMAS =================
export const profileSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100, "Tối đa 100 ký tự"),
  avatar_url: z.string().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    password: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
