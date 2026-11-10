"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Profile } from "@/types/database";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  profile: Profile | null;
}

export function AdminLayoutWrapper({
  children,
  profile,
}: AdminLayoutWrapperProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Admin Sidebar Desktop */}
      <div className="hidden lg:block h-full shrink-0">
        <AppSidebar
          profile={profile}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        profile={profile}
      />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 h-8 text-xs font-medium"
            >
              <Link href="/dashboard" prefetch={true}>
                <ArrowLeft className="h-3.5 w-3.5" /> Về trang người dùng
              </Link>
            </Button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                Cổng quản trị Hệ thống quản lý đa chức năng
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
