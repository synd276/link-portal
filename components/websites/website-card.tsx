"use client";

import * as React from "react";
import Image from "next/image";
import {
  ExternalLink,
  Star,
  MoreVertical,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Website } from "@/types/database";
import { getDomainFromUrl, getFaviconUrl } from "@/lib/utils";
import { toggleFavoriteAction, recordVisitAction, deleteWebsiteAction } from "@/app/actions/websites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WebsiteCardProps {
  website: Website;
  currentUserId?: string | null;
  isAdmin?: boolean;
  onEdit?: (website: Website) => void;
  onDeleted?: (id: string) => void;
}

export function WebsiteCard({
  website,
  currentUserId,
  isAdmin = false,
  onEdit,
  onDeleted,
}: WebsiteCardProps) {
  const [isFav, setIsFav] = React.useState(Boolean(website.is_favorite));
  const [isFavLoading, setIsFavLoading] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const domain = getDomainFromUrl(website.url);
  const faviconSrc = getFaviconUrl(website.url, website.favicon_url);

  const canManage =
    isAdmin ||
    (!website.is_global && website.user_id && website.user_id === currentUserId);

  const handleOpenWebsite = async (e: React.MouseEvent) => {
    // Record visit in background
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

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteWebsiteAction(website.id);
      if (!res.success) {
        toast.error(res.error || "Không thể xóa website");
      } else {
        toast.success(`Đã xóa website "${website.name}"`);
        setDeleteDialogOpen(false);
        if (onDeleted) onDeleted(website.id);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between rounded-xl border bg-card p-4 text-card-foreground shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5">
        {/* Top bar: Favicon, Title, Domain, Actions */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-muted/40 p-1 flex items-center justify-center">
                {!imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={faviconSrc}
                    alt={website.name}
                    className="h-full w-full object-contain"
                    onError={() => setImgError(true)}
                    loading="lazy"
                  />
                ) : (
                  <Globe className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenWebsite}
                  className="font-semibold text-foreground hover:text-primary transition-colors text-sm truncate block group-hover:underline"
                  title={website.name}
                >
                  {website.name}
                </a>
                <p className="text-xs text-muted-foreground truncate" title={domain}>
                  {domain}
                </p>
              </div>
            </div>

            {/* Favorite & Menu */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleToggleFavorite}
                disabled={isFavLoading}
                aria-label={isFav ? "Bỏ yêu thích" : "Yêu thích"}
                className={`p-1.5 rounded-md transition-colors ${
                  isFav
                    ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                    : "text-muted-foreground/60 hover:text-amber-500 hover:bg-muted"
                }`}
              >
                <Star
                  className={`h-4 w-4 ${isFav ? "fill-amber-500" : ""}`}
                />
              </button>

              {canManage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Thao tác</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(website)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa website
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Description */}
          {website.description && (
            <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {website.description}
            </p>
          )}
        </div>

        {/* Footer: Category badge & Open button */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {website.category && (
              <Badge variant="secondary" className="text-[11px] font-normal px-2 py-0">
                {website.category.name}
              </Badge>
            )}

            {website.is_global ? (
              <Badge variant="outline" className="text-[10px] text-blue-600 dark:text-blue-400 border-blue-500/30 px-1.5 py-0">
                Toàn hệ thống
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-muted-foreground px-1.5 py-0 flex items-center gap-1">
                <Lock className="h-2.5 w-2.5" /> Cá nhân
              </Badge>
            )}
          </div>

          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOpenWebsite}
            className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium shrink-0"
          >
            Mở <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa website</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa website &quot;{website.name}&quot;? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...
                </>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
