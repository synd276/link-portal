import { Metadata } from "next";
import { getCurrentUser, getUserProfile, getUserSettings } from "@/lib/data";
import { SettingsView } from "@/components/settings/settings-view";

export const metadata: Metadata = {
  title: "Cài đặt tài khoản | Hệ thống quản lý đa chức năng",
  description: "Quản lý thông tin tài khoản và giao diện cá nhân",
};

export default async function SettingsPage() {
  const [user, profile, settings] = await Promise.all([
    getCurrentUser(),
    getUserProfile(),
    getUserSettings(),
  ]);

  return (
    <SettingsView
      profile={profile}
      settings={settings}
      userEmail={user?.email}
    />
  );
}
