import { OptOutSwitch } from "@/components/lead-detail/OptOutSwitch";
import type { Contact } from "@/lib/types";

export function ContactHeader({ contact }: { contact: Contact }) {
  const details = [contact.company, contact.email, contact.phone].filter(Boolean).join(" · ");

  return (
    <header className="mb-4 space-y-2">
      <h1 className="text-xl font-semibold text-slate-900">{contact.full_name}</h1>
      <p className="text-sm text-slate-700">{details}</p>
      <OptOutSwitch contactId={contact.id} initialValue={contact.opted_out} />
    </header>
  );
}