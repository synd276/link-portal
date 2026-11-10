"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { websiteSchema } from "@/lib/validations";
import { getFaviconUrl } from "@/lib/utils";
import { Website } from "@/types/database";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function createWebsiteAction(values: unknown): Promise<ActionResult<Website>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const parsed = websiteSchema.safeParse(values);
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
    return { success: false, error: "Vui lòng đăng nhập để thực hiện thao tác này." };
  }

  // Get user role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const wantGlobal = Boolean(parsed.data.is_global && isAdmin);

  const favicon = parsed.data.favicon_url?.trim()
    ? parsed.data.favicon_url.trim()
    : getFaviconUrl(parsed.data.url);

  const newWebsite = {
    name: parsed.data.name.trim(),
    url: parsed.data.url.trim(),
    description: parsed.data.description?.trim() || null,
    category_id: parsed.data.category_id,
    favicon_url: favicon,
    is_global: wantGlobal,
    user_id: wantGlobal ? null : user.id,
    is_featured: wantGlobal ? parsed.data.is_featured : false,
    sort_order: parsed.data.sort_order || 0,
  };

  const { data, error } = await supabase
    .from("websites")
    .insert(newWebsite)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/websites");
  revalidatePath("/admin/websites");
  return { success: true, data };
}

export async function updateWebsiteAction(
  id: string,
  values: unknown
): Promise<ActionResult<Website>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const parsed = websiteSchema.safeParse(values);
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
    return { success: false, error: "Vui lòng đăng nhập để cập nhật website." };
  }

  // Check existing website
  const { data: existing, error: fetchErr } = await supabase
    .from("websites")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !existing) {
    return { success: false, error: "Không tìm thấy website cần cập nhật." };
  }

  // Check permissions
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (existing.is_global && !isAdmin) {
    return { success: false, error: "Bạn không có quyền chỉnh sửa website hệ thống." };
  }

  if (!existing.is_global && existing.user_id !== user.id && !isAdmin) {
    return { success: false, error: "Bạn không có quyền chỉnh sửa website này." };
  }

  const favicon = parsed.data.favicon_url?.trim()
    ? parsed.data.favicon_url.trim()
    : getFaviconUrl(parsed.data.url);

  const updates = {
    name: parsed.data.name.trim(),
    url: parsed.data.url.trim(),
    description: parsed.data.description?.trim() || null,
    category_id: parsed.data.category_id,
    favicon_url: favicon,
    is_featured: isAdmin ? parsed.data.is_featured : existing.is_featured,
    sort_order: parsed.data.sort_order ?? existing.sort_order,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("websites")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/websites");
  revalidatePath("/admin/websites");
  return { success: true, data };
}

export async function deleteWebsiteAction(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vui lòng đăng nhập để xóa website." };
  }

  const { data: existing } = await supabase
    .from("websites")
    .select("*")
    .eq("id", id)
    .single();

  if (!existing) {
    return { success: false, error: "Không tìm thấy website cần xóa." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (existing.is_global && !isAdmin) {
    return { success: false, error: "Bạn không có quyền xóa website hệ thống." };
  }

  if (!existing.is_global && existing.user_id !== user.id && !isAdmin) {
    return { success: false, error: "Bạn không có quyền xóa website này." };
  }

  const { error } = await supabase.from("websites").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/websites");
  revalidatePath("/admin/websites");
  return { success: true };
}

export async function toggleFavoriteAction(
  websiteId: string
): Promise<ActionResult<{ isFavorite: boolean }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Vui lòng đăng nhập để lưu yêu thích." };
  }

  const { data: existing } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("website_id", websiteId)
    .maybeSingle();

  if (existing) {
    // Remove from favorites
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
  revalidatePath("/");
    revalidatePath("/websites");
    revalidatePath("/websites/favorites");
    return { success: true, data: { isFavorite: false } };
  } else {
    // Add to favorites
    const { error } = await supabase
      .from("user_favorites")
      .insert({
        user_id: user.id,
        website_id: websiteId,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
  revalidatePath("/");
    revalidatePath("/websites");
    revalidatePath("/websites/favorites");
    return { success: true, data: { isFavorite: true } };
  }
}

export async function recordVisitAction(websiteId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in; do not record
    return { success: false, error: "Chưa đăng nhập" };
  }

  const { error } = await supabase.from("user_visits").insert({
    user_id: user.id,
    website_id: websiteId,
    visited_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/recent");
  return { success: true };
}
