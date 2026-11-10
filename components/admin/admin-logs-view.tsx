"use client";

import * as React from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Download,
  AlertCircle,
  AlertTriangle,
  Info,
  Shield,
  Eye,
  Copy,
  Check,
  Code,
  Globe,
  FolderTree,
  User,
  Lock,
  ChevronLeft,
  ChevronRight,
  Database,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { EventLog, EventLogLevel, EventLogStats } from "@/types/database";
import {
  getEventLogsAction,
  getEventLogStatsAction,
  deleteEventLogAction,
  clearAllEventLogsAction,
} from "@/app/actions/logs";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminLogsViewProps {
  initialLogs: EventLog[];
  initialTotal: number;
  initialStats: EventLogStats;
  isTableReady: boolean;
}

export function AdminLogsView({
  initialLogs,
  initialTotal,
  initialStats,
  isTableReady: initialTableReady,
}: AdminLogsViewProps) {
  const [logs, setLogs] = React.useState<EventLog[]>(initialLogs);
  const [total, setTotal] = React.useState(initialTotal);
  const [stats, setStats] = React.useState<EventLogStats>(initialStats);
  const [isTableReady] = React.useState(initialTableReady);

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"all" | "error" | "admin_action" | "warn">("all");
  const [levelFilter, setLevelFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [entityFilter, setEntityFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isPending, startTransition] = React.useTransition();
  const isMounted = React.useRef(false);
  const pageSize = 15;

  const [selectedLog, setSelectedLog] = React.useState<EventLog | null>(null);
  const [copiedJson, setCopiedJson] = React.useState(false);
  const [copiedSql, setCopiedSql] = React.useState(false);

  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<EventLog | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const handleTabChange = (tab: "all" | "error" | "admin_action" | "warn") => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === "error") {
      setLevelFilter("error");
      setCategoryFilter("all");
    } else if (tab === "admin_action") {
      setLevelFilter("all");
      setCategoryFilter("admin_action");
    } else if (tab === "warn") {
      setLevelFilter("warn");
      setCategoryFilter("all");
    } else {
      setLevelFilter("all");
      setCategoryFilter("all");
    }
  };

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    startTransition(async () => {
      const res = await getEventLogsAction({
        search: debouncedSearch,
        level: levelFilter,
        category: categoryFilter,
        entityType: entityFilter,
        page: currentPage,
        limit: pageSize,
        sortBy,
      });

      if (res.success && res.data) {
        setLogs(res.data.logs);
        setTotal(res.data.total);
      }
    });
  }, [debouncedSearch, levelFilter, categoryFilter, entityFilter, currentPage, sortBy]);

  const handleManualRefresh = () => {
    startTransition(async () => {
      const [logsRes, statsRes] = await Promise.all([
        getEventLogsAction({
          search: debouncedSearch,
          level: levelFilter,
          category: categoryFilter,
          entityType: entityFilter,
          page: currentPage,
          limit: pageSize,
          sortBy,
        }),
        getEventLogStatsAction(),
      ]);

      if (logsRes.success && logsRes.data) {
        setLogs(logsRes.data.logs);
        setTotal(logsRes.data.total);
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      toast.success("Đã làm mới dữ liệu nhật ký");
    });
  };

  const handleExportJson = () => {
    try {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `event-logs-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Đã xuất tệp JSON thành công");
    } catch {
      toast.error("Không thể xuất tệp JSON");
    }
  };

  const handleExportCsv = () => {
    try {
      const headers = ["ID", "Thời gian", "Mức độ", "Phân loại", "Hành động", "Nội dung", "Tác nhân", "Email", "IP"];
      const rows = logs.map((l) => [
        l.id,
        `"${formatDateTime(l.created_at)}"`,
        l.level,
        l.category,
        `"${l.action}"`,
        `"${(l.message || "").replace(/"/g, '""')}"`,
        `"${l.user_name || "Hệ thống"}"`,
        `"${l.user_email || ""}"`,
        `"${l.ip_address || ""}"`,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", encodeURI(csvContent));
      downloadAnchor.setAttribute(
        "download",
        `event-logs-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Đã xuất tệp CSV thành công");
    } catch {
      toast.error("Không thể xuất tệp CSV");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteEventLogAction(deleteTarget.id);
      if (res.success) {
        toast.success("Đã xóa bản ghi nhật ký");
        setDeleteTarget(null);
        startTransition(async () => {
          const fresh = await getEventLogsAction({
            search: debouncedSearch,
            level: levelFilter,
            category: categoryFilter,
            entityType: entityFilter,
            page: currentPage,
            limit: pageSize,
            sortBy,
          });
          if (fresh.success && fresh.data) {
            setLogs(fresh.data.logs);
            setTotal(fresh.data.total);
          }
        });
      } else {
        toast.error(res.error || "Không thể xóa bản ghi nhật ký");
      }
    } catch {
      toast.error("Lỗi khi xóa bản ghi");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAllConfirm = async () => {
    setIsClearing(true);
    try {
      const res = await clearAllEventLogsAction();
      if (res.success) {
        toast.success("Đã xóa sạch toàn bộ lịch sử sự kiện");
        setClearDialogOpen(false);
        setLogs([]);
        setTotal(0);
        setStats({ total: 0, errors: 0, adminActions: 0, warnings: 0 });
      } else {
        toast.error(res.error || "Không thể xóa nhật ký");
      }
    } catch {
      toast.error("Lỗi khi xóa toàn bộ nhật ký");
    } finally {
      setIsClearing(false);
    }
  };

  const handleCopySql = () => {
    const sql = `-- Chạy lệnh này trong Supabase SQL Editor:
create table if not exists public.event_logs (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'info' check (level in ('info', 'warn', 'error')),
  category text not null default 'admin_action' check (category in ('admin_action', 'error', 'auth', 'system')),
  action text not null,
  entity_type text,
  entity_id text,
  message text not null,
  details jsonb,
  user_id uuid references auth.users on delete set null,
  user_email text,
  user_name text,
  ip_address text,
  created_at timestamptz not null default now()
);
create index if not exists idx_event_logs_created_at on public.event_logs(created_at desc);
create index if not exists idx_event_logs_level on public.event_logs(level);
create index if not exists idx_event_logs_category on public.event_logs(category);
alter table public.event_logs enable row level security;
create policy "event_logs_select_admin" on public.event_logs for select using (coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false));
create policy "event_logs_insert_all" on public.event_logs for insert with check (true);
create policy "event_logs_delete_admin" on public.event_logs for delete using (coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false));`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    toast.success("Đã sao chép mã SQL kích hoạt bảng event_logs");
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const renderLevelBadge = (level: EventLogLevel) => {
    switch (level) {
      case "error":
        return (
          <Badge variant="destructive" className="gap-1 font-mono text-[11px] px-2 py-0.5">
            <AlertCircle className="h-3 w-3" /> LỖI
          </Badge>
        );
      case "warn":
        return (
          <Badge variant="warning" className="gap-1 font-mono text-[11px] px-2 py-0.5">
            <AlertTriangle className="h-3 w-3" /> CẢNH BÁO
          </Badge>
        );
      case "info":
      default:
        return (
          <Badge variant="info" className="gap-1 font-mono text-[11px] px-2 py-0.5">
            <Info className="h-3 w-3" /> THÔNG TIN
          </Badge>
        );
    }
  };

  const renderEntityIcon = (entityType?: string | null) => {
    switch (entityType) {
      case "website":
        return <Globe className="h-3.5 w-3.5 text-blue-500" />;
      case "category":
        return <FolderTree className="h-3.5 w-3.5 text-emerald-500" />;
      case "user":
        return <User className="h-3.5 w-3.5 text-purple-500" />;
      case "auth":
        return <Lock className="h-3.5 w-3.5 text-amber-500" />;
      case "system":
      default:
        return <Terminal className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Nhật ký sự kiện (Event Log)
            </h1>
            <Badge variant="outline" className="text-xs px-2 py-0.5 border-primary/30 text-primary font-mono">
              AUDIT LOG
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi tất cả lỗi hệ thống và hành động thêm, xóa, sửa của quản trị viên
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isPending}
            className="h-9 gap-1.5 text-xs font-medium"
            title="Tải lại nhật ký"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin text-primary" : ""}`} />
            Làm mới
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-9 gap-1.5 text-xs font-medium"
            title="Xuất nhật ký ra file CSV"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="h-9 gap-1.5 text-xs font-medium"
            title="Xuất nhật ký ra file JSON"
          >
            <Code className="h-3.5 w-3.5" /> JSON
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setClearDialogOpen(true)}
            className="h-9 gap-1.5 text-xs font-medium"
            title="Xóa toàn bộ lịch sử sự kiện"
          >
            <Trash2 className="h-3.5 w-3.5" /> Xóa nhật ký
          </Button>
        </div>
      </div>

      {/* Notice Banner */}
      {!isTableReady && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-amber-700 dark:text-amber-300">
                Chế độ lưu tạm: Bảng `event_logs` chưa được kích hoạt trên Supabase
              </p>
              <p className="text-muted-foreground mt-0.5">
                Nhật ký đang hoạt động bình thường trên bộ đệm an toàn. Chạy file migration `supabase/migrations/20261110000002_create_event_logs.sql` để lưu trữ lâu dài.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySql}
            className="shrink-0 h-8 text-xs gap-1.5 border-amber-500/40 hover:bg-amber-500/10 text-amber-700 dark:text-amber-300"
          >
            {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedSql ? "Đã chép SQL" : "Sao chép SQL"}
          </Button>
        </div>
      )}

      {/* 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Tổng số sự kiện</p>
              <Terminal className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Tất cả các lỗi</p>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-destructive">{stats.errors}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Hành động Admin</p>
              <Shield className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {stats.adminActions}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Cảnh báo hệ thống</p>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-yellow-600 dark:text-yellow-400">
              {stats.warnings}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-3 bg-card p-3 rounded-xl border">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b text-xs font-medium">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Tất cả sự kiện ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("error")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "error"
                ? "bg-destructive text-destructive-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" /> Tất cả lỗi ({stats.errors})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("admin_action")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "admin_action"
                ? "bg-amber-500 text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> Thao tác Admin ({stats.adminActions})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("warn")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "warn"
                ? "bg-yellow-500 text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-yellow-500/10 hover:text-yellow-600"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Cảnh báo ({stats.warnings})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo nội dung, hành động, email..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Select
            value={levelFilter}
            onValueChange={(val) => {
              setLevelFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              <SelectItem value="error">Chỉ lỗi (Error)</SelectItem>
              <SelectItem value="warn">Cảnh báo (Warn)</SelectItem>
              <SelectItem value="info">Thông tin (Info)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={entityFilter}
            onValueChange={(val) => {
              setEntityFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Đối tượng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả đối tượng</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="category">Danh mục</SelectItem>
              <SelectItem value="user">Người dùng</SelectItem>
              <SelectItem value="auth">Xác thực</SelectItem>
              <SelectItem value="system">Hệ thống</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(val: "newest" | "oldest") => {
              setSortBy(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất trước</SelectItem>
              <SelectItem value="oldest">Cũ nhất trước</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Logs Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Mức độ</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Nội dung sự kiện</th>
                <th className="py-3 px-4">Tác nhân</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Terminal className="h-8 w-8 text-muted-foreground/60" />
                      <p className="font-semibold text-sm">Không tìm thấy sự kiện nào</p>
                      <p className="text-xs text-muted-foreground">
                        Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        {renderLevelBadge(log.level)}
                      </td>

                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-xs text-foreground">
                            {formatRelativeTime(log.created_at)}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {formatDateTime(log.created_at)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className="w-fit text-[10px] font-mono font-semibold px-1.5 py-0 bg-muted/40"
                          >
                            {log.action}
                          </Badge>
                          {log.entity_type && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground capitalize">
                              {renderEntityIcon(log.entity_type)}
                              {log.entity_type}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top max-w-md">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                            {log.message}
                          </p>
                          {log.details && (
                            <p className="text-[11px] text-muted-foreground font-mono truncate max-w-sm">
                              {typeof log.details === "object"
                                ? JSON.stringify(log.details)
                                : String(log.details)}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 rounded-md">
                            <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                              {log.user_name ? log.user_name.charAt(0).toUpperCase() : "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-foreground truncate max-w-[130px]">
                              {log.user_name || "Hệ thống"}
                            </span>
                            {log.user_email && (
                              <span className="text-[10px] text-muted-foreground truncate max-w-[130px]">
                                {log.user_email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td
                        className="py-3 px-4 align-top text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedLog(log)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Xem chi tiết sự kiện"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(log)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title="Xóa sự kiện này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Hiển thị <span className="font-semibold text-foreground">{logs.length}</span> trên tổng số{" "}
            <span className="font-semibold text-foreground">{total}</span> sự kiện
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isPending}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Trước
            </Button>
            <span className="text-xs font-medium px-2">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 text-xs gap-1"
            >
              Sau <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-2.5">
              {selectedLog && renderLevelBadge(selectedLog.level)}
              <DialogTitle className="text-lg font-bold">Chi tiết sự kiện nhật ký</DialogTitle>
            </div>
            <DialogDescription className="text-xs font-mono text-muted-foreground mt-1">
              ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-muted/40 border">
              <div>
                <p className="text-muted-foreground font-medium text-[11px]">Thời gian</p>
                <p className="font-semibold font-mono text-foreground mt-0.5">
                  {selectedLog ? formatDateTime(selectedLog.created_at) : ""}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground font-medium text-[11px]">Hành động</p>
                <p className="font-semibold font-mono text-foreground mt-0.5">
                  {selectedLog?.action}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground font-medium text-[11px]">Phân loại</p>
                <p className="font-semibold capitalize text-foreground mt-0.5">
                  {selectedLog?.category}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground font-medium text-[11px]">Đối tượng</p>
                <p className="font-semibold capitalize text-foreground mt-0.5">
                  {selectedLog?.entity_type || "Hệ thống"}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border space-y-2">
              <p className="font-semibold text-foreground text-xs">Thông tin tác nhân thực hiện</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Tên: </span>
                  <span className="font-medium text-foreground">
                    {selectedLog?.user_name || "Hệ thống"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span className="font-medium text-foreground">
                    {selectedLog?.user_email || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Địa chỉ IP: </span>
                  <span className="font-medium font-mono text-foreground">
                    {selectedLog?.ip_address || "127.0.0.1"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="font-semibold text-foreground text-xs">Nội dung chi tiết</p>
              <div className="p-3.5 rounded-xl bg-card border font-medium text-foreground text-xs leading-relaxed">
                {selectedLog?.message}
              </div>
            </div>

            {selectedLog?.details && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground text-xs">Dữ liệu đối tượng / Stack trace (JSON)</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedLog.details, null, 2));
                      setCopiedJson(true);
                      toast.success("Đã sao chép chi tiết JSON");
                      setTimeout(() => setCopiedJson(false), 2000);
                    }}
                    className="h-7 text-xs gap-1"
                  >
                    {copiedJson ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copiedJson ? "Đã chép" : "Sao chép JSON"}
                  </Button>
                </div>
                <pre className="p-4 rounded-xl bg-muted/60 border font-mono text-[11px] overflow-x-auto text-foreground max-h-60 whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <DialogFooter className="p-4 border-t bg-muted/20">
            <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)} className="text-xs">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Single Log Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Xác nhận xóa bản ghi nhật ký
            </DialogTitle>
            <DialogDescription className="text-xs mt-2">
              Bạn có chắc chắn muốn xóa bản ghi sự kiện này khỏi hệ thống? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-muted rounded-lg text-xs font-mono space-y-1">
            <p className="font-bold text-foreground">{deleteTarget?.action}</p>
            <p className="text-muted-foreground truncate">{deleteTarget?.message}</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="text-xs gap-1.5"
            >
              {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Logs Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Xóa toàn bộ lịch sử sự kiện?
            </DialogTitle>
            <DialogDescription className="text-xs mt-2">
              Hành động này sẽ xóa sạch toàn bộ các bản ghi nhật ký và lỗi trong hệ thống. Thao tác này sẽ được ghi nhận lại trong audit log mới.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              disabled={isClearing}
              onClick={() => setClearDialogOpen(false)}
              className="text-xs"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isClearing}
              onClick={handleClearAllConfirm}
              className="text-xs gap-1.5"
            >
              {isClearing ? "Đang xóa sạch..." : "Đồng ý xóa sạch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
