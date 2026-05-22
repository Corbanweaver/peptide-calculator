-- Run this in the Supabase SQL editor.
-- It creates account profiles, saved calculator results, and a launch waitlist.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  compound_id text not null,
  plan_name text not null,
  dose_mcg numeric(12,4) not null,
  dose_ml numeric(12,6) not null,
  frequency text not null,
  duration_weeks integer not null check (duration_weeks > 0),
  start_date date,
  schedule jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  interest text not null default 'reminders',
  source text not null default 'calculator',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_interest_idx
on public.waitlist_signups (lower(email), interest);

create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  subscription_status text not null default 'inactive' check (
    subscription_status in (
      'inactive',
      'incomplete',
      'incomplete_expired',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'paused'
    )
  ),
  subscription_cancel_at_period_end boolean not null default false,
  subscription_current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_customers_subscription_status_idx
on public.billing_customers (subscription_status);

create or replace function public.handle_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_auth_user_created_profile on auth.users;
create trigger trg_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.handle_profile_updated_at();

drop trigger if exists trg_saved_protocols_updated_at on public.saved_protocols;
create trigger trg_saved_protocols_updated_at
before update on public.saved_protocols
for each row execute function public.handle_profile_updated_at();

drop trigger if exists trg_billing_customers_updated_at on public.billing_customers;
create trigger trg_billing_customers_updated_at
before update on public.billing_customers
for each row execute function public.handle_profile_updated_at();

alter table public.profiles enable row level security;
alter table public.saved_protocols enable row level security;
alter table public.waitlist_signups enable row level security;
alter table public.billing_customers enable row level security;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.saved_protocols to authenticated;
grant insert on public.waitlist_signups to anon, authenticated;
grant select on public.waitlist_signups to authenticated;
grant select on public.billing_customers to authenticated;
grant all on public.billing_customers to service_role;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "protocols_select_own" on public.saved_protocols;
create policy "protocols_select_own"
on public.saved_protocols
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "protocols_insert_own" on public.saved_protocols;
create policy "protocols_insert_own"
on public.saved_protocols
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "protocols_update_own" on public.saved_protocols;
create policy "protocols_update_own"
on public.saved_protocols
for update
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.billing_customers
    where billing_customers.user_id = auth.uid()
      and billing_customers.subscription_status in ('active', 'trialing')
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.billing_customers
    where billing_customers.user_id = auth.uid()
      and billing_customers.subscription_status in ('active', 'trialing')
  )
);

drop policy if exists "protocols_delete_own" on public.saved_protocols;
create policy "protocols_delete_own"
on public.saved_protocols
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "waitlist_insert_public" on public.waitlist_signups;
create policy "waitlist_insert_public"
on public.waitlist_signups
for insert
to anon, authenticated
with check (user_id is null or (select auth.uid()) = user_id);

drop policy if exists "waitlist_select_own" on public.waitlist_signups;
create policy "waitlist_select_own"
on public.waitlist_signups
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "billing_customers_select_own" on public.billing_customers;
create policy "billing_customers_select_own"
on public.billing_customers
for select
to authenticated
using ((select auth.uid()) = user_id);
