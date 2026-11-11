"use client";

import * as React from "react";
import {
  Folder,
  Bot,
  Star,
  Building2,
  Globe,
  Code,
  BookOpen,
  Newspaper,
  Sparkles,
  Search,
  Palette,
  CheckSquare,
  Cpu,
  Database,
  Briefcase,
  Compass,
  Shield,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PresetIconItem {
  name: string;
  label: string;
  icon: LucideIcon;
}

export const PRESET_CATEGORY_ICONS: PresetIconItem[] = [
  { name: "Folder", label: "Mặc định (Thư mục)", icon: Folder },
  { name: "Bot", label: "Trí tuệ nhân tạo (AI)", icon: Bot },
  { name: "Star", label: "Đảng / Nổi bật", icon: Star },
  { name: "Building2", label: "Chính quyền / Cơ quan", icon: Building2 },
  { name: "Globe", label: "Toàn cầu / Internet", icon: Globe },
  { name: "Code", label: "Lập trình & CNTT", icon: Code },
  { name: "BookOpen", label: "Tài liệu & Học tập", icon: BookOpen },
  { name: "Newspaper", label: "Tin tức & Báo chí", icon: Newspaper },
  { name: "Sparkles", label: "Tiện ích & Sáng tạo", icon: Sparkles },
  { name: "Search", label: "Tìm kiếm & Tra cứu", icon: Search },
  { name: "Palette", label: "Thiết kế & Đồ họa", icon: Palette },
  { name: "CheckSquare", label: "Công việc & Nhiệm vụ", icon: CheckSquare },
  { name: "Cpu", label: "Công nghệ & Kỹ thuật", icon: Cpu },
  { name: "Database", label: "Dữ liệu & Máy chủ", icon: Database },
  { name: "Briefcase", label: "Doanh nghiệp & Quản lý", icon: Briefcase },
  { name: "Compass", label: "Điều hướng & Khám phá", icon: Compass },
  { name: "Shield", label: "An toàn & Bảo mật", icon: Shield },
  { name: "Layers", label: "Hệ thống & Đa tầng", icon: Layers },
];

export type ParsedIconType = "preset" | "svg" | "data-uri" | "url" | "empty";

export interface ParsedCategoryIcon {
  type: ParsedIconType;
  value: string;
  presetIcon?: LucideIcon;
}

/**
 * Phân tích cú pháp chuỗi biểu tượng an toàn tuyệt đối (Null-safe).
 * Khắc phục hoàn toàn lỗi: Cannot read properties of undefined (reading 'split')
 */
export function parseCategoryIcon(rawIcon?: string | null): ParsedCategoryIcon {
  // 1. Kiểm tra an toàn: Nếu rawIcon là undefined, null, hoặc không phải string
  if (rawIcon === undefined || rawIcon === null || typeof rawIcon !== "string") {
    return {
      type: "preset",
      value: "Folder",
      presetIcon: Folder,
    };
  }

  const trimmed = rawIcon.trim();
  if (!trimmed) {
    return {
      type: "empty",
      value: "",
      presetIcon: Folder,
    };
  }

  // 2. Định dạng SVG trực tiếp: <svg ...>...</svg>
  if (trimmed.startsWith("<svg") && trimmed.includes("</svg>")) {
    return {
      type: "svg",
      value: trimmed,
    };
  }

  // 3. Định dạng Data URI (Ví dụ: data:image/svg+xml;base64,...)
  // Sử dụng optional chaining và fallback an toàn khi bóc tách chuỗi
  if (trimmed.startsWith("data:image/")) {
    return {
      type: "data-uri",
      value: trimmed,
    };
  }

  // 4. Định dạng URL hình ảnh / SVG (http://, https://, /path)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return {
      type: "url",
      value: trimmed,
    };
  }

  // 5. Định dạng có tiền tố phân loại (ví dụ "lucide:Bot", "preset:Star", "svg:<svg...")
  // Bóc tách an toàn với optional chaining
  let normalizedName = trimmed;
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":");
    // parts[0] là prefix, parts[1] là tên hoặc dữ liệu
    const prefix = parts[0]?.toLowerCase().trim();
    const content = parts.slice(1).join(":").trim();

    if (prefix === "svg" && content.startsWith("<svg")) {
      return {
        type: "svg",
        value: content,
      };
    }

    if (content) {
      normalizedName = content;
    }
  }

  // 6. Tìm biểu tượng trong danh sách preset có sẵn
  const matched = PRESET_CATEGORY_ICONS.find(
    (item) => item.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (matched) {
    return {
      type: "preset",
      value: matched.name,
      presetIcon: matched.icon,
    };
  }

  // Fallback về Folder mặc định
  return {
    type: "preset",
    value: "Folder",
    presetIcon: Folder,
  };
}

interface CategoryIconProps {
  icon?: string | null;
  className?: string;
  fallbackIcon?: LucideIcon;
}

export function CategoryIcon({
  icon,
  className = "h-5 w-5",
  fallbackIcon: Fallback = Folder,
}: CategoryIconProps) {
  const parsed = React.useMemo(() => parseCategoryIcon(icon), [icon]);

  // SVG Markup trực tiếp
  if (parsed.type === "svg") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full",
          className
        )}
        dangerouslySetInnerHTML={{ __html: parsed.value }}
      />
    );
  }

  // Data URI hoặc Image URL
  if (parsed.type === "data-uri" || parsed.type === "url") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={parsed.value}
        alt="Category icon"
        className={cn("object-contain shrink-0", className)}
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    );
  }

  // Preset Lucide Icon
  if (parsed.presetIcon) {
    const IconComponent = parsed.presetIcon;
    return <IconComponent className={className} />;
  }

  // Fallback
  return <Fallback className={className} />;
}
