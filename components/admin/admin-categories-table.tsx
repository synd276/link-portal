"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Folder,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/types/database";
import { deleteCategoryAction } from "@/app/actions/categories";
import { formatDate } from "@/lib/utils";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminCategoriesTableProps {
  initialCategories: Category[];
}

export function AdminCategoriesTable({
  initialCategories,
}: AdminCategoriesTableProps) {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [search, setSearch] = React.useState("");
  const [scopeFilter, setScopeFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    return categories.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q);

      const matchScope =
        scopeFilter === "all" ||
        (scopeFilter === "global" && c.is_global) ||
        (scopeFilter === "personal" && !c.is_global);

      return matchSearch && matchScope;
    });
  }, [categories, search, scopeFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      toast.error("Có lỗi xảy ra khi xóa");
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
      return [saved, ...prev];
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quản lý Danh mục</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị danh mục hệ thống và danh mục cá nhân
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

      {/* Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card p-3 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên danh mục..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>

        <Select
          value={scopeFilter}
          onValueChange={(val) => {
            setScopeFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Phạm vi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            <SelectItem value="global">Hệ thống (Global)</SelectItem>
            <SelectItem value="personal">Cá nhân (Personal)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Tên danh mục</th>
                <th className="py-3 px-4">Mô tả</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Số website</th>
                <th className="py-3 px-4">Thứ tự</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                    <Folder className="h-4 w-4 text-primary shrink-0" />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                    {c.description || "—"}
                  </td>
                  <td className="py-3 px-4">
                    {c.is_global ? (
                      <Badge variant="outline" className="text-blue-600 border-blue-500/30 text-[11px]">
                        Global
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[11px]">
                        Personal
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold">
                    {c.website_count ?? 0}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono">{c.sort_order}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCategory(c);
                          setDialogOpen(true);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Sửa danh mục"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(c)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/20 text-xs text-muted-foreground">
          <span>
            Hiển thị <strong>{paginated.length}</strong> trên <strong>{filtered.length}</strong> danh mục (Trang {currentPage} / {totalPages})
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingCategory}
        isAdmin={true}
        onSuccess={handleSuccess}
      />

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{deleteTarget?.name}&quot;?
              Tất cả website thuộc danh mục này cũng sẽ bị xóa. Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
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
