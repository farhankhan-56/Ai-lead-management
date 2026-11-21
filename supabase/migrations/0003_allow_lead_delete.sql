-- Lets signed-in members delete leads of their own business (dashboard delete button).
-- Run once in the Supabase SQL editor. To undo, run supabase/rollback/revoke_lead_delete.sql.
grant delete on public.leads to authenticated;

drop policy if exists "members delete leads" on public.leads;
create policy "members delete leads" on public.leads
    for delete to authenticated
    using (business_id in (select business_id from public.business_members
                           where user_id = (select auth.uid())));