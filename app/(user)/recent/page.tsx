import { Metadata } from "next";
import { Suspense } from "react";
import { getRecentVisits, getWebsites } from "@/lib/data";
import { RecentView } from "@/components/recent/recent-view";
import { RecentViewSkeleton } from "@/components/skeletons/user-skeletons";

export const metadata: Metadata = {
  title: "Lịch sử truy cập | Hệ thống quản lý đa chức năng",
  description: "Các website đã truy cập gần đây và website mới thêm",
};

async function RecentData() {
  const [visits, recentWebsites] = await Promise.all([
    getRecentVisits(20),
    getWebsites({ limit: 10, sortBy: "created-desc" }),
  ]);

  return <RecentView visits={visits} recentAdded={recentWebsites} />;
}

export default function RecentPage() {
  return (
    <Suspense fallback={<RecentViewSkeleton />}>
      <RecentData />
    </Suspense>
  );
}
