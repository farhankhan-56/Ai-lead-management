"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div role="alert" className="max-w-sm space-y-3 rounded-lg bg-white p-6 text-center shadow">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-slate-700">The page could not be loaded. Try again.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}