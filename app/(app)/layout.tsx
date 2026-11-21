import type { ReactNode } from "react";
import { Sidebar } from "@/components/nav/Sidebar";
import { BottomTabBar } from "@/components/nav/BottomTabBar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-10 md:pb-12 md:pt-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
      <BottomTabBar />
    </div>
  );
}