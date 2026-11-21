import { z } from "zod";

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function wholeNumber(min: number, max: number) {
  const message = `Enter a whole number from ${min} to ${max}`;
  return z
    .string()
    .trim()
    .min(1, message)
    .transform(Number)
    .pipe(z.number(message).int(message).min(min, message).max(max, message));
}

function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value === "" ? null : value));
}

export const dailyLimitSchema = wholeNumber(1, 10000);

export const businessSettingsSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  high_priority_threshold: wholeNumber(0, 100),
  alert_email: z
    .string()
    .trim()
    .max(254)
    .refine((value) => value === "" || z.email().safeParse(value).success, "Enter a valid email address")
    .transform((value) => (value === "" ? null : value)),
  brand_voice: optionalText(2000),
  services: optionalText(2000),
  timezone: z
    .string()
    .trim()
    .refine(isValidTimeZone, "Enter a valid time zone, for example Asia/Karachi"),
  followup_interval_days: wholeNumber(1, 365),
  max_followups: wholeNumber(0, 20),
  auto_send_followups: z.boolean(),
});

export type BusinessSettings = z.infer<typeof businessSettingsSchema>;