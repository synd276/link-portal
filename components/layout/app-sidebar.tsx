"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Globe,
  Star,
  UserCheck,
  FolderTree,
  Clock,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/database";
import { logoutAction } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppSidebarProps {
  profile: Profile | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  profile,
  collapsed,
  onToggleCollapse,
  onCloseMobile,
}: AppSidebarProps) {
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Tất cả website", href: "/websites", icon: Globe },
    { title: "Website yêu thích", href: "/websites/favorites", icon: Star },
    { title: "Website cá nhân", href: "/websites/personal", icon: UserCheck },
    { title: "Danh mục", href: "/categories", icon: FolderTree },
    { title: "Lịch sử truy cập", href: "/recent", icon: Clock },
    { title: "Cài đặt", href: "/settings", icon: Settings },
  ];

  const adminNavItems = [
    { title: "Tổng quan Admin", href: "/admin", icon: ShieldAlert },
    { title: "Quản lý Website", href: "/admin/websites", icon: Globe },
    { title: "Quản lý Danh mục", href: "/admin/categories", icon: FolderTree },
    { title: "Quản lý Người dùng", href: "/admin/users", icon: UserCheck },
    { title: "Cấu hình Hệ thống", href: "/admin/settings", icon: Settings },
  ];

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "h-full flex flex-col justify-between border-r bg-card transition-all duration-300 select-none",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col">
          <div className="h-16 flex items-center justify-between px-3.5 border-b">
            <Link
              href="/dashboard"
              onClick={handleLinkClick}
              className="flex items-center gap-2.5 overflow-hidden"
            >
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                <Compass className="h-5 w-5" />
              </div>
              {!collapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-bold text-base leading-tight tracking-tight">
                    Link Portal
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Quản lý liên kết
                  </span>
                </div>
              )}
            </Link>

            {/* Collapse toggle button on desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hidden lg:flex h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
              title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {!collapsed && (
              <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Chính
              </p>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    (item.href !== "/websites" && pathname.startsWith(item.href));

              const linkContent = (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="pt-4">
                  {!collapsed && (
                    <div className="flex items-center justify-between px-3 py-1">
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Quản trị (Admin)
                      </span>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-amber-500/40 text-amber-600 dark:text-amber-400">
                        ADMIN
                      </Badge>
                    </div>
                  )}
                  {collapsed && <div className="my-2 border-t" />}
                </div>

                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                  const adminLink = (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                        isActive
                          ? "bg-amber-500 text-white shadow-2xs font-semibold"
                          : "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{adminLink}</TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    );
                  }

                  return adminLink;
                })}
              </>
            )}
          </nav>
        </div>

        {/* Bottom: User Card & Logout */}
        <div className="p-3 border-t bg-card/60">
          <div
            className={cn(
              "flex items-center gap-3",
              collapsed ? "flex-col justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate text-foreground leading-tight">
                    {profile?.full_name || "Người dùng"}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {isAdmin ? "Quản trị viên" : "Thành viên"}
                  </p>
                </div>
              )}
            </div>

            <form action={logoutAction}>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Đăng xuất</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Đăng xuất</TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Đăng xuất</span>
                </Button>
              )}
            </form>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
