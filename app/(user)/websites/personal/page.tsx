import { Metadata } from "next";
import { getUserProfile, getCategories, getWebsites } from "@/lib/data";
import { WebsiteGrid } from "@/components/websites/website-grid";

export const metadata: Metadata = {
  title: "Website cá nhân | Link Portal",
  description: "Các liên kết website do chính bạn tự thêm và quản lý",
};

export default async function PersonalWebsitesPage() {
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
