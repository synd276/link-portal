"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Profile } from "@/types/database";
import { AppSidebar } from "./app-sidebar";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  profile: Profile | null;
}

export function MobileNav({ open, onClose, profile }: MobileNavProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-64 max-w-[80vw] h-full bg-card shadow-xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
        <button
          onClick={onClose}
          className="absolute right-3 top-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground z-20"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Đóng</span>
        </button>

        <AppSidebar
          profile={profile}
          collapsed={false}
          onToggleCollapse={() => {}}
          onCloseMobile={onClose}
        />
      </div>
    </div>
  );
}
