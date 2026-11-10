"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Shield,
  Plus,
  ArrowRight,
  Info,
} from "lucide-react";
import { Profile, Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth";
import { WebsiteDialog } from "@/components/websites/website-dialog";
import { IntroModal } from "@/components/home/intro-modal";

interface HomeHeaderProps {
  profile: Profile | null;
  categories: Category[];
  initialShowIntro?: boolean;
}

export function HomeHeader({
  profile,
  categories,
  initialShowIntro = false,
}: HomeHeaderProps) {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [introModalOpen, setIntroModalOpen] = React.useState(initialShowIntro);
  const isAdmin = profile?.role === "admin";

  return (
    <header className="border-b bg-background/90 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <Link href="/" className="flex items-center gap-3 min-w-0 group">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base sm:text-lg tracking-tight truncate text-foreground">
              Hệ thống quản lý đa chức năng
            </span>
          </div>
        </Link>

        {/* Right side navigation & user menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Nút Giới thiệu đem lên top menu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIntroModalOpen(true)}
            className="h-9 px-2.5 sm:px-3 text-xs gap-1.5 font-medium hover:bg-secondary hover:text-primary transition-colors"
            title="Giới thiệu về hệ thống"
          >
            <Info className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Giới thiệu</span>
          </Button>

          <ThemeToggle />

          {profile ? (
            /* Logged-in user state: hiện nút Thêm website cá nhân & menu */
            <div className="flex items-center gap-2">
              {/* Nút Thêm website cá nhân chỉ hiện khi đăng nhập */}
              <Button
                size="sm"
                onClick={() => setAddDialogOpen(true)}
                className="h-9 px-3 text-xs gap-1.5 font-semibold shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Thêm website cá nhân</span>
                <span className="sm:hidden">Thêm</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="hidden md:inline-flex h-9 text-xs gap-1.5 font-medium border-border"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                  <span>Dashboard</span>
                </Link>
              </Button>

              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ring-2 ring-primary/20">
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
                      <p className="text-sm font-semibold leading-none">{profile?.full_name || "Tài khoản"}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {isAdmin ? "Quản trị viên (Admin)" : "Thành viên"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Bảng điều khiển (Dashboard)
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" /> Cài đặt tài khoản
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4 text-emerald-600" /> Quản trị hệ thống
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
          ) : (
            /* Guest / Not logged in state: KHÔNG hiện nút Thêm website */
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="h-9 text-xs sm:text-sm">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild className="h-9 text-xs sm:text-sm font-semibold shadow-xs">
                <Link href="/register">
                  Đăng ký
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Intro Modal (được điều khiển bằng cookie lần đầu & nút Giới thiệu) */}
      <IntroModal
        open={introModalOpen}
        onOpenChange={setIntroModalOpen}
        isLoggedIn={Boolean(profile)}
      />

      {/* Website Dialog for adding website */}
      <WebsiteDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        categories={categories}
        isAdmin={isAdmin}
      />
    </header>
  );
}
