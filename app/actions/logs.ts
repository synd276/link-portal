"use server";

import { revalidatePath } from "next/cache";
import { checkIsAdmin } from "./admin";
import {
  getEventLogs,
  getEventLogStats,
  deleteEventLog,
  clearAllEventLogs,
  logAdminAction,
  FetchEventLogsOptions,
  FetchEventLogsResult,
} from "@/lib/logger";
import { EventLogStats } from "@/types/database";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function getEventLogsAction(
  options: FetchEventLogsOptions = {}
): Promise<ActionResult<FetchEventLogsResult>> {
  const { isAdmin } = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Bạn không có quyền truy cập nhật ký sự kiện." };
  }

  try {
    const result = await getEventLogs(options);
    return { success: true, data: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi khi tải nhật ký";
    return { success: false, error: message };
  }
}

export async function getEventLogStatsAction(): Promise<
  ActionResult<EventLogStats & { isTableReady: boolean }>
> {
  const { isAdmin } = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Bạn không có quyền truy cập thống kê." };
  }

  try {
    const stats = await getEventLogStats();
    return { success: true, data: stats };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi khi lấy thống kê";
    return { success: false, error: message };
  }
}

export async function deleteEventLogAction(id: string): Promise<ActionResult> {
  const { isAdmin } = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Bạn không có quyền xóa bản ghi nhật ký." };
  }

  try {
    await deleteEventLog(id);
    revalidatePath("/admin/logs");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi khi xóa bản ghi";
    return { success: false, error: message };
  }
}

export async function clearAllEventLogsAction(): Promise<ActionResult> {
  const { isAdmin, userId } = await checkIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Bạn không có quyền xóa toàn bộ nhật ký." };
  }

  try {
    await clearAllEventLogs();

    // Ghi lại sự kiện quản trị viên đã dọn sạch nhật ký
    await logAdminAction({
      action: "CLEAR_ALL_LOGS",
      message: "Quản trị viên đã xóa sạch toàn bộ lịch sử sự kiện hệ thống",
      level: "warn",
      userId,
    });

    revalidatePath("/admin/logs");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi khi xóa nhật ký";
    return { success: false, error: message };
  }
}

