import { Metadata } from "next";
import { getUserProfile, getCategories } from "@/lib/data";
import { CategoryList } from "@/components/categories/category-list";

export const metadata: Metadata = {
  title: "Danh mục | Hệ thống quản lý đa chức năng",
  description: "Quản lý danh mục website",
};

export default async function CategoriesPage() {
  const [profile, categories] = await Promise.all([
    getUserProfile(),
    getCategories(),
  ]);

  return (
    <CategoryList
      initialCategories={categories}
      currentUserId={profile?.id}
      isAdmin={profile?.role === "admin"}
    />
  );
}
