"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { UserSettings } from "@/types/database";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function updateUserSettingsAction(
  settings: Partial<Pick<UserSettings, "theme" | "sidebar_collapsed" | "right_sidebar_visible" | "layout_config">>
): Promise<ActionResult<UserSettings>> {
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

  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: user.id,
      ...settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, data };
}
