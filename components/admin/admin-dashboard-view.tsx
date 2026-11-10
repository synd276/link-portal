"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Globe,
  FolderTree,
  ArrowRight,
  Plus,
  Lock,
  Sparkles,
  ScrollText,
} from "lucide-react";
import { AdminStats, Website, Profile } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDomainFromUrl, getFaviconUrl, formatDateTime } from "@/lib/utils";

interface AdminDashboardViewProps {
  stats: AdminStats;
  recentWebsites: Website[];
  recentUsers: Profile[];
}

export function AdminDashboardView({
  stats,
  recentWebsites,
  recentUsers,
}: AdminDashboardViewProps) {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Bảng điều khiển Quản trị viên
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng quan dữ liệu, người dùng và hệ thống liên kết toàn Hệ thống quản lý đa chức năng
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" asChild>
            <Link href="/admin/logs">
              <ScrollText className="mr-1.5 h-4 w-4" /> Nhật ký sự kiện
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/websites">
              <Plus className="mr-1.5 h-4 w-4" /> Thêm website hệ thống
            </Link>
          </Button>
        </div>
      </div>

      {/* 5 Stats Cards as specified in 3.4 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Tổng người dùng</p>
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Tổng website</p>
              <Globe className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold">{stats.totalWebsites}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Website hệ thống</p>
              <Sparkles className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold">{stats.globalWebsites}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Website cá nhân</p>
              <Lock className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{stats.personalWebsites}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Tổng danh mục</p>
              <FolderTree className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold">{stats.totalCategories}</p>
          </CardContent>
        </Card>
      </div>

      {/* Two tables: Recent Websites & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Websites */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Website mới thêm</CardTitle>
              <p className="text-xs text-muted-foreground">Các liên kết được cập nhật gần đây</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link href="/admin/websites">
                Quản lý <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentWebsites.slice(0, 5).map((w) => {
              const favicon = getFaviconUrl(w.url, w.favicon_url);
              return (
                <div key={w.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded bg-background p-1 flex items-center justify-center shrink-0 border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={favicon}
                        alt=""
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{w.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{getDomainFromUrl(w.url)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {w.is_global ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
                        Global
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Personal
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Người dùng mới đăng ký</CardTitle>
              <p className="text-xs text-muted-foreground">Tài khoản thành viên trên hệ thống</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1">
              <Link href="/admin/users">
                Quản lý <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUsers.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {u.full_name ? u.full_name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{u.full_name || "Chưa đặt tên"}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDateTime(u.created_at)}</p>
                  </div>
                </div>
                <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-[10px] capitalize">
                  {u.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

