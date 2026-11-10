import { Metadata } from "next";
import { Suspense } from "react";
import { getCategories } from "@/lib/data";
import { AdminCategoriesTable } from "@/components/admin/admin-categories-table";
import { AdminCategoriesSkeleton } from "@/components/skeletons/admin-skeletons";

export const metadata: Metadata = {
  title: "Quản lý Danh mục | Admin Hệ thống quản lý đa chức năng",
  description: "Trang quản trị danh mục toàn hệ thống",
};

async function AdminCategoriesData() {
  const categories = await getCategories();
  return <AdminCategoriesTable initialCategories={categories} />;
}

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<AdminCategoriesSkeleton />}>
      <AdminCategoriesData />
    </Suspense>
  );
}
