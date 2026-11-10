"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validations";
import { Category } from "@/types/database";
import { invalidateCategoriesCache } from "@/lib/data";
import { logAdminAction, logError } from "@/lib/logger";

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
    const errorMsg = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
    await logError({
      action: "CREATE_CATEGORY_VALIDATION_ERROR",
      message: `Lỗi xác thực khi tạo danh mục: ${errorMsg}`,
      details: { issues: parsed.error.issues },
    });
    return {
      success: false,
      error: errorMsg,
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
    .select("role, full_name")
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
    await logError({
      action: "CREATE_CATEGORY_DB_ERROR",
      message: `Lỗi cơ sở dữ liệu khi tạo danh mục "${parsed.data.name}": ${error.message}`,
      details: { error, payload: newCategory },
      userId: user.id,
      userEmail: user.email,
    });
    return { success: false, error: error.message };
  }

  if (isAdmin || isGlobal) {
    await logAdminAction({
      action: "CREATE_CATEGORY",
      message: `Quản trị viên đã tạo danh mục mới: "${data.name}"`,
      entityType: "category",
      entityId: data.id,
      details: {
        name: data.name,
        icon: data.icon,
        is_global: data.is_global,
        sort_order: data.sort_order,
      },
      userId: user.id,
      userEmail: user.email,
      userName: profile?.full_name || "Quản trị viên",
    });
  }

  invalidateCategoriesCache();
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
    const errorMsg = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
    await logError({
      action: "UPDATE_CATEGORY_VALIDATION_ERROR",
      message: `Lỗi xác thực khi sửa danh mục ID "${id}": ${errorMsg}`,
      details: { id, issues: parsed.error.issues },
    });
    return {
      success: false,
      error: errorMsg,
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
    await logError({
      action: "UPDATE_CATEGORY_NOT_FOUND",
      message: `Không tìm thấy danh mục để sửa ID "${id}"`,
      details: { id },
      userId: user.id,
      userEmail: user.email,
    });
    return { success: false, error: "Không tìm thấy danh mục." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (existing.is_global && !isAdmin) {
    await logError({
      action: "UNAUTHORIZED_UPDATE_CATEGORY",
      message: `Người dùng ${user.email} cố gắng sửa danh mục hệ thống "${existing.name}" không hợp lệ`,
      entityType: "category",
      entityId: id,
      userId: user.id,
      userEmail: user.email,
    });
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
    await logError({
      action: "UPDATE_CATEGORY_DB_ERROR",
      message: `Lỗi cơ sở dữ liệu khi sửa danh mục "${existing.name}": ${error.message}`,
      details: { id, error, updates },
      userId: user.id,
      userEmail: user.email,
    });
    return { success: false, error: error.message };
  }

  if (isAdmin || existing.is_global) {
    await logAdminAction({
      action: "UPDATE_CATEGORY",
      message: `Quản trị viên đã cập nhật danh mục: "${data.name}"`,
      entityType: "category",
      entityId: data.id,
      details: {
        previous: { name: existing.name, icon: existing.icon },
        updated: updates,
      },
      userId: user.id,
      userEmail: user.email,
      userName: profile?.full_name || "Quản trị viên",
    });
  }

  invalidateCategoriesCache();
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
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (existing.is_global && !isAdmin) {
    await logError({
      action: "UNAUTHORIZED_DELETE_CATEGORY",
      message: `Người dùng ${user.email} cố gắng xóa danh mục hệ thống "${existing.name}" không hợp lệ`,
      entityType: "category",
      entityId: id,
      userId: user.id,
      userEmail: user.email,
    });
    return { success: false, error: "Bạn không có quyền xóa danh mục hệ thống." };
  }

  if (!existing.is_global && existing.user_id !== user.id && !isAdmin) {
    return { success: false, error: "Bạn không có quyền xóa danh mục này." };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    await logError({
      action: "DELETE_CATEGORY_DB_ERROR",
      message: `Lỗi cơ sở dữ liệu khi xóa danh mục "${existing.name}": ${error.message}`,
      details: { id, error },
      userId: user.id,
      userEmail: user.email,
    });
    return { success: false, error: error.message };
  }

  if (isAdmin || existing.is_global) {
    await logAdminAction({
      action: "DELETE_CATEGORY",
      message: `Quản trị viên đã xóa danh mục: "${existing.name}"`,
      entityType: "category",
      entityId: id,
      details: {
        deleted_category: existing,
      },
      userId: user.id,
      userEmail: user.email,
      userName: profile?.full_name || "Quản trị viên",
      level: "warn",
    });
  }

  invalidateCategoriesCache();
  revalidatePath("/categories");
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/admin/categories");
  return { success: true };
}
