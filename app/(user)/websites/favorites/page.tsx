import { Metadata } from "next";
import { Suspense } from "react";
import { getUserProfile, getCategories, getWebsites } from "@/lib/data";
import { WebsiteGrid } from "@/components/websites/website-grid";
import { WebsiteGridSkeleton } from "@/components/skeletons/user-skeletons";

export const metadata: Metadata = {
  title: "Website yêu thích | Hệ thống quản lý đa chức năng",
  description: "Các website bạn đã đánh dấu yêu thích",
};

async function FavoriteWebsitesData() {
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

export default function FavoriteWebsitesPage() {
  return (
    <Suspense
      fallback={
        <WebsiteGridSkeleton
          title="Website yêu thích"
          description="Danh sách các website được bạn đánh dấu ưu tiên để truy cập nhanh chóng"
          showAddButton={false}
        />
      }
    >
      <FavoriteWebsitesData />
    </Suspense>
  );
}
