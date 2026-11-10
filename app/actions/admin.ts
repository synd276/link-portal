"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminStats, UserRole } from "@/types/database";
import { logAdminAction, logError } from "@/lib/logger";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function checkIsAdmin(): Promise<{ isAdmin: boolean; userId?: string }> {
  if (!isSupabaseConfigured()) return { isAdmin: false };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { isAdmin: profile?.role === "admin", userId: user.id };
}

export async function getAdminStatsAction(): Promise<ActionResult<AdminStats>> {
  const { isAdmin } = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Bạn không có quyền truy cập thông tin quản trị." };
  }

  const supabase = await createClient();

  // Total users
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Total websites
  const { count: totalWebsites } = await supabase
    .from("websites")
    .select("*", { count: "exact", head: true });

  // Global websites
  const { count: globalWebsites } = await supabase
    .from("websites")
    .select("*", { count: "exact", head: true })
    .eq("is_global", true);

  // Personal websites
  const { count: personalWebsites } = await supabase
    .from("websites")
    .select("*", { count: "exact", head: true })
    .eq("is_global", false);

  // Total categories
  const { count: totalCategories } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  return {
    success: true,
    data: {
      totalUsers: usersCount || 0,
      totalWebsites: totalWebsites || 0,
      globalWebsites: globalWebsites || 0,
      personalWebsites: personalWebsites || 0,
      totalCategories: totalCategories || 0,
    },
  };
}

export async function updateUserRoleAction(
  userId: string,
  newRole: UserRole
): Promise<ActionResult> {
  const { isAdmin, userId: currentAdminId } = await checkIsAdmin();
  if (!isAdmin) {
    await logError({
      action: "UNAUTHORIZED_ROLE_CHANGE",
      message: "Yêu cầu thay đổi vai trò người dùng bị từ chối: Không đủ đặc quyền",
      details: { targetUserId: userId, requestedRole: newRole },
      userId: currentAdminId,
    });
    return { success: false, error: "Bạn không có quyền thay đổi vai trò người dùng." };
  }

  if (userId === currentAdminId && newRole !== "admin") {
    return { success: false, error: "Bạn không thể tự hạ quyền quản trị viên của chính mình." };
  }

  const supabase = await createClient();

  // Get target user info
  const { data: targetUser } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .single();

  const { error } = await supabase
    .from("profiles")
    .update({
      role: newRole,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    await logError({
      action: "UPDATE_USER_ROLE_DB_ERROR",
      message: `Lỗi cơ sở dữ liệu khi đổi quyền người dùng ID "${userId}": ${error.message}`,
      details: { userId, newRole, error },
      userId: currentAdminId,
    });
    return { success: false, error: error.message };
  }

  await logAdminAction({
    action: "UPDATE_USER_ROLE",
    message: `Quản trị viên đã đổi vai trò của '${targetUser?.full_name || userId}' thành '${newRole}'`,
    entityType: "user",
    entityId: userId,
    details: {
      target_user_id: userId,
      previous_role: targetUser?.role,
      new_role: newRole,
    },
    level: "warn",
    userId: currentAdminId,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserProfileAction(userId: string): Promise<ActionResult> {
  const { isAdmin, userId: currentAdminId } = await checkIsAdmin();
  if (!isAdmin) {
    await logError({
      action: "UNAUTHORIZED_DELETE_USER",
      message: "Yêu cầu xóa người dùng bị từ chối: Không có quyền admin",
      details: { targetUserId: userId },
      userId: currentAdminId,
    });
    return { success: false, error: "Bạn không có quyền xóa người dùng." };
  }

  if (userId === currentAdminId) {
    return { success: false, error: "Không thể xóa tài khoản của chính mình." };
  }

  const supabase = await createClient();

  // Get target user info
  const { data: targetUser } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .single();

  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  if (error) {
    await logError({
      action: "DELETE_USER_DB_ERROR",
      message: `Lỗi cơ sở dữ liệu khi xóa người dùng ID "${userId}": ${error.message}`,
      details: { userId, error },
      userId: currentAdminId,
    });
    return { success: false, error: error.message };
  }

  await logAdminAction({
    action: "DELETE_USER",
    message: `Quản trị viên đã xóa tài khoản người dùng '${targetUser?.full_name || userId}'`,
    entityType: "user",
    entityId: userId,
    details: {
      target_user_id: userId,
      deleted_user: targetUser,
    },
    level: "warn",
    userId: currentAdminId,
  });

  revalidatePath("/admin/users");
  return { success: true };
}
