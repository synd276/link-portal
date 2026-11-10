"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Website, Category } from "@/types/database";
import { deleteWebsiteAction } from "@/app/actions/websites";
import { getDomainFromUrl, getFaviconUrl, formatDate } from "@/lib/utils";
import { WebsiteDialog } from "@/components/websites/website-dialog";
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

interface AdminWebsitesTableProps {
  initialWebsites: Website[];
  categories: Category[];
}

export function AdminWebsitesTable({
  initialWebsites,
  categories,
}: AdminWebsitesTableProps) {
  const [websites, setWebsites] = React.useState<Website[]>(initialWebsites);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [scopeFilter, setScopeFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 150);
    return () => clearTimeout(timer);
  }, [search]);
  const pageSize = 10;

  // Dialogs
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingWebsite, setEditingWebsite] = React.useState<Website | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Website | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Filtered
  const filtered = React.useMemo(() => {
    return websites.filter((w) => {
      const q = debouncedSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.url.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q);

      const matchCat =
        categoryFilter === "all" || w.category_id === categoryFilter;

      const matchScope =
        scopeFilter === "all" ||
        (scopeFilter === "global" && w.is_global) ||
        (scopeFilter === "personal" && !w.is_global);

      return matchSearch && matchCat && matchScope;
    });
  }, [websites, debouncedSearch, categoryFilter, scopeFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteWebsiteAction(deleteTarget.id);
      if (!res.success) {
        toast.error(res.error || "Không thể xóa website");
      } else {
        toast.success(`Đã xóa website "${deleteTarget.name}"`);
        setWebsites((prev) => prev.filter((w) => w.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xóa");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccess = (saved: Website) => {
    setWebsites((prev) => {
      const idx = prev.findIndex((w) => w.id === saved.id);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quản lý Website</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị toàn bộ danh sách liên kết hệ thống và cá nhân
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingWebsite(null);
            setDialogOpen(true);
          }}
          className="shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Thêm website mới
        </Button>
      </div>

      {/* Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card p-3 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, liên kết, mô tả..."
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
            <SelectItem value="all">Tất cả phạm vi</SelectItem>
            <SelectItem value="global">Hệ thống (Global)</SelectItem>
            <SelectItem value="personal">Cá nhân (Personal)</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(val) => {
            setCategoryFilter(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Website</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Nổi bật</th>
                <th className="py-3 px-4">Thứ tự</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((w) => {
                const domain = getDomainFromUrl(w.url);
                const favicon = getFaviconUrl(w.url, w.favicon_url);

                return (
                  <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-muted/60 p-1 flex items-center justify-center shrink-0 border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={favicon}
                            alt=""
                            className="h-full w-full object-contain"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-xs">{w.name}</p>
                          <a
                            href={w.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 truncate max-w-xs"
                          >
                            {domain} <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {w.category ? (
                        <Badge variant="secondary" className="font-normal text-xs">
                          {w.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {w.is_global ? (
                        <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-[11px]">
                          Global
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[11px]">
                          Personal
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {w.is_featured ? (
                        <Badge variant="default" className="text-[10px] bg-amber-500 hover:bg-amber-600">
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">{w.sort_order}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {formatDate(w.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingWebsite(w);
                            setDialogOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Sửa website"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(w)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Xóa website"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy website nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/20 text-xs text-muted-foreground">
          <span>
            Hiển thị <strong>{paginated.length}</strong> trên <strong>{filtered.length}</strong> website (Trang {currentPage} / {totalPages})
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

      {/* Website Dialog */}
      <WebsiteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        initialData={editingWebsite}
        isAdmin={true}
        onSuccess={handleSuccess}
      />

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa website</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa &quot;{deleteTarget?.name}&quot;? Thao tác này sẽ xóa vĩnh viễn dữ liệu liên kết khỏi hệ thống.
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
