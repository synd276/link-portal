"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
      <div className="h-16 w-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Đã xảy ra sự cố</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        Hệ thống gặp lỗi khi tải trang này. Bạn có thể thử lại hoặc quay về bảng điều khiển chính.
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={() => reset()} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" /> Thử lại
        </Button>
        <Button asChild className="gap-2">
          <Link href="/dashboard">
            <Home className="h-4 w-4" /> Về Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
