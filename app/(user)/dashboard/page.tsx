import { Metadata } from "next";
import {
  getUserProfile,
  getDashboardStats,
  getCategories,
  getWebsites,
} from "@/lib/data";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard | Hệ thống quản lý đa chức năng",
  description: "Trang tổng quan Hệ thống quản lý đa chức năng",
};

export default async function DashboardPage() {
  const [profile, stats, categories, allWebsites, recentWebsites, favoriteWebsites] =
    await Promise.all([
      getUserProfile(),
      getDashboardStats(),
      getCategories(),
      getWebsites({ limit: 12 }),
      getWebsites({ limit: 6, sortBy: "created-desc" }),
      getWebsites({ scope: "favorites", limit: 6 }),
    ]);

  const featuredWebsites = allWebsites.filter((w) => w.is_featured);

  return (
    <DashboardView
      profile={profile}
      stats={stats}
      categories={categories}
      featuredWebsites={featuredWebsites}
      recentWebsites={recentWebsites}
      favoriteWebsites={favoriteWebsites}
      allWebsites={allWebsites}
    />
  );
}
