export * from "./database";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number | string;
  exact?: boolean;
}

export interface SortOption {
  label: string;
  value: "name-asc" | "name-desc" | "created-desc" | "created-asc" | "sort-order";
}
