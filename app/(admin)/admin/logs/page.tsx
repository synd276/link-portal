import { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getEventLogs, getEventLogStats } from "@/lib/data";
import { AdminLogsView } from "@/components/admin/admin-logs-view";
import { AdminLogsSkeleton } from "@/components/skeletons/admin-skeletons";

export const metadata: Metadata = {
  title: "Nhật ký sự kiện (Event Log) | Admin Hệ thống quản lý đa chức năng",
  description: "Trang nhật ký sự kiện, kiểm tra lỗi hệ thống và lịch sử thêm xóa sửa của quản trị viên",
};

async function AdminLogsData() {
  // Với Next.js 16 Cache Components, gọi await connection() để trì hoãn lấy dữ liệu sự kiện
  // đến thời điểm có request thực tế, tương thích hoàn toàn với Suspense và không chặn prerender.
  await connection();

  const [logsResult, statsResult] = await Promise.all([
    getEventLogs({ page: 1, limit: 15, sortBy: "newest" }),
    getEventLogStats(),
  ]);

  return (
    <AdminLogsView
      initialLogs={logsResult.logs}
      initialTotal={logsResult.total}
      initialStats={statsResult}
      isTableReady={logsResult.isTableReady}
    />
  );
}

export default function AdminLogsPage() {
  return (
    <Suspense fallback={<AdminLogsSkeleton />}>
      <AdminLogsData />
    </Suspense>
  );
}
