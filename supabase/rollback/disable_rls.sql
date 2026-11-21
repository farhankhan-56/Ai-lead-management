-- Emergency rollback: turns RLS off on all six tables. Policies and grants stay.
alter table public.businesses        disable row level security;
alter table public.contacts          disable row level security;
alter table public.leads             disable row level security;
alter table public.activity_logs     disable row level security;
alter table public.email_connections disable row level security;
alter table public.business_members  disable row level security;