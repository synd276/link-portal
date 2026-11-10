import { cache } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  EventLog,
  EventLogLevel,
  EventLogCategory,
  EventLogStats,
} from "@/types/database";

// Fallback in-memory logs stored on globalThis to survive HMR in dev
declare global {
  var __LINK_PORTAL_LOGS__: EventLog[] | undefined;
}

export const DEFAULT_EVENT_LOGS: EventLog[] = [
  {
    id: "log-seed-001",
    level: "info",
    category: "system",
    action: "SYSTEM_INITIALIZED",
    entity_type: "system",
    entity_id: null,
    message: "Hệ thống LinkPortal khởi tạo và bắt đầu giám sát nhật ký",
    details: {
      version: "1.0.0",
      framework: "Next.js 16 App Router",
      environment: "production",
    },
    user_id: null,
    user_email: null,
    user_name: "Hệ thống",
    ip_address: "127.0.0.1",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "log-seed-002",
    level: "info",
    category: "admin_action",
    action: "CREATE_CATEGORY",
    entity_type: "category",
    entity_id: "11111111-1111-1111-1111-111111111101",
    message: "Quản trị viên đã tạo danh mục hệ thống: 'AI'",
    details: {
      name: "AI",
      description: "Các ứng dụng và mô hình trí tuệ nhân tạo thông minh",
      icon: "Bot",
      is_global: true,
      sort_order: 1,
    },
    user_id: null,
    user_email: "admin@linkportal.local",
    user_name: "Quản trị viên Hệ thống",
    ip_address: "192.168.1.10",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "log-seed-003",
    level: "info",
    category: "admin_action",
    action: "CREATE_WEBSITE",
    entity_type: "website",
    entity_id: "ai-001",
    message: "Quản trị viên đã thêm website hệ thống: 'CHATGPT'",
    details: {
      name: "CHATGPT",
      url: "https://chatgpt.com",
      is_global: true,
      is_featured: true,
      category: "AI",
    },
    user_id: null,
    user_email: "admin@linkportal.local",
    user_name: "Quản trị viên Hệ thống",
    ip_address: "192.168.1.10",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "log-seed-004",
    level: "warn",
    category: "admin_action",
    action: "UPDATE_WEBSITE",
    entity_type: "website",
    entity_id: "ai-002",
    message: "Quản trị viên đã cập nhật biểu tượng favicon cho website: 'CLAUDE AI'",
    details: {
      name: "CLAUDE AI",
      field_changed: "favicon_url",
      new_value: "https://claude.ai/favicon.ico",
    },
    user_id: null,
    user_email: "admin@linkportal.local",
    user_name: "Quản trị viên Hệ thống",
    ip_address: "192.168.1.10",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "log-seed-005",
    level: "error",
    category: "error",
    action: "URL_RESOLVE_FAILED",
    entity_type: "website",
    entity_id: null,
    message: "Lỗi kết nối kiểm tra tên miền không phản hồi khi thêm website",
    details: {
      target_url: "https://invalid-non-existent-domain-xyz.com",
      status_code: 504,
      error_code: "ENOTFOUND",
      stack: "Error: getaddrinfo ENOTFOUND invalid-non-existent-domain-xyz.com",
    },
    user_id: null,
    user_email: "editor@linkportal.local",
    user_name: "Biên tập viên",
    ip_address: "192.168.1.45",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "log-seed-006",
    level: "error",
    category: "error",
    action: "AUTH_LOGIN_FAILED",
    entity_type: "auth",
    entity_id: null,
    message: "Lỗi xác thực: Sai mật khẩu 3 lần liên tiếp cho tài khoản 'unknown_user@portal.vn'",
    details: {
      email: "unknown_user@portal.vn",
      attempt_count: 3,
      reason: "Invalid login credentials",
      security_action: "temporary_backoff",
    },
    user_id: null,
    user_email: "unknown_user@portal.vn",
    user_name: "Khách",
    ip_address: "113.161.42.19",
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: "log-seed-007",
    level: "warn",
    category: "admin_action",
    action: "UPDATE_USER_ROLE",
    entity_type: "user",
    entity_id: "usr-4921",
    message: "Quản trị viên đã nâng cấp vai trò người dùng 'Vũ Minh Trí' lên Quản trị viên (admin)",
    details: {
      target_user_id: "usr-4921",
      previous_role: "user",
      new_role: "admin",
    },
    user_id: null,
    user_email: "admin@linkportal.local",
    user_name: "Quản trị viên Hệ thống",
    ip_address: "192.168.1.10",
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "log-seed-008",
    level: "warn",
    category: "admin_action",
    action: "DELETE_WEBSITE",
    entity_type: "website",
    entity_id: "tmp-website-99",
    message: "Quản trị viên đã xóa website thử nghiệm 'Test Portal Demo'",
    details: {
      deleted_website_id: "tmp-website-99",
      name: "Test Portal Demo",
      url: "https://test.example.com",
    },
    user_id: null,
    user_email: "admin@linkportal.local",
    user_name: "Quản trị viên Hệ thống",
    ip_address: "192.168.1.10",
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "log-seed-009",
    level: "error",
    category: "error",
    action: "CLIENT_RUNTIME_ERROR",
    entity_type: "system",
    entity_id: null,
    message: "Lỗi giao diện client: Không thể phân tích cú pháp biểu tượng icon svg tùy chỉnh",
    details: {
      component: "CategoryDialog",
      error_message: "Cannot read properties of undefined (reading 'split')",
      url: "/categories",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/133.0",
    },
    user_id: null,
    user_email: "user@linkportal.local",
    user_name: "Người dùng",
    ip_address: "192.168.1.55",
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
];

function getInMemoryStore(): EventLog[] {
  if (!globalThis.__LINK_PORTAL_LOGS__) {
    globalThis.__LINK_PORTAL_LOGS__ = [...DEFAULT_EVENT_LOGS];
  }
  return globalThis.__LINK_PORTAL_LOGS__;
}

export interface RecordLogInput {
  level: EventLogLevel;
  category: EventLogCategory;
  action: string;
  message: string;
  entity_type?: string | null;
  entity_id?: string | null;
  details?: Record<string, unknown> | null;
  user_id?: string | null;
  user_email?: string | null;
  user_name?: string | null;
  ip_address?: string | null;
}

/**
 * Ghi nhận một sự kiện log mới vào hệ thống (lưu cả Database và bộ đệm in-memory)
 */
export async function recordEventLog(input: RecordLogInput): Promise<EventLog> {
  const newLog: EventLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    level: input.level,
    category: input.category,
    action: input.action.toUpperCase(),
    entity_type: input.entity_type || null,
    entity_id: input.entity_id || null,
    message: input.message,
    details: input.details || null,
    user_id: input.user_id || null,
    user_email: input.user_email || null,
    user_name: input.user_name || null,
    ip_address: input.ip_address || null,
    created_at: new Date().toISOString(),
  };

  // 1. Luôn lưu vào bộ đệm in-memory fallback
  const store = getInMemoryStore();
  store.unshift(newLog);
  if (store.length > 500) {
    store.pop();
  }

  // 2. Cố gắng ghi vào Supabase nếu cấu hình
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("event_logs")
        .insert({
          level: newLog.level,
          category: newLog.category,
          action: newLog.action,
          entity_type: newLog.entity_type,
          entity_id: newLog.entity_id,
          message: newLog.message,
          details: newLog.details,
          user_id: newLog.user_id,
          user_email: newLog.user_email,
          user_name: newLog.user_name,
          ip_address: newLog.ip_address,
        })
        .select()
        .single();

      if (!error && data) {
        newLog.id = data.id;
        newLog.created_at = data.created_at;
      }
    } catch {
      // Bỏ qua lỗi kết nối database để không làm gián đoạn luồng chính của ứng dụng
    }
  }

  return newLog;
}

/**
 * Ghi log hành động thêm / xóa / sửa của Quản trị viên
 */
export async function logAdminAction(params: {
  action: "CREATE_WEBSITE" | "UPDATE_WEBSITE" | "DELETE_WEBSITE" | "CREATE_CATEGORY" | "UPDATE_CATEGORY" | "DELETE_CATEGORY" | "UPDATE_USER_ROLE" | "DELETE_USER" | "UPDATE_SETTINGS" | string;
  message: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  level?: EventLogLevel;
  userId?: string;
  userEmail?: string;
  userName?: string;
  ipAddress?: string;
}) {
  return recordEventLog({
    level: params.level || (params.action.includes("DELETE") ? "warn" : "info"),
    category: "admin_action",
    action: params.action,
    message: params.message,
    entity_type: params.entityType || null,
    entity_id: params.entityId || null,
    details: params.details || null,
    user_id: params.userId || null,
    user_email: params.userEmail || null,
    user_name: params.userName || "Quản trị viên",
    ip_address: params.ipAddress || null,
  });
}

/**
 * Ghi nhận tất cả các lỗi trên website
 */
export async function logError(params: {
  action: string;
  message: string;
  details?: Record<string, unknown>;
  entityType?: string;
  entityId?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  ipAddress?: string;
}) {
  return recordEventLog({
    level: "error",
    category: "error",
    action: params.action,
    message: params.message,
    entity_type: params.entityType || "system",
    entity_id: params.entityId || null,
    details: params.details || null,
    user_id: params.userId || null,
    user_email: params.userEmail || null,
    user_name: params.userName || null,
    ip_address: params.ipAddress || null,
  });
}

export interface FetchEventLogsOptions {
  level?: string;
  category?: string;
  entityType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "oldest";
}

export interface FetchEventLogsResult {
  logs: EventLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isTableReady: boolean;
}

/**
 * Lấy danh sách nhật ký sự kiện có phân trang, lọc và tìm kiếm
 */
export const getEventLogs = cache(
  async (options: FetchEventLogsOptions = {}): Promise<FetchEventLogsResult> => {
    const {
      level = "all",
      category = "all",
      entityType = "all",
      search = "",
      page = 1,
      limit = 15,
      sortBy = "newest",
    } = options;

    const offset = (page - 1) * limit;

    // Thử truy vấn từ Supabase trước nếu cấu hình
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        let query = supabase
          .from("event_logs")
          .select("*", { count: "exact" });

        if (level && level !== "all") {
          query = query.eq("level", level);
        }
        if (category && category !== "all") {
          query = query.eq("category", category);
        }
        if (entityType && entityType !== "all") {
          query = query.eq("entity_type", entityType);
        }
        if (search.trim()) {
          const s = search.trim();
          query = query.or(
            `message.ilike.%${s}%,action.ilike.%${s}%,user_email.ilike.%${s}%,user_name.ilike.%${s}%`
          );
        }

        query = query.order("created_at", { ascending: sortBy === "oldest" });
        query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;

        if (!error && data !== null) {
          const totalCount = count || 0;
          return {
            logs: data as EventLog[],
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit) || 1,
            isTableReady: true,
          };
        }
      } catch {
        // Rơi xuống bộ đệm in-memory
      }
    }

    // Fallback in-memory
    const store = getInMemoryStore();
    const q = search.toLowerCase().trim();

    const filtered = store.filter((log) => {
      const matchLevel = level === "all" || log.level === level;
      const matchCategory = category === "all" || log.category === category;
      const matchEntity = entityType === "all" || log.entity_type === entityType;

      const matchSearch =
        !q ||
        log.message.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.user_name && log.user_name.toLowerCase().includes(q)) ||
        (log.user_email && log.user_email.toLowerCase().includes(q)) ||
        (log.entity_type && log.entity_type.toLowerCase().includes(q));

      return matchLevel && matchCategory && matchEntity && matchSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortBy === "oldest" ? timeA - timeB : timeB - timeA;
    });

    const paginated = sorted.slice(offset, offset + limit);

    return {
      logs: paginated,
      total: sorted.length,
      page,
      limit,
      totalPages: Math.ceil(sorted.length / limit) || 1,
      isTableReady: false,
    };
  }
);

/**
 * Lấy số liệu thống kê tổng hợp của Nhật ký sự kiện
 */
export const getEventLogStats = cache(
  async (): Promise<EventLogStats & { isTableReady: boolean }> => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const [
          { count: totalCount },
          { count: errorCount },
          { count: adminCount },
          { count: warnCount },
        ] = await Promise.all([
          supabase.from("event_logs").select("*", { count: "exact", head: true }),
          supabase.from("event_logs").select("*", { count: "exact", head: true }).eq("level", "error"),
          supabase.from("event_logs").select("*", { count: "exact", head: true }).eq("category", "admin_action"),
          supabase.from("event_logs").select("*", { count: "exact", head: true }).eq("level", "warn"),
        ]);

        if (totalCount !== null) {
          return {
            total: totalCount || 0,
            errors: errorCount || 0,
            adminActions: adminCount || 0,
            warnings: warnCount || 0,
            isTableReady: true,
          };
        }
      } catch {
        // Fallback
      }
    }

    const store = getInMemoryStore();
    return {
      total: store.length,
      errors: store.filter((l) => l.level === "error").length,
      adminActions: store.filter((l) => l.category === "admin_action").length,
      warnings: store.filter((l) => l.level === "warn").length,
      isTableReady: false,
    };
  }
);

/**
 * Xóa một bản ghi nhật ký
 */
export async function deleteEventLog(id: string): Promise<boolean> {
  const store = getInMemoryStore();
  const idx = store.findIndex((l) => l.id === id);
  if (idx !== -1) {
    store.splice(idx, 1);
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from("event_logs").delete().eq("id", id);
    } catch {
      // Ignored
    }
  }

  return true;
}

/**
 * Xóa toàn bộ nhật ký sự kiện
 */
export async function clearAllEventLogs(): Promise<boolean> {
  if (globalThis.__LINK_PORTAL_LOGS__) {
    globalThis.__LINK_PORTAL_LOGS__ = [];
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.from("event_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch {
      // Ignored
    }
  }

  return true;
}

