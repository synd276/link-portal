import { Metadata } from "next";
import { getAdminStats, getWebsites, getAdminUsers } from "@/lib/data";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";

export const metadata: Metadata = {
  title: "Admin Dashboard | Link Portal",
  description: "Trang tổng quan quản trị Link Portal",
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
