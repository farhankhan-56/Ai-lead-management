drop policy if exists "members delete leads" on public.leads;
revoke delete on public.leads from authenticated;