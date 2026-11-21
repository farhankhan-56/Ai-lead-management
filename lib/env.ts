import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverSchema = z.object({
  N8N_LEAD_URL: z.url(),
  N8N_ACTION_URL: z.url(),
  N8N_ACTION_KEY: z.string().min(1),
});

function parseEnv<T extends z.ZodType>(schema: T, source: unknown): z.infer<T> {
  const result = schema.safeParse(source);
  if (result.success) return result.data;

  const problems = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  throw new Error(`Invalid environment variables - ${problems.join("; ")}`);
}

export function getPublicEnv() {
  return parseEnv(publicSchema, {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function getServerEnv() {
  if (typeof window !== "undefined") throw new Error("getServerEnv() is server-only");
  return parseEnv(serverSchema, process.env);
}