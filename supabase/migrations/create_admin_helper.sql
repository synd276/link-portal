-- ==============================================================================
-- ADMIN CREATION / PROMOTION HELPER
-- ==============================================================================
-- Replace 'admin@example.com' with the email of the registered user you wish to make Admin.

create or replace function public.promote_user_to_admin(target_email text)
returns text
language plpgsql
security definer
as $$
declare
  target_id uuid;
begin
  select id into target_id from auth.users where email = target_email;
  if target_id is null then
    return 'User with email ' || target_email || ' not found.';
  end if;

  update public.profiles
  set role = 'admin'
  where id = target_id;

  return 'User ' || target_email || ' promoted to admin successfully.';
end;
$$;

-- Example usage in Supabase SQL editor:
-- SELECT public.promote_user_to_admin('admin@linkportal.local');
