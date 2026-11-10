import { Metadata } from "next";
import { getUserProfile, getCategories, getWebsites } from "@/lib/data";
import { WebsiteGrid } from "@/components/websites/website-grid";

export const metadata: Metadata = {
  title: "Tất cả website | Link Portal",
  description: "Danh sách tất cả các website trên Link Portal",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    scope?: "all" | "global" | "personal" | "favorites";
    sort?: "name-asc" | "name-desc" | "created-desc" | "created-asc" | "sort-order";
  }>;
}

export default async function AllWebsitesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const [profile, categories, websites] = await Promise.all([
    getUserProfile(),
    getCategories(),
    getWebsites({
      categoryId: searchParams.category,
      query: searchParams.q,
      scope: searchParams.scope,
      sortBy: searchParams.sort,
    }),
  ]);

  return (
    <WebsiteGrid
      initialWebsites={websites}
      categories={categories}
      currentUserId={profile?.id}
      isAdmin={profile?.role === "admin"}
      defaultCategory={searchParams.category || "all"}
      defaultScope={searchParams.scope || "all"}
      title="Tất cả website"
      description="Quản lý và tìm kiếm các website toàn hệ thống và cá nhân của bạn"
    />
  );
}
