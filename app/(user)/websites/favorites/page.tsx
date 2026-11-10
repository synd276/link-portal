import { Metadata } from "next";
import { getUserProfile, getCategories, getWebsites } from "@/lib/data";
import { WebsiteGrid } from "@/components/websites/website-grid";

export const metadata: Metadata = {
  title: "Website yêu thích | Hệ thống quản lý đa chức năng",
  description: "Các website bạn đã đánh dấu yêu thích",
};

export default async function FavoriteWebsitesPage() {
  const [profile, categories, websites] = await Promise.all([
    getUserProfile(),
    getCategories(),
    getWebsites({ scope: "favorites" }),
  ]);

  return (
    <WebsiteGrid
      initialWebsites={websites}
      categories={categories}
      currentUserId={profile?.id}
      isAdmin={profile?.role === "admin"}
      defaultScope="favorites"
      title="Website yêu thích"
      description="Danh sách các website được bạn đánh dấu ưu tiên để truy cập nhanh chóng"
    />
  );
}
