"use client";

import * as React from "react";
import Link from "next/link";
import {
  Globe,
  Star,
  FolderTree,
  UserCheck,
  Sparkles,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  Website,
  Category,
  DashboardStats,
  Profile,
} from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebsiteCard } from "@/components/websites/website-card";
import { WebsiteDialog } from "@/components/websites/website-dialog";

interface DashboardViewProps {
  profile: Profile | null;
  stats: DashboardStats;
  categories: Category[];
  featuredWebsites: Website[];
  recentWebsites: Website[];
  favoriteWebsites: Website[];
  allWebsites: Website[];
}

export function DashboardView({
  profile,
  stats,
  categories,
  featuredWebsites,
  recentWebsites,
  favoriteWebsites,
  allWebsites,
}: DashboardViewProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingWebsite, setEditingWebsite] = React.useState<Website | null>(null);

  const isAdmin = profile?.role === "admin";
  const userName = profile?.full_name || "Bạn";

  // Current date formatted in Vietnamese
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleEdit = (w: Website) => {
    setEditingWebsite(w);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Xin chào, {userName}! 👋
            </h1>
          </div>
          <p className="text-sm text-muted-foreground capitalize">
            {currentDate}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditingWebsite(null);
              setDialogOpen(true);
            }}
            className="shadow-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Thêm website mới
          </Button>
        </div>
      </div>

      {/* 2. Key Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Tổng website</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalWebsites}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Yêu thích</p>
              <p className="text-2xl font-bold text-foreground">{stats.favoriteWebsites}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Star className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Danh mục</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalCategories}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FolderTree className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Website cá nhân</p>
              <p className="text-2xl font-bold text-foreground">{stats.personalWebsites}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Quick Access (Featured) */}
      {featuredWebsites.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold tracking-tight">Truy cập nhanh</h2>
            </div>
            <Link
              href="/websites"
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredWebsites.slice(0, 4).map((w) => (
              <WebsiteCard
                key={w.id}
                website={w}
                currentUserId={profile?.id}
                isAdmin={isAdmin}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Frequently Used / Favorites */}
      {favoriteWebsites.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-bold tracking-tight">Website yêu thích của bạn</h2>
            </div>
            <Link
              href="/websites/favorites"
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              Xem toàn bộ ({favoriteWebsites.length}) <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteWebsites.slice(0, 6).map((w) => (
              <WebsiteCard
                key={w.id}
                website={w}
                currentUserId={profile?.id}
                isAdmin={isAdmin}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Recently Added */}
      {recentWebsites.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Mới thêm gần đây</h2>
            <Link
              href="/websites?sort=created-desc"
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              Xem thêm <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentWebsites.slice(0, 6).map((w) => (
              <WebsiteCard
                key={w.id}
                website={w}
                currentUserId={profile?.id}
                isAdmin={isAdmin}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. All Websites Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Khám phá website</h2>
            <p className="text-xs text-muted-foreground">Tất cả website có sẵn trên hệ thống</p>
          </div>
          <Link
            href="/websites"
            className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            Mở rộng danh sách <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allWebsites.slice(0, 9).map((w) => (
            <WebsiteCard
              key={w.id}
              website={w}
              currentUserId={profile?.id}
              isAdmin={isAdmin}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </section>

      {/* Add / Edit Dialog */}
      <WebsiteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        initialData={editingWebsite}
        isAdmin={isAdmin}
      />
    </div>
  );
}
