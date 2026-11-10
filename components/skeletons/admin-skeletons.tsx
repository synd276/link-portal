import * as React from "react";
import { Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminWebsitesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quản lý Website</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị toàn bộ danh sách liên kết hệ thống và cá nhân
          </p>
        </div>

        <Button disabled className="shrink-0 opacity-80">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm website mới
        </Button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card p-3 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, liên kết, mô tả..."
            disabled
            className="pl-9 h-9"
          />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Website</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Nổi bật</th>
                <th className="py-3 px-4">Thứ tự</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <Skeleton className="h-4 w-36 sm:w-48" />
                        <Skeleton className="h-3 w-24 sm:w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-20 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-12 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-8" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminCategoriesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quản lý Danh mục</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị danh mục hệ thống và danh mục cá nhân
          </p>
        </div>

        <Button disabled className="shrink-0 opacity-80">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card p-3 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm theo tên danh mục..." disabled className="pl-9 h-9" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Biểu tượng</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Thứ tự</th>
                <th className="py-3 px-4">Số website</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </td>
                  <td className="py-3 px-4"><Skeleton className="h-6 w-6 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-6" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-12 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-7 w-7 rounded-md" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminUsersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quản lý Người dùng</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị tài khoản, kiểm tra thông tin và phân quyền vai trò người dùng
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card p-3 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm theo họ tên hoặc UUID..." disabled className="pl-9 h-9" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Người dùng</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">ID người dùng</th>
                <th className="py-3 px-4">Ngày tham gia</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-28 font-mono" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bảng điều khiển Quản trị viên
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng quan dữ liệu, người dùng và hệ thống liên kết toàn Hệ thống quản lý đa chức năng
          </p>
        </div>

        <Button disabled className="shrink-0 opacity-80">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm website hệ thống
        </Button>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
            <Skeleton className="h-7 w-14" />
          </div>
        ))}
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-7 rounded-md" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export function AdminLogsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Nhật ký sự kiện (Event Log)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi tất cả lỗi hệ thống và hành động thêm, xóa, sửa của quản trị viên
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-3 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm sự kiện, lỗi, hành động, email..." disabled className="pl-9 h-9" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Table */}
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
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="py-3 px-4"><Skeleton className="h-5 w-16 rounded-md" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-5 w-28 rounded-md" /></td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-64 sm:w-80" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3 px-4 text-right">
                    <Skeleton className="h-8 w-16 ml-auto rounded-md" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
