import { Metadata } from "next";
import { Suspense } from "react";
import { getUserProfile, getCategories, getWebsites } from "@/lib/data";
import { WebsiteGrid } from "@/components/websites/website-grid";
import { WebsiteGridSkeleton } from "@/components/skeletons/user-skeletons";

export const metadata: Metadata = {
  title: "Website cá nhân | Hệ thống quản lý đa chức năng",
  description: "Các liên kết website do chính bạn tự thêm và quản lý",
};

async function PersonalWebsitesData() {
  const [profile, categories, websites] = await Promise.all([
    getUserProfile(),
    getCategories(),
    getWebsites({ scope: "personal" }),
  ]);

  return (
    <WebsiteGrid
      initialWebsites={websites}
      categories={categories}
      currentUserId={profile?.id}
      isAdmin={profile?.role === "admin"}
      defaultScope="personal"
      title="Website cá nhân"
      description="Kho liên kết riêng tư do bạn quản lý. Chỉ tài khoản của bạn mới có quyền xem và chỉnh sửa."
    />
  );
}

export default function PersonalWebsitesPage() {
  return (
    <Suspense
      fallback={
        <WebsiteGridSkeleton
          title="Website cá nhân"
          description="Kho liên kết riêng tư do bạn quản lý. Chỉ tài khoản của bạn mới có quyền xem và chỉnh sửa."
        />
      }
    >
      <PersonalWebsitesData />
    </Suspense>
  );
}
