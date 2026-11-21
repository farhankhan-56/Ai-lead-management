import { z } from "zod";

function optionalText(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value === "" ? undefined : value))
    .optional();
}

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email("Enter a valid email address")),
  phone: optionalText(50),
  company: optionalText(200),
  service: optionalText(200),
  budget: optionalText(100),
  timeline: optionalText(100),
  requirements: optionalText(5000),
});

export type LeadInput = z.infer<typeof leadSchema>;