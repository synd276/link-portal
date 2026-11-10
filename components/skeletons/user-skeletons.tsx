import * as React from "react";
import { Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WebsiteGridSkeleton({
  title = "Tất cả website",
  description = "Quản lý và tìm kiếm các website toàn hệ thống và cá nhân của bạn",
  showAddButton = true,
}: {
  title?: string;
  description?: string;
  showAddButton?: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>

        {showAddButton && (
          <Button disabled className="shrink-0 opacity-80">
            <Plus className="mr-1.5 h-4 w-4" /> Thêm website
          </Button>
        )}
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card p-3 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm theo tên, URL, mô tả..." disabled className="pl-9 h-9" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      {/* Grid of Website Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-xs min-h-[160px] space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <Skeleton className="h-8 w-full rounded-md" />

            <div className="pt-2 border-t flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Danh mục website</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Phân loại website theo chủ đề và mục đích sử dụng
          </p>
        </div>

        <Button disabled className="shrink-0 opacity-80">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs min-h-[150px] space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <Skeleton className="h-6 w-full rounded-md" />

            <div className="pt-3 border-t flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentViewSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Lịch sử truy cập & Mới thêm</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Theo dõi các liên kết bạn đã mở gần đây và các website mới được thêm vào hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Skeleton className="h-5 w-5 rounded-md" />
            <h3 className="font-semibold text-base">Website truy cập gần nhất</h3>
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border bg-card gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Skeleton className="h-5 w-5 rounded-md" />
            <h3 className="font-semibold text-base">Website mới thêm vào hệ thống</h3>
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border bg-card gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardViewSkeleton() {
  return (
    <div className="space-y-8">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xin chào! 👋
          </h1>
          <Skeleton className="h-4 w-44" />
        </div>

        <Button disabled className="shrink-0 opacity-80">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm website
        </Button>
      </div>

      {/* 2. Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* 3. Featured Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border bg-card space-y-3 min-h-[140px]">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* 1. Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm website, ứng dụng, công cụ..." disabled className="pl-10 pr-9 h-10" />
        </div>
        <Button variant="outline" size="sm" disabled className="h-10 text-xs opacity-80">
          Bộ lọc danh mục
        </Button>
      </div>

      {/* 2. 3 Columns: AI, Đảng, Chính quyền */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1: AI */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border shadow-2xs">
            <div className="flex items-center gap-2.5 font-bold text-base text-foreground">
              <Skeleton className="h-5 w-5 rounded-md" />
              <span>AI</span>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-between p-4 rounded-xl border bg-card min-h-[145px] space-y-2">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Đảng */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border shadow-2xs">
            <div className="flex items-center gap-2.5 font-bold text-base text-foreground">
              <Skeleton className="h-5 w-5 rounded-md" />
              <span>Đảng</span>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-between p-4 rounded-xl border bg-card min-h-[145px] space-y-2">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Chính quyền */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border shadow-2xs">
            <div className="flex items-center gap-2.5 font-bold text-base text-foreground">
              <Skeleton className="h-5 w-5 rounded-md" />
              <span>Chính quyền</span>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-between p-4 rounded-xl border bg-card min-h-[145px] space-y-2">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
