"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActiveItem } from "@/components/nav/Sidebar";
import { SignOutButton } from "@/components/nav/SignOutButton";
import { Icon } from "@/components/ui/Icon";

export function BottomTabBar() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
        >
            <ul className="grid grid-cols-4">
                {NAV_ITEMS.map(({ href, label, icon }) => {
                    const isActive = isActiveItem(pathname, href);
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                aria-current={isActive ? "page" : undefined}
                                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-200 ${
                                    isActive ? "text-accent" : "text-fg-muted active:text-fg"
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`absolute top-0 h-[2px] w-8 rounded-full bg-accent transition-opacity duration-200 ${
                                        isActive ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                                <Icon name={icon} className="h-[18px] w-[18px]" />
                                {label}
                            </Link>
                        </li>
                    );
                })}
                <li>
                    <SignOutButton className="flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-fg-muted transition-colors duration-200 active:text-high" />
                </li>
            </ul>
        </nav>
    );
}