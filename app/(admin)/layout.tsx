import React from "react";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;

  if (isSupabaseConfigured()) {
    profile = await getUserProfile();
    if (!profile || profile.role !== "admin") {
      redirect("/dashboard?error=unauthorized");
    }
  }

  return (
    <AdminLayoutWrapper profile={profile}>
      {children}
    </AdminLayoutWrapper>
  );
}
