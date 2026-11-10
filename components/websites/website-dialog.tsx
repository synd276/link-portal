"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { websiteSchema, type WebsiteInput } from "@/lib/validations";
import { createWebsiteAction, updateWebsiteAction } from "@/app/actions/websites";
import { Category, Website } from "@/types/database";
import { getDomainFromUrl, getFaviconUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface WebsiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  initialData?: Website | null;
  isAdmin?: boolean;
  onSuccess?: (website: Website) => void;
}

export function WebsiteDialog({
  open,
  onOpenChange,
  categories,
  initialData,
  isAdmin = false,
  onSuccess,
}: WebsiteDialogProps) {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WebsiteInput>({
    resolver: zodResolver(websiteSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
      category_id: categories[0]?.id || "",
      favicon_url: "",
      is_global: false,
      is_featured: false,
      sort_order: 0,
    },
  });

  const urlValue = watch("url");
  const faviconUrlValue = watch("favicon_url");
  const isGlobalValue = watch("is_global");
  const isFeaturedValue = watch("is_featured");
  const categoryIdValue = watch("category_id");

  // Populate on open
  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        url: initialData.url,
        description: initialData.description || "",
        category_id: initialData.category_id,
        favicon_url: initialData.favicon_url || "",
        is_global: initialData.is_global,
        is_featured: initialData.is_featured,
        sort_order: initialData.sort_order,
      });
    } else {
      reset({
        name: "",
        url: "",
        description: "",
        category_id: categories[0]?.id || "",
        favicon_url: "",
        is_global: isAdmin,
        is_featured: false,
        sort_order: 0,
      });
    }
  }, [initialData, reset, categories, isAdmin, open]);

  const domain = urlValue ? getDomainFromUrl(urlValue) : "";
  const previewFavicon = urlValue
    ? getFaviconUrl(urlValue, faviconUrlValue)
    : null;

  const handleAutoFavicon = () => {
    if (!urlValue) {
      toast.info("Vui lòng nhập URL website trước");
      return;
    }
    const autoUrl = getFaviconUrl(urlValue);
    setValue("favicon_url", autoUrl);
    toast.success("Đã tạo tự động favicon từ domain");
  };

  const onSubmit = async (values: WebsiteInput) => {
    try {
      if (isEditing && initialData) {
        const res = await updateWebsiteAction(initialData.id, values);
        if (!res.success) {
          toast.error(res.error || "Cập nhật website thất bại");
          return;
        }
        toast.success("Đã cập nhật website thành công");
        if (onSuccess && res.data) onSuccess(res.data);
      } else {
        const res = await createWebsiteAction(values);
        if (!res.success) {
          toast.error(res.error || "Thêm website thất bại");
          return;
        }
        toast.success("Đã thêm website thành công");
        if (onSuccess && res.data) onSuccess(res.data);
      }

      onOpenChange(false);
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa website" : "Thêm website mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin website liên kết của bạn"
              : "Thêm website vào kho liên kết để truy cập nhanh chóng"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* URL & Auto Preview */}
          <div className="space-y-1.5">
            <Label htmlFor="url">Địa chỉ website (URL) *</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              disabled={isSubmitting}
              {...register("url")}
              className={errors.url ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
            {domain && (
              <p className="text-[11px] text-muted-foreground">
                Domain nhận diện: <span className="font-mono text-foreground">{domain}</span>
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên website *</Label>
            <Input
              id="name"
              placeholder="VD: Google Search, GitHub..."
              disabled={isSubmitting}
              {...register("name")}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="category_id">Danh mục *</Label>
            {categories.length > 0 ? (
              <Select
                value={categoryIdValue}
                onValueChange={(val) => setValue("category_id", val)}
              >
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.is_global ? "(Hệ thống)" : "(Cá nhân)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-xs text-amber-600">
                Chưa có danh mục nào. Vui lòng tạo danh mục trước.
              </p>
            )}
            {errors.category_id && (
              <p className="text-xs text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả ngắn</Label>
            <Textarea
              id="description"
              placeholder="Mô tả công dụng hoặc nội dung website..."
              rows={2}
              disabled={isSubmitting}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Favicon URL & Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="favicon_url">Favicon URL (Tùy chọn)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAutoFavicon}
                className="h-7 text-xs text-primary"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Tự lấy favicon
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-9 w-9 shrink-0 rounded-md border bg-muted/40 p-1 flex items-center justify-center">
                {previewFavicon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewFavicon}
                    alt="Preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Input
                id="favicon_url"
                placeholder="https://.../favicon.ico"
                disabled={isSubmitting}
                {...register("favicon_url")}
                className="flex-1"
              />
            </div>
            {errors.favicon_url && (
              <p className="text-xs text-destructive">{errors.favicon_url.message}</p>
            )}
          </div>

          {/* Admin only fields */}
          {isAdmin && (
            <div className="p-3 rounded-lg border bg-muted/30 space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Cài đặt Quản trị viên
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_global" className="cursor-pointer">
                    Website toàn hệ thống (Global)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Tất cả người dùng trên hệ thống đều có thể nhìn thấy website này
                  </p>
                </div>
                <Switch
                  id="is_global"
                  checked={isGlobalValue}
                  onCheckedChange={(val) => setValue("is_global", val)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Đánh dấu nổi bật (Featured)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Hiển thị ở khu vực Truy cập nhanh (Quick Access)
                  </p>
                </div>
                <Switch
                  id="is_featured"
                  checked={isFeaturedValue}
                  onCheckedChange={(val) => setValue("is_featured", val)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="sort_order">Thứ tự hiển thị</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  {...register("sort_order", { valueAsNumber: true })}
                  className="w-32"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : isEditing ? (
                "Lưu thay đổi"
              ) : (
                "Thêm website"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
