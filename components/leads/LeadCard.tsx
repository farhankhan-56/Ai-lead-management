"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PriorityBadge } from "@/components/leads/PriorityBadge";
import { StatusBadge } from "@/components/leads/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Icon } from "@/components/ui/Icon";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { formatDate } from "@/lib/format";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { LeadWithContact } from "@/lib/types";

// Renders a list item, so it must sit inside a <ul>.
export function LeadCard({ lead }: { lead: LeadWithContact }) {
    const router = useRouter();
    const [isRemoved, setIsRemoved] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const isSending = lead.email_status === "SENDING";
    const deleteLabel = isSending ? "Can't delete while the email is sending" : `Delete ${lead.contact.full_name}`;

    async function handleConfirmDelete() {
        setIsConfirmOpen(false);
        setIsDeleting(true);
        const { data, error } = await createSupabaseBrowserClient()
            .from("leads")
            .delete()
            .eq("id", lead.id)
            .select("id");
        setIsDeleting(false);

        if (error || !data?.length) {
            setToast({ tone: "error", message: "Could not delete this lead. Try again." });
            return;
        }

        setIsRemoved(true);
        router.refresh();
    }

    if (isRemoved) return null;

    return (
        <li className="flex">
            <article className="group relative flex flex-1 cursor-pointer flex-col gap-4 rounded-2xl border border-line bg-panel p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-raised has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent">
                <header className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold leading-snug text-fg">
                            <Link
                                href={`/leads/${lead.id}`}
                                className="transition-colors duration-200 after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent focus-visible:outline-none"
                            >
                                {lead.contact.full_name}
                            </Link>
                        </h2>
                        <p className="mt-0.5 truncate text-sm text-fg-muted">{lead.contact.company ?? "No company"}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                        <span className="font-mono text-2xl font-semibold leading-none tabular-nums text-fg">
                            {lead.score ?? "—"}
                        </span>
                        <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-fg-faint">score</span>
                    </div>
                </header>

                <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">
                    {lead.ai_summary ?? "No summary yet."}
                </p>

                <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={lead.priority} />
                        <StatusBadge status={lead.email_status} />
                    </div>
                    <div className="flex items-center gap-2">
                        <time dateTime={lead.created_at} className="text-xs text-fg-faint">
                            {formatDate(lead.created_at)}
                        </time>
                        <button
                            type="button"
                            aria-label={deleteLabel}
                            title={deleteLabel}
                            disabled={isSending || isDeleting}
                            onClick={() => setIsConfirmOpen(true)}
                            className="relative z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-fg-faint transition-colors duration-200 hover:bg-high/15 hover:text-high disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg-faint"
                        >
                            <Icon name="trash" className="h-4 w-4" />
                        </button>
                    </div>
                </footer>

                {isConfirmOpen && (
                    <ConfirmDialog
                        isOpen
                        title={`Delete ${lead.contact.full_name}?`}
                        message="This permanently removes the lead and its activity log. This cannot be undone."
                        confirmLabel="Delete lead"
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setIsConfirmOpen(false)}
                    />
                )}
                {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
            </article>
        </li>
    );
}