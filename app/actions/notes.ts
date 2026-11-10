"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { noteSchema } from "@/lib/validations";
import { UserNote } from "@/types/database";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function createNoteAction(values: unknown): Promise<ActionResult<UserNote>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const parsed = noteSchema.safeParse(values);
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

  const { data, error } = await supabase
    .from("user_notes")
    .insert({
      user_id: user.id,
      title: parsed.data.title.trim(),
      content: parsed.data.content?.trim() || "",
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true, data };
}

export async function updateNoteAction(
  id: string,
  values: unknown
): Promise<ActionResult<UserNote>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database chưa được cấu hình." };
  }

  const parsed = noteSchema.safeParse(values);
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

  const { data, error } = await supabase
    .from("user_notes")
    .update({
      title: parsed.data.title.trim(),
      content: parsed.data.content?.trim() || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true, data };
}

export async function deleteNoteAction(id: string): Promise<ActionResult> {
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

  const { error } = await supabase
    .from("user_notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true };
}
