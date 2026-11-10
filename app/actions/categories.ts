"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations";
import { Category } from "@/types/database";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function createCategoryAction(values: unknown): Promise<ActionResult<Category>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vui lòng đăng nhập." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const isGlobal = Boolean(parsed.data.is_global && isAdmin);

  const newCategory = {
    name: parsed.data.name.trim(),
    description: parsed.data.description?.trim() || null,
    icon: parsed.data.icon?.trim() || "Folder",
    is_global: isGlobal,
    user_id: isGlobal ? null : user.id,
    sort_order: parsed.data.sort_order || 0,
  };

  const { data, error } = await supabase
    .from("categories")
    .insert(newCategory)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true, data };
}

export async function updateCategoryAction(
  id: string,
  values: unknown
): Promise<ActionResult<Category>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vui lòng đăng nhập." };
  }

  const { data: existing } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return { success: false, error: "Không tìm thấy danh mục." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (existing.is_global && !isAdmin) {
    return { success: false, error: "Bạn không có quyền sửa danh mục hệ thống." };
  }

  if (!existing.is_global && existing.user_id !== user.id && !isAdmin) {
    return { success: false, error: "Bạn không có quyền sửa danh mục này." };
  }

  const updates = {
    name: parsed.data.name.trim(),
    description: parsed.data.description?.trim() || null,
    icon: parsed.data.icon?.trim() || existing.icon,
    sort_order: parsed.data.sort_order ?? existing.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true, data };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vui lòng đăng nhập." };
  }

  const { data: existing } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return { success: false, error: "Không tìm thấy danh mục." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (existing.is_global && !isAdmin) {
    return { success: false, error: "Bạn không có quyền xóa danh mục hệ thống." };
  }

  if (!existing.is_global && existing.user_id !== user.id && !isAdmin) {
    return { success: false, error: "Bạn không có quyền xóa danh mục này." };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}
