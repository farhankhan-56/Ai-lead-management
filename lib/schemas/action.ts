import { z } from "zod";

export const leadIdSchema = z.string().regex(/^[A-Za-z0-9-]{1,64}$/);

export const actionSchema = z.object({
  action: z.enum(["draft", "approve", "reject"]),
  subject: z.string().trim().min(1).max(200).optional(),
  body: z.string().trim().min(1).max(10000).optional(),
});

export type ActionInput = z.infer<typeof actionSchema>;