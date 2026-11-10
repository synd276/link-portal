import { Metadata } from "next";
import { Suspense } from "react";
import { getUserProfile, getCategories } from "@/lib/data";
import { CategoryList } from "@/components/categories/category-list";
import { CategoryListSkeleton } from "@/components/skeletons/user-skeletons";

export const metadata: Metadata = {
  title: "Danh mục | Hệ thống quản lý đa chức năng",
  description: "Phân loại website theo danh mục",
};

async function CategoriesData() {
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

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoryListSkeleton />}>
      <CategoriesData />
    </Suspense>
  );
}
