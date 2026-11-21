-- Links each logged-in user to the business they may access.
create table if not exists public.business_members (
    user_id     uuid        not null references auth.users (id) on delete cascade,
    business_id uuid        not null references public.businesses (id) on delete cascade,
    created_at  timestamptz not null default now(),
    primary key (user_id, business_id)
);

alter table public.business_members enable row level security;

drop policy if exists "members read own memberships" on public.business_members;
create policy "members read own memberships"
    on public.business_members
    for select
    to authenticated
    using (user_id = (select auth.uid()));

revoke all on public.business_members from anon, authenticated;
grant select on public.business_members to authenticated;

-- First membership row. DUMMY EMAIL: replace with your real login email.
-- Uses the first business row (plan assumption A1: one business per deployment).
insert into public.business_members (user_id, business_id)
select au.id, b.id
from auth.users as au
cross join (
    select id from public.businesses order by created_at limit 1
) as b
where au.email = 'owner@example.com'
on conflict do nothing;