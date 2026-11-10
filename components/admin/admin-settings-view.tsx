"use client";

import * as React from "react";
import { ShieldCheck, Database, Server, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminSettingsView() {
  const [copiedSql, setCopiedSql] = React.useState(false);

  const adminSqlHelper = `-- Chạy câu lệnh SQL này trong Supabase SQL Editor để thăng cấp tài khoản đầu tiên thành Admin:
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com');`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(adminSqlHelper);
    setCopiedSql(true);
    toast.success("Đã sao chép câu lệnh SQL vào clipboard");
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Cấu hình Hệ thống</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Thông tin cấu hình hạ tầng, trạng thái cơ sở dữ liệu và bảo mật
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Cơ sở dữ liệu</p>
              <p className="text-sm font-bold text-foreground">Supabase PostgreSQL</p>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 mt-1">
                Đang hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Row Level Security</p>
              <p className="text-sm font-bold text-foreground">RLS Bật toàn diện</p>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 mt-1">
                8 / 8 Bảng bảo vệ
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Framework & Kiến trúc</p>
              <p className="text-sm font-bold text-foreground">Next.js App Router</p>
              <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-500/30 mt-1">
                Server Components
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chính sách bảo mật cơ sở dữ liệu (RLS)</CardTitle>
          <CardDescription>
            Kiểm tra trạng thái các bảng được áp dụng Row Level Security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">profiles</p>
                <p className="text-muted-foreground">Chống leo thang đặc quyền (anti-privilege escalation)</p>
              </div>
              <Badge variant="success">Bảo vệ</Badge>
            </div>

            <div className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">websites</p>
                <p className="text-muted-foreground">Admin quản lý Global, User quản lý Personal</p>
              </div>
              <Badge variant="success">Bảo vệ</Badge>
            </div>

            <div className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">categories</p>
                <p className="text-muted-foreground">Phân tách danh mục hệ thống và cá nhân</p>
              </div>
              <Badge variant="success">Bảo vệ</Badge>
            </div>

            <div className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">user_favorites</p>
                <p className="text-muted-foreground">Chỉ truy cập danh sách yêu thích của chính mình</p>
              </div>
              <Badge variant="success">Bảo vệ</Badge>
            </div>

            <div className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">user_visits</p>
                <p className="text-muted-foreground">Lịch sử truy cập riêng tư từng người dùng</p>
              </div>
              <Badge variant="success">Bảo vệ</Badge>
            </div>

            <div className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">user_settings & notes</p>
                <p className="text-muted-foreground">Ghi chú và tùy chọn cá nhân được mã hóa</p>
              </div>
              <Badge variant="success">Bảo vệ</Badge>
            </div>

            <div className="p-3 border rounded-lg bg-muted/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">event_logs</p>
                <p className="text-muted-foreground">Nhật ký sự kiện, theo dõi lỗi và thao tác admin</p>
              </div>
              <Badge variant="success">Bảo vệ</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SQL Thăng cấp Quản trị viên</CardTitle>
              <CardDescription>
                Câu lệnh SQL trực tiếp an toàn trong Supabase SQL Editor
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopySql} className="text-xs gap-1.5">
              {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedSql ? "Đã chép" : "Sao chép SQL"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="p-4 rounded-xl bg-muted/50 border font-mono text-xs overflow-x-auto text-foreground/90 whitespace-pre">
            {adminSqlHelper}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

