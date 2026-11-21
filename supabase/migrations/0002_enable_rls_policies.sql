-- Turn on RLS for all six tables. n8n uses service_role, which bypasses RLS.
alter table public.businesses        enable row level security;
alter table public.contacts          enable row level security;
alter table public.leads             enable row level security;
alter table public.activity_logs     enable row level security;
alter table public.email_connections enable row level security;
alter table public.business_members  enable row level security;

-- Start from zero access, then grant only what the site needs.
revoke all on public.businesses, public.contacts, public.leads,
              public.activity_logs, public.email_connections
    from anon, authenticated;

grant select on public.leads, public.contacts, public.activity_logs, public.businesses
    to authenticated;

-- Column-level grants: the site can edit only these fields.
grant update (opted_out) on public.contacts to authenticated;
grant update (name, high_priority_threshold, alert_email, brand_voice, services,
              timezone, followup_interval_days, max_followups, auto_send_followups)
    on public.businesses to authenticated;

-- email_connections: secret columns (tokens, SMTP password) stay hidden.
grant select (id, business_id, from_email, status, daily_send_limit)
    on public.email_connections to authenticated;
grant update (daily_send_limit) on public.email_connections to authenticated;

-- Row policies: a user sees only rows of businesses they belong to.
drop policy if exists "members read leads" on public.leads;
create policy "members read leads" on public.leads
    for select to authenticated
    using (business_id in (select business_id from public.business_members
                           where user_id = (select auth.uid())));

drop policy if exists "members read activity_logs" on public.activity_logs;
create policy "members read activity_logs" on public.activity_logs
    for select to authenticated
    using (business_id in (select business_id from public.business_members
                           where user_id = (select auth.uid())));

drop policy if exists "members read contacts" on public.contacts;
create policy "members read contacts" on public.contacts
    for select to authenticated
    using (business_id in (select business_id from public.business_members
                           where user_id = (select auth.uid())));

drop policy if exists "members update contacts" on public.contacts;
create policy "members update contacts" on public.contacts
    for update to authenticated
    using (business_id in (select business_id from public.business_members
                           where user_id = (select auth.uid())))
    with check (business_id in (select business_id from public.business_members
                                where user_id = (select auth.uid())));

drop policy if exists "members read email_connections" on public.email_connections;
create policy "members read email_connections" on public.email_connections
    for select to authenticated
    using (business_id in (select business_id from public.business_members
                           where user_id = (select auth.uid())));

drop policy if exists "members update email_connections" on public.email_connections;
create policy "members update email_connections" on public.email_connections
    for update to authenticated
    using (business_id in (select business_id from public.business_members
                           where user_id = (select auth.uid())))
    with check (business_id in (select business_id from public.business_members
                                where user_id = (select auth.uid())));

drop policy if exists "members read businesses" on public.businesses;
create policy "members read businesses" on public.businesses
    for select to authenticated
    using (id in (select business_id from public.business_members
                  where user_id = (select auth.uid())));

drop policy if exists "members update businesses" on public.businesses;
create policy "members update businesses" on public.businesses
    for update to authenticated
    using (id in (select business_id from public.business_members
                  where user_id = (select auth.uid())))
    with check (id in (select business_id from public.business_members
                       where user_id = (select auth.uid())));