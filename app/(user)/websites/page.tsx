import { Metadata } from "next";
import { Suspense } from "react";
import { getUserProfile, getCategories, getWebsites } from "@/lib/data";
import { WebsiteGrid } from "@/components/websites/website-grid";
import { WebsiteGridSkeleton } from "@/components/skeletons/user-skeletons";

export const metadata: Metadata = {
  title: "Tất cả website | Hệ thống quản lý đa chức năng",
  description: "Danh sách tất cả các website trên Hệ thống quản lý đa chức năng",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    scope?: "all" | "global" | "personal" | "favorites";
    sort?: "name-asc" | "name-desc" | "created-desc" | "created-asc" | "sort-order";
  }>;
}

async function AllWebsitesData({
  searchParamsPromise,
}: {
  searchParamsPromise: PageProps["searchParams"];
}) {
  const searchParams = await searchParamsPromise;
  const [profile, categories, websites] = await Promise.all([
    getUserProfile(),
    getCategories(),
    getWebsites({
      categoryId: searchParams.category,
      query: searchParams.q,
      scope: searchParams.scope,
      sortBy: searchParams.sort,
    }),
  ]);

  return (
    <WebsiteGrid
      initialWebsites={websites}
      categories={categories}
      currentUserId={profile?.id}
      isAdmin={profile?.role === "admin"}
      defaultCategory={searchParams.category || "all"}
      defaultScope={searchParams.scope || "all"}
      title="Tất cả website"
      description="Quản lý và tìm kiếm các website toàn hệ thống và cá nhân của bạn"
    />
  );
}

export default function AllWebsitesPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <WebsiteGridSkeleton
          title="Tất cả website"
          description="Quản lý và tìm kiếm các website toàn hệ thống và cá nhân của bạn"
        />
      }
    >
      <AllWebsitesData searchParamsPromise={props.searchParams} />
    </Suspense>
  );
}
