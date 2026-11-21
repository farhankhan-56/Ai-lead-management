import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-sm space-y-3 rounded-lg bg-white p-6 text-center shadow">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-slate-700">This page does not exist, or you do not have access to it.</p>
        <Link
          href="/leads"
          className="inline-block rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Back to leads
        </Link>
      </div>
    </main>
  );
}