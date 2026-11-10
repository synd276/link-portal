import React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-muted/30">
      <header className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Compass className="h-5 w-5" />
          </div>
          <span>Link Portal</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card border rounded-2xl shadow-sm p-6 sm:p-8">
          {children}
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
        © 2026 Link Portal. Nền tảng quản lý liên kết tập trung.
      </footer>
    </div>
  );
}
