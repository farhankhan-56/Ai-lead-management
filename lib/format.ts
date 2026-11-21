const DATE_TIME = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
const DATE_ONLY = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" });

export function formatDateTime(isoText: string): string {
  return `${DATE_TIME.format(new Date(isoText))} UTC`;
}

export function formatDate(isoText: string): string {
  return DATE_ONLY.format(new Date(isoText));
}