import type { ZodError } from "zod";

export type FieldErrors = Partial<Record<string, string>>;

export function getFieldErrors(error: ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0]);
    fieldErrors[field] ??= issue.message;
  }
  return fieldErrors;
}