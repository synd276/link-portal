import { Metadata } from "next";
import { Suspense } from "react";
import { getAdminStats, getWebsites, getAdminUsers } from "@/lib/data";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { AdminDashboardSkeleton } from "@/components/skeletons/admin-skeletons";

export const metadata: Metadata = {
  title: "Admin Dashboard | Hệ thống quản lý đa chức năng",
  description: "Trang tổng quan quản trị Hệ thống quản lý đa chức năng",
};

async function AdminDashboardData() {
  const [stats, websites, users] = await Promise.all([
    getAdminStats(),
    getWebsites({ limit: 10, sortBy: "created-desc" }),
    getAdminUsers(),
  ]);

  return (
    <AdminDashboardView
      stats={stats}
      recentWebsites={websites}
      recentUsers={users}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardData />
    </Suspense>
  );
}
