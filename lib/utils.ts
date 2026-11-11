import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomainFromUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getFaviconUrl(url: string, customFavicon?: string | null): string {
  if (customFavicon && customFavicon.trim().length > 0) {
    return customFavicon.trim();
  }
  const domain = getDomainFromUrl(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  // Tránh gọi Date.now() khi prerender trên server để không vi phạm Next.js PPR
  const now = typeof window !== "undefined" ? Date.now() : new Date(dateString).getTime();
  const past = new Date(dateString).getTime();
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return "Vừa xong";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} ngày trước`;
  return formatDate(dateString);
}


export function isUuid(str: string | null | undefined): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

/**
 * Chuyển đổi an toàn bất kỳ định danh website nào (kể cả ID tĩnh dạng "dang-001", "ai-001", "chinhquyen-001")
 * thành UUID chuẩn, hợp lệ với cột UUID trong cơ sở dữ liệu PostgreSQL / Supabase.
 */
export function getDeterministicWebsiteUuid(idOrSlug: string | null | undefined): string {
  if (!idOrSlug) return "33333333-0000-0000-0000-000000000000";
  const trimmed = idOrSlug.trim();
  if (isUuid(trimmed)) return trimmed;

  const aiMatch = trimmed.match(/^ai-(\d+)$/i);
  if (aiMatch) {
    const num = parseInt(aiMatch[1], 10);
    return `33333333-0001-0000-0000-${num.toString(16).padStart(12, "0")}`;
  }

  const dangMatch = trimmed.match(/^dang-(\d+)$/i);
  if (dangMatch) {
    const num = parseInt(dangMatch[1], 10);
    return `33333333-0002-0000-0000-${num.toString(16).padStart(12, "0")}`;
  }

  const cqMatch = trimmed.match(/^chinhquyen-(\d+)$/i);
  if (cqMatch) {
    const num = parseInt(cqMatch[1], 10);
    return `33333333-0003-0000-0000-${num.toString(16).padStart(12, "0")}`;
  }

  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, "0").slice(0, 12);
  return `33333333-ffff-0000-0000-${hex}`;
}