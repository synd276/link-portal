-- ==============================================================================
-- LINK PORTAL - EVENT LOGS MIGRATION (AUDIT & ERROR TRACKING)
-- ==============================================================================

-- 1. TABLE: event_logs
create table if not exists public.event_logs (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'info' check (level in ('info', 'warn', 'error')),
  category text not null default 'admin_action' check (category in ('admin_action', 'error', 'auth', 'system')),
  action text not null,
  entity_type text,
  entity_id text,
  message text not null,
  details jsonb,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  user_name text,
  ip_address text,
  created_at timestamptz not null default now()
);

-- 2. INDEXES
create index if not exists idx_event_logs_created_at on public.event_logs(created_at desc);
create index if not exists idx_event_logs_level on public.event_logs(level);
create index if not exists idx_event_logs_category on public.event_logs(category);
create index if not exists idx_event_logs_action on public.event_logs(action);
create index if not exists idx_event_logs_user_id on public.event_logs(user_id);

-- 3. ROW LEVEL SECURITY (RLS)
alter table public.event_logs enable row level security;

-- Policy: Admin can read all event logs
drop policy if exists "event_logs_select_admin" on public.event_logs;
create policy "event_logs_select_admin"
  on public.event_logs for select
  using (
    coalesce(
      (select role = 'admin' from public.profiles where id = auth.uid()),
      false
    )
  );

-- Policy: System, users and guest errors can insert logs
drop policy if exists "event_logs_insert_all" on public.event_logs;
create policy "event_logs_insert_all"
  on public.event_logs for insert
  with check (true);

-- Policy: Only admin can delete logs
drop policy if exists "event_logs_delete_admin" on public.event_logs;
create policy "event_logs_delete_admin"
  on public.event_logs for delete
  using (
    coalesce(
      (select role = 'admin' from public.profiles where id = auth.uid()),
      false
    )
  );

-- 4. SEED INITIAL LOGS
insert into public.event_logs (level, category, action, entity_type, message, details, user_name)
values
  ('info', 'system', 'SYSTEM_INITIALIZED', 'system', 'Hệ thống LinkPortal khởi tạo và kích hoạt chế độ giám sát thành công', '{"version": "1.0.0", "env": "production"}'::jsonb, 'Hệ thống'),
  ('info', 'admin_action', 'INIT_CATEGORIES', 'category', 'Cấu hình hoàn tất danh mục mặc định toàn hệ thống (AI, Đảng, Chính quyền)', '{"count": 3}'::jsonb, 'Quản trị viên'),
  ('warn', 'auth', 'AUTH_RATE_LIMIT_CHECK', 'auth', 'Kiểm tra ngưỡng tần suất yêu cầu đăng nhập định kỳ (Rate-limiting OK)', '{"status": "normal"}'::jsonb, 'Bảo mật')
on conflict do nothing;
