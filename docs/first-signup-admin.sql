-- Karembo: one-time first-account admin bootstrap.
-- IMPORTANT: Inspect existing auth.users and public.user_roles BEFORE applying.
-- If any auth account already exists, this intentionally does not auto-promote
-- the next signup. Grant the initial admin explicitly after verifying ownership.
-- Apply in Karembo's own Supabase SQL editor, not a different project's database.
-- Run with database-owner privileges and verify RLS on public.user_roles.
create or replace function public.karembo_assign_initial_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Serialize concurrent registrations to prevent two first-admin grants.
  perform pg_catalog.pg_advisory_xact_lock(721804, 11642);
  if (select count(*) from auth.users) = 1
     and not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin');
  end if;
  return new;
end;
$$;
revoke all on function public.karembo_assign_initial_admin() from public, anon, authenticated;
drop trigger if exists karembo_initial_admin on auth.users;
create trigger karembo_initial_admin
after insert on auth.users
for each row execute function public.karembo_assign_initial_admin();

-- Existing users? Do NOT promote the next signup. Review the existing
-- auth.users accounts and grant admin to the verified owner using a
-- privileged, one-time manual INSERT into public.user_roles instead.
-- Keep public.user_roles protected by RLS; ordinary users must never
-- be allowed to insert or update their own role.
