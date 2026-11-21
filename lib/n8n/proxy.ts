import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import type { ActionInput } from "@/lib/schemas/action";
import type { LeadInput } from "@/lib/schemas/lead";

const LEAD_SOURCE = "website";
const N8N_TIMEOUT_MS = 115000;
const HANDLED_STATUSES = [200, 400];

const leadCaptureReplySchema = z.object({
    ok: z.boolean(),
    duplicate: z.boolean().optional(),
    lead_id: z.union([z.string(), z.number()]).optional(),
    score: z.number().nullable().optional(),
    priority: z.string().nullable().optional(),
    error: z.string().optional(),
});

export type LeadCaptureReply = z.infer<typeof leadCaptureReplySchema>;

export type LeadCaptureResult =
    | { kind: "reply"; status: number; reply: LeadCaptureReply }
    | { kind: "unavailable" };

export async function sendLeadToN8n(lead: LeadInput): Promise<LeadCaptureResult> {
    const { N8N_LEAD_URL } = getServerEnv();

    let response: Response;
    try {
        response = await fetch(N8N_LEAD_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...lead, source: LEAD_SOURCE }),
            signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
            cache: "no-store",
        });
    } catch {
        return { kind: "unavailable" };
    }

    if (!HANDLED_STATUSES.includes(response.status)) return { kind: "unavailable" };

    const parsed = leadCaptureReplySchema.safeParse(await response.json().catch(() => null));
    if (!parsed.success) return { kind: "unavailable" };

    return { kind: "reply", status: response.status, reply: parsed.data };
}

const ACTION_KEY_HEADER = "x-agent-security";
const ACTION_HANDLED_STATUSES = [200, 400, 404, 409];

const leadActionReplySchema = z.object({
    ok: z.boolean(),
    action: z.string().optional(),
    lead_id: z.union([z.string(), z.number()]).optional(),
    email_status: z.string().optional(),
    draft_subject: z.string().optional(),
    error: z.string().optional(),
    reason: z.string().optional(),
});

export type LeadActionReply = z.infer<typeof leadActionReplySchema>;

export type LeadActionResult =
    | { kind: "reply"; status: number; reply: LeadActionReply }
    | { kind: "unavailable" };

export async function sendActionToN8n(leadId: string, input: ActionInput): Promise<LeadActionResult> {
    const { N8N_ACTION_URL, N8N_ACTION_KEY } = getServerEnv();
    const isApprove = input.action === "approve";

    let response: Response;
    try {
        response = await fetch(N8N_ACTION_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", [ACTION_KEY_HEADER]: N8N_ACTION_KEY },
            body: JSON.stringify({
                lead_id: leadId,
                action: input.action,
                ...(isApprove && { subject: input.subject, body: input.body }),
            }),
            signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
            cache: "no-store",
        });
    } catch {
        return { kind: "unavailable" };
    }

    if (!ACTION_HANDLED_STATUSES.includes(response.status)) return { kind: "unavailable" };

    const parsed = leadActionReplySchema.safeParse(await response.json().catch(() => null));
    if (!parsed.success) return { kind: "unavailable" };

    return { kind: "reply", status: response.status, reply: parsed.data };
}
