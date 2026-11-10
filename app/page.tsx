import Link from "next/link";
import { redirect } from "next/navigation";
import { Compass, ShieldCheck, Zap, LayoutGrid, Bookmark, ArrowRight } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Link Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                Bắt đầu ngay
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 sm:py-28 text-center max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
            <Zap className="h-3.5 w-3.5" />
            Nền tảng quản lý liên kết tập trung thế hệ mới
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Quản lý & truy cập mọi website của bạn tại một nơi
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Link Portal giúp bạn lưu trữ, phân loại danh mục, đánh dấu yêu thích và tìm kiếm nhanh chóng các website quan trọng cho công việc và học tập.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base shadow-md" asChild>
              <Link href="/register">
                Tạo tài khoản miễn phí
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/login">
                Đăng nhập hệ thống
              </Link>
            </Button>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 bg-muted/40 border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Bố cục 3 cột hiện đại</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Trải nghiệm SaaS chuẩn mực với thanh điều hướng bên trái, lưới website trung tâm và thanh tiện ích ghi chú nhanh bên phải.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Bookmark className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Phân loại & Yêu thích</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tự động đồng bộ website toàn hệ thống (Global) kết hợp với kho liên kết cá nhân (Personal) bảo mật riêng tư.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border shadow-xs space-y-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Bảo mật cấp cơ sở dữ liệu</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Supabase Row Level Security (RLS) bảo vệ từng liên kết, xác thực quyền Admin an toàn và phân quyền người dùng chặt chẽ.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Compass className="h-4 w-4 text-primary" />
            <span>Link Portal</span>
          </div>
          <p>© 2026 Link Portal. Xây dựng với Next.js, Supabase & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
