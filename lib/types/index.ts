import type { EmailStatus } from "@/lib/email-status";

export type ActivityType =
    | "duplicate_note"
    | "scored"
    | "draft_created"
    | "approved"
    | "rejected"
    | "email_sent"
    | "send_failed"
    | "send_skipped";

export type ActivityActor = "system" | "rep" | "user";

export type Contact = {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    company: string | null;
    opted_out: boolean;
};

export type Lead = {
    id: string;
    contact_id: string;
    source: string | null;
    budget: string | null;
    timeline: string | null;
    project_notes: string | null;
    score: number | null;
    priority: string | null;
    ai_summary: string | null;
    next_action: string | null;
    lead_status: string | null;
    email_status: EmailStatus;
    draft_subject: string | null;
    draft_body: string | null;
    sent_at: string | null;
    next_followup_date: string | null;
    followup_count: number;
    followup_paused: boolean;
    created_at: string;
};

export type LeadWithContact = Lead & {
    contact: Pick<Contact, "full_name" | "company">;
};

export type ActivityLog = {
    lead_id: string;
    type: ActivityType;
    detail: string | null;
    actor: ActivityActor;
    created_at: string;
};

export type LeadDetail = Lead & {
    contact: Contact;
};

export type Business = {
    id: string;
    name: string;
    high_priority_threshold: number;
    alert_email: string | null;
    brand_voice: string | null;
    services: string | null;
    timezone: string;
    followup_interval_days: number;
    max_followups: number;
    auto_send_followups: boolean;
};

export type EmailConnection = {
    id: string;
    from_email: string;
    status: string;
    daily_send_limit: number;
};