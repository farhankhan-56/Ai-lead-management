import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthorizedUser = { userId: string; businessId: string };

// Returns the signed-in user and their business, or null when either is missing.
export async function getAuthorizedUser(): Promise<AuthorizedUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) return null;

  return { userId: user.id, businessId: membership.business_id };
}