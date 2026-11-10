"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  Zap,
    Sparkles,
  Layers,
  Star,
  Search,
    ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const INTRO_COOKIE_NAME = "system_intro_visited";

export function getIntroCookie(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${INTRO_COOKIE_NAME}=([^;]+)`));
  return match ? match[1] === "true" || match[1] === "1" : false;
}

export function setIntroCookie(): void {
  if (typeof document === "undefined") return;
  const maxAge = 365 * 24 * 60 * 60; // 1 năm tính theo giây
  document.cookie = `${INTRO_COOKIE_NAME}=true; max-age=${maxAge}; path=/; SameSite=Lax`;
}

interface IntroModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoggedIn?: boolean;
  defaultOpen?: boolean;
}

export function IntroModal({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  isLoggedIn = false,
  defaultOpen = false,
}: IntroModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // Kiểm tra cookie ở phía client trong trường hợp chưa có cookie
  React.useEffect(() => {
    try {
      const hasVisited = getIntroCookie();
      if (!hasVisited && !isControlled) {
        const timer = setTimeout(() => {
          setInternalOpen(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      // Bỏ qua nếu môi trường không hỗ trợ document.cookie
    }
  }, [isControlled]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      // Đánh dấu cookie khi đóng modal
      try {
        setIntroCookie();
      } catch {}
    }
    if (isControlled && setControlledOpen) {
      setControlledOpen(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
  };

  const handleDismiss = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="text-center sm:text-left space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-xs">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 mb-1">
                <Sparkles className="h-3 w-3" />
                Chào mừng bạn
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Hệ thống quản lý đa chức năng
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
            Nền tảng quản lý liên kết và điều hướng trực tuyến tập trung. Giúp bạn lưu trữ, phân loại khoa học và truy cập nhanh chóng mọi website phục vụ cho học tập, nghiên cứu và công việc.
          </DialogDescription>
        </DialogHeader>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3">
          <div className="p-3.5 rounded-xl border bg-secondary/40 space-y-1.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
              <span>Kho website cấu hình sẵn</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tích hợp sẵn các công cụ AI, cơ quan Đảng và hệ thống chuyên ngành chính quyền.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-secondary/40 space-y-1.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Search className="h-4 w-4" />
              </div>
              <span>Tìm kiếm & Lọc tức thì</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tìm theo từ khóa, lọc theo 3 cột lớn AI - Đảng - Chính quyền chỉ với một thao tác.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-secondary/40 space-y-1.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Star className="h-4 w-4" />
              </div>
              <span>Cá nhân hóa & Yêu thích</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Đánh dấu website yêu thích và thêm liên kết cá nhân không giới hạn khi đăng nhập.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-secondary/40 space-y-1.5 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
              <span>Truy cập 1-Click tiện lợi</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mở ngay mọi ứng dụng chuyên ngành, cổng dịch vụ công và công cụ AI chỉ với 1 cú nhấp chuột không cần nhớ địa chỉ web.
            </p>
          </div>
        </div>

        {/* Tip section */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3 text-xs text-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {isLoggedIn
              ? "Bạn đã đăng nhập thành công. Bạn có thể thêm website cá nhân hoặc đánh dấu sao để lưu vào mục Yêu thích."
              : "Bạn có thể duyệt tất cả website ngay trên trang chủ. Đăng nhập để kích hoạt tính năng lưu Yêu thích và thêm website riêng."}
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2 pt-2">
          {!isLoggedIn && (
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto text-xs"
              onClick={handleDismiss}
            >
              <Link href="/login">Đăng nhập tài khoản</Link>
            </Button>
          )}

          <Button
            onClick={handleDismiss}
            className="w-full sm:w-auto text-xs font-semibold shadow-xs"
          >
            Bắt đầu khám phá ngay
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
