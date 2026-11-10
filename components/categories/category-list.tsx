"use client";

import * as React from "react";
import Link from "next/link";
import { Folder, Plus, MoreVertical, Pencil, Trash2, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/types/database";
import { deleteCategoryAction } from "@/app/actions/categories";
import { CategoryDialog } from "./category-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface CategoryListProps {
  initialCategories: Category[];
  currentUserId?: string | null;
  isAdmin?: boolean;
}

export function CategoryList({
  initialCategories,
  currentUserId,
  isAdmin = false,
}: CategoryListProps) {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(deleteTarget.id);
      if (!res.success) {
        toast.error(res.error || "Không thể xóa danh mục");
      } else {
        toast.success(`Đã xóa danh mục "${deleteTarget.name}"`);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xóa danh mục");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccess = (saved: Category) => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...saved };
        return next;
      }
      return [...prev, saved];
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Danh mục website</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Phân loại website theo chủ đề và mục đích sử dụng
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
          className="shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const canManage =
            isAdmin || (!cat.is_global && cat.user_id === currentUserId);

          return (
            <div
              key={cat.id}
              className="group relative flex flex-col justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/40"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {cat.is_global ? (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-1.5 py-0">
                            Toàn hệ thống
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground px-1.5 py-0 flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" /> Cá nhân
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {cat.website_count ?? 0} website
                        </span>
                      </div>
                    </div>
                  </div>

                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Thao tác</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => handleEdit(cat)}>
                          <Pencil className="mr-2 h-4 w-4" /> Sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(cat)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {cat.description && (
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Thứ tự: {cat.sort_order}
                </span>

                <Link
                  href={`/websites?category=${cat.id}`}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                >
                  Xem website <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed bg-muted/20 space-y-3">
          <Folder className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-base">Chưa có danh mục nào</h3>
          <p className="text-sm text-muted-foreground">
            Hãy tạo danh mục đầu tiên để bắt đầu phân loại website.
          </p>
          <Button
            size="sm"
            onClick={() => {
              setEditingCategory(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Thêm danh mục
          </Button>
        </div>
      )}

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingCategory}
        isAdmin={isAdmin}
        onSuccess={handleSuccess}
      />

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục &quot;{deleteTarget?.name}&quot;?
              Các website thuộc danh mục này cũng sẽ bị xóa. Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
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
    </div>
  );
}
