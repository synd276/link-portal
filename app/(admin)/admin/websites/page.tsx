import { Metadata } from "next";
import { Suspense } from "react";
import { getWebsites, getCategories } from "@/lib/data";
import { AdminWebsitesTable } from "@/components/admin/admin-websites-table";
import { AdminWebsitesSkeleton } from "@/components/skeletons/admin-skeletons";

export const metadata: Metadata = {
  title: "Quản lý Website | Admin Hệ thống quản lý đa chức năng",
  description: "Trang quản trị toàn bộ website hệ thống",
};

async function AdminWebsitesData() {
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

export default function AdminWebsitesPage() {
  return (
    <Suspense fallback={<AdminWebsitesSkeleton />}>
      <AdminWebsitesData />
    </Suspense>
  );
}
