"use client";

import * as React from "react";
import { Search, Plus, Globe } from "lucide-react";
import { Website, Category } from "@/types/database";
import { WebsiteCard } from "./website-card";
import { WebsiteDialog } from "./website-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WebsiteGridProps {
  initialWebsites: Website[];
  categories: Category[];
  currentUserId?: string | null;
  isAdmin?: boolean;
  defaultScope?: "all" | "global" | "personal" | "favorites";
  defaultCategory?: string;
  hideFilters?: boolean;
  title?: string;
  description?: string;
}

export function WebsiteGrid({
  initialWebsites,
  categories,
  currentUserId,
  isAdmin = false,
  defaultScope = "all",
  defaultCategory = "all",
  hideFilters = false,
  title,
  description,
}: WebsiteGridProps) {
  const [websites, setWebsites] = React.useState<Website[]>(initialWebsites);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>(defaultCategory);
  const [selectedScope, setSelectedScope] = React.useState<string>(defaultScope);
  const [sortBy, setSortBy] = React.useState<string>("sort-order");

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingWebsite, setEditingWebsite] = React.useState<Website | null>(null);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter & Sort
  const filteredWebsites = React.useMemo(() => {
    let list = [...websites];

    // Search query filter
    if (debouncedQuery.trim().length > 0) {
      const q = debouncedQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(q);
        const urlMatch = item.url.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const catMatch = item.category?.name.toLowerCase().includes(q);
        return nameMatch || urlMatch || descMatch || catMatch;
      });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((item) => item.category_id === selectedCategory);
    }

    // Scope filter
    if (selectedScope === "global") {
      list = list.filter((item) => item.is_global);
    } else if (selectedScope === "personal") {
      list = list.filter((item) => !item.is_global);
    } else if (selectedScope === "favorites") {
      list = list.filter((item) => item.is_favorite);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name, "vi");
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name, "vi");
      }
      if (sortBy === "created-desc") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === "created-asc") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      // default: sort-order then featured then name
      if (a.is_featured !== b.is_featured) {
        return a.is_featured ? -1 : 1;
      }
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return a.name.localeCompare(b.name, "vi");
    });

    return list;
  }, [websites, debouncedQuery, selectedCategory, selectedScope, sortBy]);

  const handleEdit = (w: Website) => {
    setEditingWebsite(w);
    setDialogOpen(true);
  };

  const handleDeleted = (id: string) => {
    setWebsites((prev) => prev.filter((w) => w.id !== id));
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
      {/* Header with Title and Actions */}
      {(title || !hideFilters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {title && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              )}
            </div>
          )}

          <Button
            onClick={() => {
              setEditingWebsite(null);
              setDialogOpen(true);
            }}
            className="sm:self-end shrink-0"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Thêm website
          </Button>
        </div>
      )}

      {/* Search & Filter Bar */}
      {!hideFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card border rounded-xl p-3 shadow-2xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm website, link, từ khóa..."
              className="pl-9 h-9 text-sm"
            />
          </div>

          {/* Scope Filter */}
          <Select value={selectedScope} onValueChange={setSelectedScope}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Phạm vi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả website</SelectItem>
              <SelectItem value="favorites">Yêu thích</SelectItem>
              <SelectItem value="global">Hệ thống (Global)</SelectItem>
              <SelectItem value="personal">Cá nhân (Personal)</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 text-sm">
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

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sort-order">Mặc định / Nổi bật</SelectItem>
              <SelectItem value="name-asc">Tên (A → Z)</SelectItem>
              <SelectItem value="name-desc">Tên (Z → A)</SelectItem>
              <SelectItem value="created-desc">Mới thêm nhất</SelectItem>
              <SelectItem value="created-asc">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results Count & Active Filter indicator */}
      {!hideFilters && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Tìm thấy <strong className="text-foreground">{filteredWebsites.length}</strong> website
            {debouncedQuery && ` cho từ khóa "${debouncedQuery}"`}
          </span>
          {(debouncedQuery || selectedCategory !== "all" || selectedScope !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedScope("all");
              }}
              className="text-primary hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Website Cards Grid */}
      {filteredWebsites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredWebsites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed bg-muted/20 space-y-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Globe className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base">Không tìm thấy website nào</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {debouncedQuery
                ? `Không có kết quả nào phù hợp với "${debouncedQuery}". Thử từ khóa khác hoặc bỏ bộ lọc.`
                : "Chưa có website nào trong danh mục này. Hãy bắt đầu bằng cách thêm website đầu tiên của bạn."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingWebsite(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Thêm website ngay
          </Button>
        </div>
      )}

      {/* Website Modal Dialog */}
      <WebsiteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        initialData={editingWebsite}
        isAdmin={isAdmin}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
