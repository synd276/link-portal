"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Bot,
  Building2,
  Star,
  Tags,
  ChevronDown,
  ChevronUp,
  Globe,
  X,
} from "lucide-react";
import { Website, Category } from "@/types/database";
import { SimpleWebsiteCard } from "@/components/websites/simple-website-card";
import { WebsiteDialog } from "@/components/websites/website-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HomeViewProps {
  initialWebsites: Website[];
  categories: Category[];
  currentUserId?: string | null;
  isAdmin?: boolean;
}

export function HomeView({
  initialWebsites,
  categories,
  currentUserId,
  isAdmin = false,
}: HomeViewProps) {
  const [websites, setWebsites] = React.useState<Website[]>(initialWebsites);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const [tagsCollapsed, setTagsCollapsed] = React.useState<boolean>(true); // Collapsed by default
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Keep in sync with server data
  const [prevInitial, setPrevInitial] = React.useState(initialWebsites);
  if (prevInitial !== initialWebsites) {
    setPrevInitial(initialWebsites);
    setWebsites(initialWebsites);
  }

  // Group websites into 3 columns: AI, Đảng, Chính quyền
  const { aiWebsites, dangWebsites, chinhQuyenWebsites } = React.useMemo(() => {
    const ai: Website[] = [];
    const dang: Website[] = [];
    const chinhQuyen: Website[] = [];

    const isMatch = (item: Website) => {
      if (!debouncedQuery.trim()) return true;
      const q = debouncedQuery.toLowerCase().trim();
      const nameMatch = item.name.toLowerCase().includes(q);
      const urlMatch = item.url.toLowerCase().includes(q);
      const descMatch = (item.description || "").toLowerCase().includes(q);
      return nameMatch || urlMatch || descMatch;
    };

    websites.forEach((w) => {
      if (!isMatch(w)) return;

      const catName = (w.category?.name || "").toLowerCase();
      const catId = w.category_id || "";

      if (
        catName === "ai" ||
        catName.includes("ai") ||
        catName.includes("trí tuệ nhân tạo") ||
        catId === "11111111-1111-1111-1111-111111111101" ||
        w.id.startsWith("ai-")
      ) {
        ai.push(w);
      } else if (
        catName === "đảng" ||
        catName.includes("đảng") ||
        catId === "11111111-1111-1111-1111-111111111102" ||
        w.id.startsWith("dang-")
      ) {
        dang.push(w);
      } else {
        // Mặc định hoặc Chính quyền / Chuyên ngành
        chinhQuyen.push(w);
      }
    });

    return {
      aiWebsites: ai,
      dangWebsites: dang,
      chinhQuyenWebsites: chinhQuyen,
    };
  }, [websites, debouncedQuery]);

  const totalFiltered =
    aiWebsites.length + dangWebsites.length + chinhQuyenWebsites.length;

  const handleWebsiteSuccess = (saved: Website) => {
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
      {/* 1. Toolbar: Search Bar, Collapse Tag Filter Toggle, và Nút Thêm website (chỉ khi đăng nhập) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm website, ứng dụng, công cụ..."
            className="pl-10 pr-9 h-10 text-sm bg-card border-border shadow-2xs focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Nút collapse/expand bộ lọc tag */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTagsCollapsed(!tagsCollapsed)}
            className={`h-10 text-xs gap-1.5 font-medium border-border transition-colors ${
              !tagsCollapsed || selectedTag !== "all"
                ? "bg-secondary text-primary border-primary/30"
                : "bg-card"
            }`}
          >
            <Tags className="h-3.5 w-3.5 text-primary" />
            <span>Bộ lọc danh mục</span>
            {selectedTag !== "all" && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 bg-primary text-primary-foreground">
                1
              </Badge>
            )}
            {tagsCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
            )}
          </Button>

          {/* NÚT 'THÊM WEBSITE CÁ NHÂN' - CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP */}
          {currentUserId && (
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="h-10 text-xs gap-1.5 font-semibold shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm website cá nhân</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Collapsible Tag Filters: Bấm để mở rộng / thu gọn */}
      {!tagsCollapsed && (
        <div className="p-3 rounded-xl border border-border bg-card/60 backdrop-blur-xs space-y-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="font-medium">Lọc theo mục:</span>
            {selectedTag !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className="text-primary hover:underline font-medium text-[11px]"
              >
                Đặt lại (Hiển thị tất cả 3 cột)
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTag === "all"
                  ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              Tất cả 3 cột ({totalFiltered})
            </button>

            <button
              type="button"
              onClick={() => setSelectedTag("ai")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTag === "ai"
                  ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Ứng dụng AI ({aiWebsites.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTag("dang")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTag === "dang"
                  ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Hệ thống Đảng ({dangWebsites.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTag("chinhquyen")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTag === "chinhquyen"
                  ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Chính quyền & Chuyên ngành ({chinhQuyenWebsites.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Search Results Summary */}
      {debouncedQuery && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Tìm thấy <strong className="text-foreground">{totalFiltered}</strong> kết quả cho từ khóa &quot;{debouncedQuery}&quot;
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-primary hover:underline font-medium"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}

      {/* 4. CHIA DANH SÁCH THÀNH 3 CỘT: AI, ĐẢNG, CHÍNH QUYỀN */}
      {totalFiltered > 0 ? (
        <div
          className={`grid gap-6 items-start ${
            selectedTag === "all"
              ? "grid-cols-1 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {/* CỘT 1: 🤖 ỨNG DỤNG AI */}
          {(selectedTag === "all" || selectedTag === "ai") && (
            <section className="flex flex-col rounded-2xl border border-border bg-card/40 backdrop-blur-xs p-4 sm:p-5 space-y-4 shadow-2xs">
              {/* Header Cột AI */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm sm:text-base tracking-tight text-foreground uppercase">
                      Ứng dụng AI
                    </h2>
                    <p className="text-[11px] text-muted-foreground">Trí tuệ nhân tạo & Trợ lý thông minh</p>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs px-2 py-0.5 border-primary/30 text-primary font-semibold">
                  {aiWebsites.length}
                </Badge>
              </div>

              {/* Lưới card AI đơn giản */}
              {aiWebsites.length > 0 ? (
                <div
                  className={`grid gap-3 ${
                    selectedTag === "ai"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {aiWebsites.map((website) => (
                    <SimpleWebsiteCard
                      key={website.id}
                      website={website}
                      currentUserId={currentUserId}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Không có kết quả AI nào phù hợp.
                </p>
              )}
            </section>
          )}

          {/* CỘT 2: ⭐ HỆ THỐNG ĐẢNG */}
          {(selectedTag === "all" || selectedTag === "dang") && (
            <section className="flex flex-col rounded-2xl border border-border bg-card/40 backdrop-blur-xs p-4 sm:p-5 space-y-4 shadow-2xs">
              {/* Header Cột Đảng */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Star className="h-5 w-5 fill-amber-500" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm sm:text-base tracking-tight text-foreground uppercase">
                      Hệ thống Đảng
                    </h2>
                    <p className="text-[11px] text-muted-foreground">Cơ quan, báo chí & văn kiện Đảng</p>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-500/30 text-amber-600 font-semibold">
                  {dangWebsites.length}
                </Badge>
              </div>

              {/* Lưới card Đảng đơn giản */}
              {dangWebsites.length > 0 ? (
                <div
                  className={`grid gap-3 ${
                    selectedTag === "dang"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {dangWebsites.map((website) => (
                    <SimpleWebsiteCard
                      key={website.id}
                      website={website}
                      currentUserId={currentUserId}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Không có kết quả cơ quan Đảng nào phù hợp.
                </p>
              )}
            </section>
          )}

          {/* CỘT 3: 🏢 CHÍNH QUYỀN & CHUYÊN NGÀNH */}
          {(selectedTag === "all" || selectedTag === "chinhquyen") && (
            <section className="flex flex-col rounded-2xl border border-border bg-card/40 backdrop-blur-xs p-4 sm:p-5 space-y-4 shadow-2xs">
              {/* Header Cột Chính quyền */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm sm:text-base tracking-tight text-foreground uppercase">
                      Chính quyền
                    </h2>
                    <p className="text-[11px] text-muted-foreground">Ứng dụng chuyên ngành & Cơ quan nhà nước</p>
                  </div>
                </div>

                <Badge variant="outline" className="text-xs px-2 py-0.5 border-primary/30 text-primary font-semibold">
                  {chinhQuyenWebsites.length}
                </Badge>
              </div>

              {/* Lưới card Chính quyền đơn giản (tất cả các website từ gate.ttcntnmt.com.vn) */}
              {chinhQuyenWebsites.length > 0 ? (
                <div
                  className={`grid gap-3 ${
                    selectedTag === "chinhquyen"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {chinhQuyenWebsites.map((website) => (
                    <SimpleWebsiteCard
                      key={website.id}
                      website={website}
                      currentUserId={currentUserId}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Không có kết quả ứng dụng chuyên ngành nào phù hợp.
                </p>
              )}
            </section>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 space-y-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Globe className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base">Không tìm thấy website nào</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Không có kết quả nào phù hợp với &quot;{debouncedQuery}&quot;. Hãy thử từ khóa khác hoặc xóa tìm kiếm.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedTag("all");
            }}
          >
            Hiển thị lại toàn bộ website
          </Button>
        </div>
      )}

      {/* Website Dialog for adding website from HomeView (chỉ mở khi đăng nhập) */}
      <WebsiteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        isAdmin={isAdmin}
        onSuccess={handleWebsiteSuccess}
      />
    </div>
  );
}
