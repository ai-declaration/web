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
        <a
          href="https://github.com/ai-declaration/web"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub repository"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
        <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
