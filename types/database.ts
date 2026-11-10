export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_global: boolean;
  user_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // joined / counted
  website_count?: number;
}

export interface Website {
  id: string;
  name: string;
  url: string;
  description: string | null;
  favicon_url: string | null;
  category_id: string;
  is_global: boolean;
  user_id: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // relations
  category?: Category | null;
  is_favorite?: boolean;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  website_id: string;
  created_at: string;
}

export interface UserVisit {
  id: string;
  user_id: string;
  website_id: string;
  visited_at: string;
  website?: Website;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: "light" | "dark" | "system";
  sidebar_collapsed: boolean;
  right_sidebar_visible: boolean;
  layout_config: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface UserNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalWebsites: number;
  favoriteWebsites: number;
  totalCategories: number;
  personalWebsites: number;
  globalWebsites: number;
  recentVisitsCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalWebsites: number;
  globalWebsites: number;
  personalWebsites: number;
  totalCategories: number;
}

export type EventLogLevel = "info" | "warn" | "error";
export type EventLogCategory = "admin_action" | "error" | "auth" | "system";

export interface EventLog {
  id: string;
  level: EventLogLevel;
  category: EventLogCategory;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  message: string;
  details?: Record<string, unknown> | null;
  user_id?: string | null;
  user_email?: string | null;
  user_name?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface EventLogStats {
  total: number;
  errors: number;
  adminActions: number;
  warnings: number;
}
