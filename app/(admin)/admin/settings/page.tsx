import { Metadata } from "next";
import { AdminSettingsView } from "@/components/admin/admin-settings-view";

export const metadata: Metadata = {
  title: "Cấu hình Hệ thống | Admin Link Portal",
  description: "Trang cấu hình kỹ thuật và bảo mật quản trị",
};

export default function AdminSettingsPage() {
  return <AdminSettingsView />;
}
