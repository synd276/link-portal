import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { recordEventLog } from "@/lib/logger";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const userAgent = headersList.get("user-agent") || undefined;

    let userId: string | null = null;
    let userEmail: string | null = null;
    let userName: string | null = null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          userId = user.id;
          userEmail = user.email || null;
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
          userName = profile?.full_name || null;
        }
      } catch {
        // Ignored
      }
    }

    const level = body.level === "error" || body.level === "warn" ? body.level : "info";
    const category =
      body.category === "admin_action" ||
      body.category === "error" ||
      body.category === "auth"
        ? body.category
        : "system";

    const log = await recordEventLog({
      level,
      category,
      action: body.action || (level === "error" ? "CLIENT_ERROR" : "CLIENT_EVENT"),
      message: body.message || "Sự kiện được gửi từ trình duyệt người dùng",
      entity_type: body.entity_type || "system",
      entity_id: body.entity_id || null,
      details: {
        ...(body.details || {}),
        userAgent,
      },
      user_id: userId,
      user_email: userEmail,
      user_name: userName,
      ip_address: ipAddress,
    });

    return NextResponse.json({ success: true, log });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal logging error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
