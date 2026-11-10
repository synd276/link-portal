"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Plus,
  PanelRightClose,
  PanelRightOpen,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { Profile, Category } from "@/types/database";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebsiteDialog } from "@/components/websites/website-dialog";
import { logoutAction } from "@/app/actions/auth";

interface AppHeaderProps {
  profile: Profile | null;
  categories: Category[];
  rightSidebarVisible: boolean;
  onToggleRightSidebar: () => void;
  onOpenMobileMenu: () => void;
}

export function AppHeader({
  profile,
  categories,
  rightSidebarVisible,
  onToggleRightSidebar,
  onOpenMobileMenu,
}: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = React.useState("");
  const [websiteDialogOpen, setWebsiteDialogOpen] = React.useState(false);

  const isAdmin = profile?.role === "admin";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/websites?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Determine breadcrumb
  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/websites") return "Tất cả website";
    if (pathname === "/websites/favorites") return "Website yêu thích";
    if (pathname === "/websites/personal") return "Website cá nhân";
    if (pathname === "/categories") return "Danh mục";
    if (pathname === "/recent") return "Lịch sử truy cập";
    if (pathname === "/settings") return "Cài đặt tài khoản";
    if (pathname === "/admin") return "Admin Dashboard";
    if (pathname === "/admin/websites") return "Admin / Quản lý Website";
    if (pathname === "/admin/categories") return "Admin / Quản lý Danh mục";
    if (pathname === "/admin/users") return "Admin / Quản lý Người dùng";
    if (pathname === "/admin/settings") return "Admin / Cấu hình Hệ thống";
    return "Hệ thống quản lý đa chức năng";
  };

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile menu button & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileMenu}
          className="lg:hidden h-9 w-9 text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mở menu</span>
        </Button>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <Link href="/dashboard" className="hover:text-foreground">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium text-foreground truncate max-w-[200px]">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Middle: Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm website hoặc nhấn Enter..."
            className="pl-9 h-9 w-full bg-muted/40 text-sm focus-visible:bg-background"
          />
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={() => setWebsiteDialogOpen(true)}
          className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Thêm website</span>
        </Button>

        <ThemeToggle />

        {/* Toggle Right Sidebar (Desktop only) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleRightSidebar}
          className="hidden xl:flex h-9 w-9 text-muted-foreground hover:text-foreground"
          title={rightSidebarVisible ? "Ẩn cột tiện ích" : "Hiện cột tiện ích"}
        >
          {rightSidebarVisible ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name || "Tài khoản"}</p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  Vai trò: {isAdmin ? "Quản trị viên" : "Người dùng"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" /> Thông tin tài khoản
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" /> Cài đặt giao diện
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <span className="mr-2 text-amber-500 font-bold">★</span> Quản trị hệ thống
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutAction()}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Add Website Dialog */}
      <WebsiteDialog
        open={websiteDialogOpen}
        onOpenChange={setWebsiteDialogOpen}
        categories={categories}
        isAdmin={isAdmin}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </header>
  );
}
