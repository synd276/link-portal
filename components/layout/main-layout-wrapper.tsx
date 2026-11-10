"use client";

import * as React from "react";
import { Profile, Category, UserSettings, UserNote, Website } from "@/types/database";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { RightSidebar } from "./right-sidebar";
import { MobileNav } from "./mobile-nav";
import { updateUserSettingsAction } from "@/app/actions/settings";

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  profile: Profile | null;
  settings: UserSettings | null;
  categories: Category[];
  notes: UserNote[];
  recentVisits: { id: string; visited_at: string; website: Website }[];
  favoriteWebsites: Website[];
}

export function MainLayoutWrapper({
  children,
  profile,
  settings,
  categories,
  notes,
  recentVisits,
  favoriteWebsites,
}: MainLayoutWrapperProps) {
  const [collapsed, setCollapsed] = React.useState(
    settings?.sidebar_collapsed ?? false
  );
  const [rightSidebarVisible, setRightSidebarVisible] = React.useState(
    settings?.right_sidebar_visible ?? true
  );
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleToggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    updateUserSettingsAction({ sidebar_collapsed: next }).catch(() => {});
  };

  const handleToggleRightSidebar = () => {
    const next = !rightSidebarVisible;
    setRightSidebarVisible(next);
    updateUserSettingsAction({ right_sidebar_visible: next }).catch(() => {});
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <div className="hidden lg:block h-full shrink-0">
        <AppSidebar
          profile={profile}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        profile={profile}
      />

      {/* 2. CENTER CONTENT */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <AppHeader
          profile={profile}
          categories={categories}
          rightSidebarVisible={rightSidebarVisible}
          onToggleRightSidebar={handleToggleRightSidebar}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* 3. RIGHT SIDEBAR (Desktop XL) */}
      <div className="hidden xl:block h-full">
        <RightSidebar
          initialNotes={notes}
          recentVisits={recentVisits}
          favoriteWebsites={favoriteWebsites}
          visible={rightSidebarVisible}
          onClose={handleToggleRightSidebar}
        />
      </div>
    </div>
  );
}
