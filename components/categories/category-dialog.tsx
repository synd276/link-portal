"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { categorySchema, type CategoryInput } from "@/lib/validations";
import { createCategoryAction, updateCategoryAction } from "@/app/actions/categories";
import { Category } from "@/types/database";
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

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        icon: initialData.icon || "Folder",
        is_global: initialData.is_global,
        sort_order: initialData.sort_order,
      });
    } else {
      reset({
        name: "",
        description: "",
        icon: "Folder",
        is_global: isAdmin,
        sort_order: 0,
      });
    }
  }, [initialData, reset, isAdmin, open]);

  const onSubmit = async (values: CategoryInput) => {
    try {
      if (isEditing && initialData) {
        const res = await updateCategoryAction(initialData.id, values);
        if (!res.success) {
          toast.error(res.error || "Cập nhật danh mục thất bại");
          return;
        }
        toast.success("Đã cập nhật danh mục");
        if (onSuccess && res.data) onSuccess(res.data);
      } else {
        const res = await createCategoryAction(values);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin danh mục website"
              : "Tạo danh mục để phân loại và sắp xếp các liên kết của bạn"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
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
