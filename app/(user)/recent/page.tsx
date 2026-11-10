import { Metadata } from "next";
import { getRecentVisits, getWebsites } from "@/lib/data";
import { RecentView } from "@/components/recent/recent-view";

export const metadata: Metadata = {
  title: "Lịch sử truy cập | Link Portal",
  description: "Các website truy cập gần đây và website mới thêm",
};

export default async function RecentPage() {
  const [visits, recentAdded] = await Promise.all([
    getRecentVisits(15),
    getWebsites({ limit: 10, sortBy: "created-desc" }),
  ]);

  return <RecentView visits={visits} recentAdded={recentAdded} />;
}
