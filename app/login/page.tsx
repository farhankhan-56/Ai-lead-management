"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

const SIGN_IN_ERROR = "Invalid email or password.";
const inputClass =
    "w-full rounded border border-slate-400 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900";

export default function LoginPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const credentials = credentialsSchema.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
        });
        if (!credentials.success) {
            setErrorMessage(SIGN_IN_ERROR);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        const { error } = await createSupabaseBrowserClient().auth.signInWithPassword(credentials.data);
        if (error) {
            setErrorMessage(SIGN_IN_ERROR);
            setIsSubmitting(false);
            return;
        }

        router.replace("/leads");
        router.refresh();
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow">
                <h1 className="text-xl font-semibold">Sign in</h1>

                <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email
                    </label>
                    <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className={inputClass}
                    />
                </div>

                {errorMessage && (
                    <p role="alert" className="text-sm text-red-700">
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded bg-slate-900 px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-60">
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </main>
    );
}