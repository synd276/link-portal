-- ==============================================================================
-- LINK PORTAL - DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS & TYPES
-- Role: 'user' | 'admin'

-- 3. FUNCTION FOR UPDATED_AT
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 4. TABLE: profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index on role
create index if not exists idx_profiles_role on public.profiles(role);

-- Trigger for profiles.updated_at
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Helper function to check if current user is admin (security definer)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 5. TABLE: categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  is_global boolean not null default true,
  user_id uuid references auth.users on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_category_owner check (
    (is_global = true and user_id is null) or
    (is_global = false and user_id is not null)
  )
);

create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_categories_is_global on public.categories(is_global);
create index if not exists idx_categories_sort_order on public.categories(sort_order asc);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

-- 6. TABLE: websites
create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  description text,
  favicon_url text,
  category_id uuid not null references public.categories on delete cascade,
  is_global boolean not null default false,
  user_id uuid references auth.users on delete cascade,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_website_url_http check (url ~* '^https?://.+'),
  constraint check_website_owner check (
    (is_global = true and user_id is null) or
    (is_global = false and user_id is not null)
  )
);

create index if not exists idx_websites_category_id on public.websites(category_id);
create index if not exists idx_websites_user_id on public.websites(user_id);
create index if not exists idx_websites_is_global on public.websites(is_global);
create index if not exists idx_websites_is_featured on public.websites(is_featured);
create index if not exists idx_websites_sort_order on public.websites(sort_order asc);
create index if not exists idx_websites_created_at on public.websites(created_at desc);

drop trigger if exists set_websites_updated_at on public.websites;
create trigger set_websites_updated_at
  before update on public.websites
  for each row execute function public.handle_updated_at();

-- 7. TABLE: user_favorites
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  website_id uuid not null references public.websites on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_user_website_favorite unique (user_id, website_id)
);

create index if not exists idx_user_favorites_user_id on public.user_favorites(user_id);
create index if not exists idx_user_favorites_website_id on public.user_favorites(website_id);

-- 8. TABLE: user_visits
create table if not exists public.user_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  website_id uuid not null references public.websites on delete cascade,
  visited_at timestamptz not null default now()
);

create index if not exists idx_user_visits_user_id on public.user_visits(user_id);
create index if not exists idx_user_visits_website_id on public.user_visits(website_id);
create index if not exists idx_user_visits_visited_at on public.user_visits(visited_at desc);

-- 9. TABLE: user_settings
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade unique,
  theme text not null default 'light' check (theme in ('light', 'dark', 'system')),
  sidebar_collapsed boolean not null default false,
  right_sidebar_visible boolean not null default true,
  layout_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_settings_user_id on public.user_settings(user_id);

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.handle_updated_at();

-- 10. TABLE: user_notes
create table if not exists public.user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_notes_user_id on public.user_notes(user_id);
create index if not exists idx_user_notes_updated_at on public.user_notes(updated_at desc);

drop trigger if exists set_user_notes_updated_at on public.user_notes;
create trigger set_user_notes_updated_at
  before update on public.user_notes
  for each row execute function public.handle_updated_at();

-- 11. AUTOMATIC PROFILE & SETTINGS CREATION ON NEW USER REGISTRATION
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  on conflict (id) do nothing;

  insert into public.user_settings (user_id, theme, sidebar_collapsed, right_sidebar_visible)
  values (new.id, 'light', false, true)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.websites enable row level security;
alter table public.user_favorites enable row level security;
alter table public.user_visits enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_notes enable row level security;

-- PROFILES POLICIES
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own_no_privilege_escalation" on public.profiles;
create policy "profiles_update_own_no_privilege_escalation"
  on public.profiles for update
  using (
    auth.uid() = id or public.is_admin()
  )
  with check (
    -- Non-admin cannot escalate their role
    (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()))
    or public.is_admin()
  );

-- CATEGORIES POLICIES
drop policy if exists "categories_select_global_or_own" on public.categories;
create policy "categories_select_global_or_own"
  on public.categories for select
  using (is_global = true or user_id = auth.uid() or public.is_admin());

drop policy if exists "categories_insert" on public.categories;
create policy "categories_insert"
  on public.categories for insert
  with check (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  );

drop policy if exists "categories_update" on public.categories;
create policy "categories_update"
  on public.categories for update
  using (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  )
  with check (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  );

drop policy if exists "categories_delete" on public.categories;
create policy "categories_delete"
  on public.categories for delete
  using (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  );

-- WEBSITES POLICIES
drop policy if exists "websites_select_global_or_own" on public.websites;
create policy "websites_select_global_or_own"
  on public.websites for select
  using (is_global = true or user_id = auth.uid() or public.is_admin());

drop policy if exists "websites_insert" on public.websites;
create policy "websites_insert"
  on public.websites for insert
  with check (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  );

drop policy if exists "websites_update" on public.websites;
create policy "websites_update"
  on public.websites for update
  using (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  )
  with check (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  );

drop policy if exists "websites_delete" on public.websites;
create policy "websites_delete"
  on public.websites for delete
  using (
    (is_global = false and user_id = auth.uid()) or
    (is_global = true and public.is_admin())
  );

-- USER FAVORITES POLICIES
drop policy if exists "user_favorites_select_own" on public.user_favorites;
create policy "user_favorites_select_own"
  on public.user_favorites for select
  using (user_id = auth.uid());

drop policy if exists "user_favorites_insert_own" on public.user_favorites;
create policy "user_favorites_insert_own"
  on public.user_favorites for insert
  with check (
    user_id = auth.uid() and
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.is_global = true or w.user_id = auth.uid())
    )
  );

drop policy if exists "user_favorites_delete_own" on public.user_favorites;
create policy "user_favorites_delete_own"
  on public.user_favorites for delete
  using (user_id = auth.uid());

-- USER VISITS POLICIES
drop policy if exists "user_visits_select_own" on public.user_visits;
create policy "user_visits_select_own"
  on public.user_visits for select
  using (user_id = auth.uid());

drop policy if exists "user_visits_insert_own" on public.user_visits;
create policy "user_visits_insert_own"
  on public.user_visits for insert
  with check (
    user_id = auth.uid() and
    exists (
      select 1 from public.websites w
      where w.id = website_id and (w.is_global = true or w.user_id = auth.uid())
    )
  );

drop policy if exists "user_visits_delete_own" on public.user_visits;
create policy "user_visits_delete_own"
  on public.user_visits for delete
  using (user_id = auth.uid());

-- USER SETTINGS POLICIES
drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own"
  on public.user_settings for select
  using (user_id = auth.uid());

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own"
  on public.user_settings for insert
  with check (user_id = auth.uid());

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
  on public.user_settings for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- USER NOTES POLICIES
drop policy if exists "user_notes_select_own" on public.user_notes;
create policy "user_notes_select_own"
  on public.user_notes for select
  using (user_id = auth.uid());

drop policy if exists "user_notes_insert_own" on public.user_notes;
create policy "user_notes_insert_own"
  on public.user_notes for insert
  with check (user_id = auth.uid());

drop policy if exists "user_notes_update_own" on public.user_notes;
create policy "user_notes_update_own"
  on public.user_notes for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "user_notes_delete_own" on public.user_notes;
create policy "user_notes_delete_own"
  on public.user_notes for delete
  using (user_id = auth.uid());

-- ==============================================================================
-- 13. SEED DEFAULT GLOBAL CATEGORIES & WEBSITES
-- ==============================================================================

-- Seed Categories
insert into public.categories (id, name, description, icon, is_global, sort_order)
values
  ('11111111-1111-1111-1111-111111111101', 'Tìm kiếm & Tra cứu', 'Các công cụ tìm kiếm và thông tin phổ biến', 'Search', true, 1),
  ('11111111-1111-1111-1111-111111111102', 'Công cụ AI', 'Các mô hình trí tuệ nhân tạo và công cụ hỗ trợ thông minh', 'Bot', true, 2),
  ('11111111-1111-1111-1111-111111111103', 'Phát triển phần mềm', 'Nền tảng lập trình, tài liệu kỹ thuật và mã nguồn', 'Code2', true, 3),
  ('11111111-1111-1111-1111-111111111104', 'Thiết kế & Sáng tạo', 'Công cụ thiết kế UI/UX, đồ họa và cảm hứng', 'Palette', true, 4),
  ('11111111-1111-1111-1111-111111111105', 'Năng suất & Làm việc', 'Quản lý công việc, ghi chú và cộng tác nhóm', 'CheckSquare', true, 5),
  ('11111111-1111-1111-1111-111111111106', 'Tin tức & Tri thức', 'Báo chí, blog chuyên môn và tạp chí công nghệ', 'Newspaper', true, 6)
on conflict (id) do nothing;

-- Seed Global Websites
insert into public.websites (id, name, url, description, favicon_url, category_id, is_global, is_featured, sort_order)
values
  ('22222222-2222-2222-2222-222222222201', 'Google', 'https://www.google.com', 'Công cụ tìm kiếm thông tin hàng đầu thế giới', 'https://www.google.com/favicon.ico', '11111111-1111-1111-1111-111111111101', true, true, 1),
  ('22222222-2222-2222-2222-222222222202', 'ChatGPT', 'https://chatgpt.com', 'Trợ lý AI đàm thoại thông minh của OpenAI', 'https://chatgpt.com/favicon.ico', '11111111-1111-1111-1111-111111111102', true, true, 2),
  ('22222222-2222-2222-2222-222222222203', 'Claude AI', 'https://claude.ai', 'Trợ lý AI thế hệ mới từ Anthropic', 'https://claude.ai/favicon.ico', '11111111-1111-1111-1111-111111111102', true, true, 3),
  ('22222222-2222-2222-2222-222222222204', 'GitHub', 'https://github.com', 'Nền tảng lưu trữ và cộng tác phát triển phần mềm', 'https://github.githubassets.com/favicons/favicon.png', '11111111-1111-1111-1111-111111111103', true, true, 4),
  ('22222222-2222-2222-2222-222222222205', 'Figma', 'https://www.figma.com', 'Công cụ thiết kế giao diện UI/UX và cộng tác đám mây', 'https://static.figma.com/app/icon/1/favicon.png', '11111111-1111-1111-1111-111111111104', true, true, 5),
  ('22222222-2222-2222-2222-222222222206', 'Notion', 'https://www.notion.so', 'Không gian làm việc tất cả trong một cho ghi chú và dự án', 'https://www.notion.so/images/favicon.ico', '11111111-1111-1111-1111-111111111105', true, true, 6),
  ('22222222-2222-2222-2222-222222222207', 'VnExpress', 'https://vnexpress.net', 'Báo tiếng Việt nhiều người đọc nhất', 'https://s1.vnecdn.net/vnexpress/restruct/i/v9552/logos/favicon.ico', '11111111-1111-1111-1111-111111111106', true, false, 7),
  ('22222222-2222-2222-2222-222222222208', 'Stack Overflow', 'https://stackoverflow.com', 'Cộng đồng hỏi đáp lớn nhất cho lập trình viên', 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico', '11111111-1111-1111-1111-111111111103', true, false, 8)
on conflict (id) do nothing;
