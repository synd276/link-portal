import { Metadata } from "next";
import { getAdminStats, getWebsites, getAdminUsers } from "@/lib/data";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

export const metadata: Metadata = {
  title: "Admin Dashboard | Hệ thống quản lý đa chức năng",
  description: "Trang tổng quan quản trị Hệ thống quản lý đa chức năng",
};

export default async function AdminDashboardPage() {
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
