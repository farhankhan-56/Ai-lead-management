"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/nav/SignOutButton";
import { Icon } from "@/components/ui/Icon";

export const NAV_ITEMS = [
    { href: "/leads", label: "Leads", icon: "inbox" },
    { href: "/sender", label: "Sender", icon: "send" },
    { href: "/settings", label: "Settings", icon: "sliders" },
] as const;

export function isActiveItem(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main"
            className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-panel/70 px-4 py-6 backdrop-blur-xl md:flex"
        >
            <Link href="/leads" className="group mb-8 flex items-center gap-3 rounded-xl px-2 py-1">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-ink shadow-glow transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.25}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M4 17 9.5 11l4 4L20 7" />
                        <path d="M15 7h5v5" />
                    </svg>
                </span>
                <span className="leading-tight">
                    <span className="block font-display text-[17px] font-semibold tracking-tight text-fg">
                        Lead Management
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-fg-faint">
                        AI agent console
                    </span>
                </span>
            </Link>
            <ul className="space-y-1">
                {NAV_ITEMS.map(({ href, label, icon }) => {
                    const isActive = isActiveItem(pathname, href);
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                aria-current={isActive ? "page" : undefined}
                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-raised text-fg shadow-card"
                                        : "text-fg-muted hover:bg-raised/60 hover:text-fg"
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200 ${
                                        isActive ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                                <Icon
                                    name={icon}
                                    className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5 ${
                                        isActive ? "text-accent" : ""
                                    }`}
                                />
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <SignOutButton className="mt-auto flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-muted transition-colors duration-200 hover:bg-high/10 hover:text-high" />
        </nav>
    );
}