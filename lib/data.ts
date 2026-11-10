import { cache } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  Profile,
  Category,
  Website,
  UserSettings,
  UserNote,
  DashboardStats,
  AdminStats,
} from "@/types/database";

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getUserProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile || null;
});

export const getUserSettings = cache(async (): Promise<UserSettings | null> => {
  if (!isSupabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return settings || null;
});

interface RawCategoryRow extends Category {
  websites?: { count: number }[];
}

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();

  const query = supabase
    .from("categories")
    .select("*, websites(count)")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const { data, error } = await query;
  if (error || !data) return [];

  const rows = data as unknown as RawCategoryRow[];

  return rows.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    icon: cat.icon,
    is_global: cat.is_global,
    user_id: cat.user_id,
    sort_order: cat.sort_order,
    created_at: cat.created_at,
    updated_at: cat.updated_at,
    website_count: cat.websites?.[0]?.count || 0,
  }));
});

export interface WebsiteFilters {
  categoryId?: string;
  scope?: "all" | "global" | "personal" | "favorites";
  query?: string;
  sortBy?: "name-asc" | "name-desc" | "created-desc" | "created-asc" | "sort-order";
  limit?: number;
}

export const getWebsites = cache(
  async (filters: WebsiteFilters = {}): Promise<Website[]> => {
    if (!isSupabaseConfigured()) return [];
    const supabase = await createClient();
    const user = await getCurrentUser();

    // 1. Get user favorite ids
    const favoriteIds = new Set<string>();
    if (user) {
      const { data: favs } = await supabase
        .from("user_favorites")
        .select("website_id")
        .eq("user_id", user.id);
      if (favs) {
        favs.forEach((f) => favoriteIds.add(f.website_id));
      }
    }

    let query = supabase
      .from("websites")
      .select("*, category:categories(*)");

    if (filters.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }

    if (filters.scope === "global") {
      query = query.eq("is_global", true);
    } else if (filters.scope === "personal") {
      query = query.eq("is_global", false);
      if (user) {
        query = query.eq("user_id", user.id);
      }
    } else if (filters.scope === "favorites") {
      if (favoriteIds.size === 0) {
        return [];
      }
      query = query.in("id", Array.from(favoriteIds));
    }

    if (filters.query && filters.query.trim().length > 0) {
      const q = `%${filters.query.trim()}%`;
      query = query.or(`name.ilike.${q},url.ilike.${q},description.ilike.${q}`);
    }

    // Sort order
    switch (filters.sortBy) {
      case "name-asc":
        query = query.order("name", { ascending: true });
        break;
      case "name-desc":
        query = query.order("name", { ascending: false });
        break;
      case "created-asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "created-desc":
        query = query.order("created_at", { ascending: false });
        break;
      case "sort-order":
      default:
        query = query
          .order("sort_order", { ascending: true })
          .order("is_featured", { ascending: false })
          .order("name", { ascending: true });
        break;
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    const rows = data as unknown as Website[];

    return rows.map((item) => ({
      ...item,
      is_favorite: favoriteIds.has(item.id),
    }));
  }
);

interface RawVisitRow {
  id: string;
  visited_at: string;
  website: Website | Website[] | null;
}

export interface RecentVisitItem {
  id: string;
  visited_at: string;
  website: Website;
}

export const getRecentVisits = cache(async (limit: number = 10): Promise<RecentVisitItem[]> => {
  if (!isSupabaseConfigured()) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_visits")
    .select("id, visited_at, website:websites(*, category:categories(*))")
    .eq("user_id", user.id)
    .order("visited_at", { ascending: false })
    .limit(limit * 3);

  if (error || !data) return [];

  const rows = data as unknown as RawVisitRow[];
  const seen = new Set<string>();
  const results: RecentVisitItem[] = [];

  for (const item of rows) {
    const w = Array.isArray(item.website) ? item.website[0] : item.website;
    if (w && !seen.has(w.id)) {
      seen.add(w.id);
      results.push({
        id: item.id,
        visited_at: item.visited_at,
        website: w,
      });
      if (results.length >= limit) break;
    }
  }

  return results;
});

export const getUserNotes = cache(async (): Promise<UserNote[]> => {
  if (!isSupabaseConfigured()) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_notes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data;
});

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  if (!isSupabaseConfigured()) {
    return {
      totalWebsites: 0,
      favoriteWebsites: 0,
      totalCategories: 0,
      personalWebsites: 0,
      globalWebsites: 0,
      recentVisitsCount: 0,
    };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();

  // Total available websites (global + user personal)
  const { count: totalWebsites } = await supabase
    .from("websites")
    .select("*", { count: "exact", head: true });

  // Favorites
  let favCount = 0;
  if (user) {
    const { count } = await supabase
      .from("user_favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    favCount = count || 0;
  }

  // Categories
  const { count: totalCategories } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  // Personal
  let personalCount = 0;
  if (user) {
    const { count } = await supabase
      .from("websites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_global", false);
    personalCount = count || 0;
  }

  // Global
  const { count: globalCount } = await supabase
    .from("websites")
    .select("*", { count: "exact", head: true })
    .eq("is_global", true);

  // Recent visits count
  let recentVisitsCount = 0;
  if (user) {
    const { count } = await supabase
      .from("user_visits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    recentVisitsCount = count || 0;
  }

  return {
    totalWebsites: totalWebsites || 0,
    favoriteWebsites: favCount,
    totalCategories: totalCategories || 0,
    personalWebsites: personalCount,
    globalWebsites: globalCount || 0,
    recentVisitsCount: recentVisitsCount,
  };
});

export const getAdminStats = cache(async (): Promise<AdminStats> => {
  const supabase = await createClient();

  const [{ count: users }, { count: totalWebsites }, { count: globalWebsites }, { count: personalWebsites }, { count: categories }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("websites").select("*", { count: "exact", head: true }),
    supabase.from("websites").select("*", { count: "exact", head: true }).eq("is_global", true),
    supabase.from("websites").select("*", { count: "exact", head: true }).eq("is_global", false),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: users || 0,
    totalWebsites: totalWebsites || 0,
    globalWebsites: globalWebsites || 0,
    personalWebsites: personalWebsites || 0,
    totalCategories: categories || 0,
  };
});

export const getAdminUsers = cache(async (): Promise<Profile[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
});
