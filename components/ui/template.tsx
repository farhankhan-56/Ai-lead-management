import type { ReactNode } from "react";

// A template remounts on every navigation, so each page slides in.
export default function AppTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}