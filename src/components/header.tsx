"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const navItems = [
  { href: "/generator", label: "Generator" },
  { href: "/validator", label: "Validator" },
  { href: "/library", label: "Library" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-2 sm:px-4 sm:py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.svg" alt="AI Declaration Format" className="h-8 w-8" />
          <span className="hidden text-lg font-semibold sm:inline">AI Declaration Format</span>
        </Link>
        <div className="flex items-center gap-3">
        <nav role="tablist" aria-label="Main navigation" className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
                className={`whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium transition-colors sm:px-3 sm:py-1.5 ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
