"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton({ className }: { className: string }) {
  const router = useRouter();
  const [hasFailed, setHasFailed] = useState(false);

  async function handleSignOut() {
    setHasFailed(false);
    const { error } = await createSupabaseBrowserClient().auth.signOut({ scope: "local" });
    if (error) {
      setHasFailed(true);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={handleSignOut} className={className}>
        <Icon name="logout" className="h-[18px] w-[18px]" />
        Sign out
      </button>
      {hasFailed && (
        <p role="alert" className="px-3 text-xs text-high">
          Sign out failed. Try again.
        </p>
      )}
    </>
  );
}