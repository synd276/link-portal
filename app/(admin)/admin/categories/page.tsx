import { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { AdminCategoriesTable } from "@/components/admin/admin-categories-table";

export const metadata: Metadata = {
  title: "Quản lý Danh mục | Admin Link Portal",
  description: "Trang quản trị danh mục toàn hệ thống",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <AdminCategoriesTable initialCategories={categories} />;
}
