import { NextResponse } from "next/server";
import { getAuthorizedUser } from "@/lib/auth";
import { sendActionToN8n } from "@/lib/n8n/proxy";
import { actionSchema, leadIdSchema } from "@/lib/schemas/action";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const maxDuration = 120;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getAuthorizedUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const leadId = leadIdSchema.safeParse((await params).id);
  if (!leadId.success) return NextResponse.json({ ok: false, error: "lead_not_found" }, { status: 404 });

  const body: unknown = await request.json().catch(() => null);
  const action = actionSchema.safeParse(body);
  if (!action.success) {
    const hasActionIssue = action.error.issues.some((issue) => issue.path[0] === "action");
    const error = hasActionIssue ? "invalid_action" : "invalid_body";
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: lead, error: lookupError } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId.data)
    .eq("business_id", user.businessId)
    .maybeSingle();
  if (lookupError) return NextResponse.json({ ok: false, error: "lead_lookup_failed" }, { status: 500 });
  if (!lead) return NextResponse.json({ ok: false, error: "lead_not_found" }, { status: 404 });

  const result = await sendActionToN8n(leadId.data, action.data);
  if (result.kind === "unavailable") {
    return NextResponse.json({ ok: false, error: "n8n_unavailable" }, { status: 502 });
  }

  return NextResponse.json(result.reply, { status: result.status });
}