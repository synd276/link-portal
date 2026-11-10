"use client";

import * as React from "react";
import {
  ExternalLink,
  Star,
  Globe,
  Bot,
  Building2,
  Landmark,
  Shield,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Website } from "@/types/database";
import { recordVisitAction, toggleFavoriteAction } from "@/app/actions/websites";

interface SimpleWebsiteCardProps {
  website: Website;
  currentUserId?: string | null;
  isAdmin?: boolean;
}

export function SimpleWebsiteCard({
  website,
  currentUserId,
  isAdmin = false,
}: SimpleWebsiteCardProps) {
  const [isFav, setIsFav] = React.useState(Boolean(website.is_favorite));
  const [isFavLoading, setIsFavLoading] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  // Fallback category icon
  const getCategoryIcon = () => {
    const catName = website.category?.name || "";
    if (catName.includes("AI") || website.category_id === "11111111-1111-1111-1111-111111111101") {
      return <Bot className="h-6 w-6 text-primary" />;
    }
    if (catName.includes("Đảng") || website.category_id === "11111111-1111-1111-1111-111111111102") {
      return <Star className="h-6 w-6 text-amber-500 fill-amber-500/20" />;
    }
    return <Building2 className="h-6 w-6 text-primary" />;
  };

  const handleOpenWebsite = () => {
    recordVisitAction(website.id).catch(() => {});
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) {
      toast.info("Vui lòng đăng nhập để lưu website yêu thích");
      return;
    }

    const previousFav = isFav;
    setIsFav(!previousFav);
    setIsFavLoading(true);

    try {
      const res = await toggleFavoriteAction(website.id);
      if (!res.success) {
        setIsFav(previousFav);
        toast.error(res.error || "Không thể cập nhật yêu thích");
      } else {
        toast.success(
          res.data?.isFavorite
            ? `Đã thêm "${website.name}" vào yêu thích`
            : `Đã xóa "${website.name}" khỏi yêu thích`
        );
      }
    } catch {
      setIsFav(previousFav);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsFavLoading(false);
    }
  };

  const faviconSrc =
    website.favicon_url ||
    `https://www.google.com/s2/favicons?domain=${new URL(website.url).hostname}&sz=128`;

  return (
    <a
      href={website.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleOpenWebsite}
      className="group relative flex flex-col items-center justify-between p-4 rounded-xl border border-border bg-card shadow-2xs hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 min-h-[145px] text-center"
      title={`${website.name} - Nhấn để mở`}
    >
      {/* Favorite button */}
      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={isFavLoading}
        aria-label={isFav ? "Bỏ yêu thích" : "Yêu thích"}
        className={`absolute top-2 right-2 p-1.5 rounded-md transition-colors z-10 ${
          isFav
            ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
            : "text-muted-foreground/40 hover:text-amber-500 hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
        }`}
      >
        <Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-500" : ""}`} />
      </button>

      {/* Centered Image or Icon */}
      <div className="w-full flex justify-center pt-1">
        <div className="h-14 w-14 rounded-full border border-primary/20 bg-primary/5 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:border-primary/50 transition-all">
          {!imgError && faviconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={faviconSrc}
              alt={website.name}
              className="h-full w-full object-contain rounded-full"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            getCategoryIcon()
          )}
        </div>
      </div>

      {/* Title */}
      <div className="w-full mt-2.5 flex-1 flex items-center justify-center">
        <h4 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors text-center line-clamp-3 leading-snug tracking-tight uppercase">
          {website.name}
        </h4>
      </div>

      {/* Subtle indicator */}
      <div className="w-full pt-1.5 flex items-center justify-center text-[10px] text-muted-foreground/70 group-hover:text-primary transition-colors">
        <span className="truncate max-w-[150px]">
          {new URL(website.url).hostname.replace("www.", "")}
        </span>
        <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </a>
  );
}
