import React from "react";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  getCurrentUser,
  getUserProfile,
  getUserSettings,
  getCategories,
  getUserNotes,
  getRecentVisits,
  getWebsites,
} from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isConfigured = isSupabaseConfigured();

  if (isConfigured) {
    const user = await getCurrentUser();
    if (!user) {
      redirect("/login");
    }
  }

  const [profile, settings, categories, notes, recentVisits, favoriteWebsites] =
    await Promise.all([
      getUserProfile(),
      getUserSettings(),
      getCategories(),
      getUserNotes(),
      getRecentVisits(10),
      getWebsites({ scope: "favorites" }),
    ]);

  return (
    <>
      {!isConfigured && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-800 dark:text-amber-300 px-4 py-2 text-xs flex items-center justify-center gap-2 text-center">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>Chưa cấu hình Supabase:</strong> Vui lòng cập nhật các biến môi trường{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> và <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> trong file <code>.env.local</code>.
          </span>
        </div>
      )}

      <MainLayoutWrapper
        profile={profile}
        settings={settings}
        categories={categories}
        notes={notes}
        recentVisits={recentVisits}
        favoriteWebsites={favoriteWebsites}
      >
        {children}
      </MainLayoutWrapper>
    </>
  );
}
