-- Run this in Supabase SQL editor after deploying the Pro paywall update.
-- It makes saved calculator snapshots a Pro-only database feature.

drop policy if exists "protocols_select_own" on public.saved_protocols;
create policy "protocols_select_own"
on public.saved_protocols
for select
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.billing_customers
    where billing_customers.user_id = auth.uid()
      and billing_customers.subscription_status in ('active', 'trialing')
  )
);

drop policy if exists "protocols_insert_own" on public.saved_protocols;
create policy "protocols_insert_own"
on public.saved_protocols
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.billing_customers
    where billing_customers.user_id = auth.uid()
      and billing_customers.subscription_status in ('active', 'trialing')
  )
);

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
