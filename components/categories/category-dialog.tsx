"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { categorySchema, type CategoryInput } from "@/lib/validations";
import { createCategoryAction, updateCategoryAction } from "@/app/actions/categories";
import { Category } from "@/types/database";
import {
  CategoryIcon,
  PRESET_CATEGORY_ICONS,
  parseCategoryIcon,
} from "./category-icon";
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
import { Switch } from "@/components/ui/switch";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Category | null;
  isAdmin?: boolean;
  onSuccess?: (category: Category) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  initialData,
  isAdmin = false,
  onSuccess,
}: CategoryDialogProps) {
  const isEditing = Boolean(initialData);
  const [customIconMode, setCustomIconMode] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "Folder",
      is_global: false,
      sort_order: 0,
    },
  });

  const isGlobalValue = watch("is_global");
  const iconValue = watch("icon") || "Folder";

  React.useEffect(() => {
    if (initialData) {
      const rawIcon = initialData.icon || "Folder";
      reset({
        name: initialData.name,
        description: initialData.description || "",
        icon: rawIcon,
        is_global: initialData.is_global,
        sort_order: initialData.sort_order,
      });

      // Nếu icon là SVG hoặc URL, tự động bật chế độ tùy chỉnh
      const isCustom =
        typeof rawIcon === "string" &&
        (rawIcon.startsWith("<svg") ||
          rawIcon.startsWith("http") ||
          rawIcon.startsWith("data:"));
      setCustomIconMode(isCustom);
    } else {
      reset({
        name: "",
        description: "",
        icon: "Folder",
        is_global: isAdmin,
        sort_order: 0,
      });
      setCustomIconMode(false);
    }
  }, [initialData, reset, isAdmin, open]);

  const onSubmit = async (values: CategoryInput) => {
    try {
      const payload: CategoryInput = {
        ...values,
        icon: values.icon?.trim() || "Folder",
      };

      if (isEditing && initialData) {
        const res = await updateCategoryAction(initialData.id, payload);
        if (!res.success) {
          toast.error(res.error || "Cập nhật danh mục thất bại");
          return;
        }
        toast.success("Đã cập nhật danh mục");
        if (onSuccess && res.data) onSuccess(res.data);
      } else {
        const res = await createCategoryAction(payload);
        if (!res.success) {
          toast.error(res.error || "Thêm danh mục thất bại");
          return;
        }
        toast.success("Đã thêm danh mục thành công");
        if (onSuccess && res.data) onSuccess(res.data);
      }
      onOpenChange(false);
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const parsedCurrentIcon = React.useMemo(
    () => parseCategoryIcon(iconValue),
    [iconValue]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin và biểu tượng danh mục website"
              : "Tạo danh mục để phân loại và sắp xếp các liên kết của bạn"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Tên danh mục */}
          <div className="space-y-1.5">
            <Label htmlFor="cat_name">Tên danh mục *</Label>
            <Input
              id="cat_name"
              placeholder="VD: Công cụ AI, Thiết kế, Báo chí..."
              disabled={isSubmitting}
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Biểu tượng danh mục (Icon & Custom SVG Picker) */}
          <div className="space-y-2 p-3 rounded-xl border bg-muted/20">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Biểu tượng danh mục
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCustomIconMode(!customIconMode)}
                className="h-7 text-xs text-primary"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                {customIconMode ? "Chọn từ danh sách có sẵn" : "Nhập SVG / URL tùy chỉnh"}
              </Button>
            </div>

            {/* Live Preview Bar */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg border bg-card shadow-2xs">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <CategoryIcon icon={iconValue} className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">Xem trước biểu tượng</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  Loại: {parsedCurrentIcon.type === "svg"
                    ? "SVG tùy chỉnh"
                    : parsedCurrentIcon.type === "url" || parsedCurrentIcon.type === "data-uri"
                    ? "Ảnh / Data URI"
                    : `Preset (${parsedCurrentIcon.value})`}
                </p>
              </div>
            </div>

            {/* Lựa chọn biểu tượng */}
            {!customIconMode ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] text-muted-foreground">
                  Chọn một biểu tượng phù hợp với chủ đề danh mục:
                </p>
                <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto p-1 border rounded-lg bg-card">
                  {PRESET_CATEGORY_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected =
                      iconValue.toLowerCase() === item.name.toLowerCase();

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setValue("icon", item.name, { shouldValidate: true })}
                        className={`relative flex flex-col items-center justify-center p-2 rounded-md transition-all text-xs ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-medium shadow-xs"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        title={item.label}
                      >
                        <IconComp className="h-5 w-5" />
                        <span className="text-[9px] truncate max-w-full mt-1">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-primary-foreground ring-1 ring-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <Label htmlFor="cat_custom_icon" className="text-xs">
                  Mã SVG hoặc Đường dẫn biểu tượng (SVG markup, Data URI, URL)
                </Label>
                <Textarea
                  id="cat_custom_icon"
                  placeholder="Dán mã <svg>...</svg> hoặc link ảnh https://... hoặc data:image/svg+xml;..."
                  rows={3}
                  disabled={isSubmitting}
                  value={iconValue}
                  onChange={(e) => setValue("icon", e.target.value, { shouldValidate: true })}
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Hệ thống hỗ trợ phân tích an toàn các định dạng SVG, Data URI hoặc link ảnh ngoài.
                </p>
              </div>
            )}
            {errors.icon && (
              <p className="text-xs text-destructive">{errors.icon.message}</p>
            )}
          </div>

          {/* Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="cat_desc">Mô tả</Label>
            <Textarea
              id="cat_desc"
              placeholder="Mô tả nội dung các website trong danh mục..."
              rows={2}
              disabled={isSubmitting}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Thứ tự sắp xếp */}
          <div className="space-y-1.5">
            <Label htmlFor="cat_sort">Thứ tự hiển thị</Label>
            <Input
              id="cat_sort"
              type="number"
              min="0"
              disabled={isSubmitting}
              {...register("sort_order", { valueAsNumber: true })}
              className="w-32"
            />
          </div>

          {/* Toàn hệ thống (Admin only) */}
          {isAdmin && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
              <div>
                <Label htmlFor="cat_global" className="cursor-pointer font-medium">
                  Danh mục toàn hệ thống (Global)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mọi người dùng trên toàn hệ thống đều nhìn thấy danh mục này
                </p>
              </div>
              <Switch
                id="cat_global"
                checked={isGlobalValue}
                onCheckedChange={(val) => setValue("is_global", val)}
              />
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
                "Tạo danh mục"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
