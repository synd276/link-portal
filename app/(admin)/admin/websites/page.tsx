import { Metadata } from "next";
import { getWebsites, getCategories } from "@/lib/data";
import { AdminWebsitesTable } from "@/components/admin/admin-websites-table";

export const metadata: Metadata = {
  title: "Quản lý Website | Admin Link Portal",
  description: "Trang quản trị toàn bộ website hệ thống",
};

export default async function AdminWebsitesPage() {
  const [websites, categories] = await Promise.all([
    getWebsites({ limit: 100 }),
    getCategories(),
  ]);

  return (
    <AdminWebsitesTable
      initialWebsites={websites}
      categories={categories}
    />
  );
}
