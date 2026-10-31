"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PrintButton } from "./print-button";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#publications", label: "Publications" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openCommandMenu = () =>
    window.dispatchEvent(new CustomEvent("open-command-menu"));

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300",
        scrolled
          ? "border-border/70 bg-background/80"
          : "border-transparent bg-background/50",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground font-mono text-[11px] font-semibold tracking-tight text-background transition-transform duration-200 group-hover:-rotate-3">
            TA
          </span>
          <span className="whitespace-nowrap text-sm font-semibold tracking-tight">
            Touhidul Alam
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openCommandMenu}
            className="hidden h-9 items-center gap-2 rounded-md border border-border bg-card/60 px-2.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex sm:w-36 md:w-44"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px] leading-4 text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground sm:hidden"
            onClick={openCommandMenu}
            aria-label="Open command menu"
          >
            <Search className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <PrintButton compact />
        </div>
      </div>
    </header>
  );
}
