"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Copy,
  Mail,
  Printer,
  Search,
  SunMoon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface Props {
  links: { url: string; title: string }[];
  email?: string;
}

const SECTIONS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#publications", label: "Publications" },
];

export const CommandMenu = ({ links, email }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const openMenu = () => setOpen(true);

    document.addEventListener("keydown", down);
    window.addEventListener("open-command-menu", openMenu);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-menu", openMenu);
    };
  }, []);

  React.useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const scrollTo = (href: string) => {
    setOpen(false);
    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleTheme = () => {
    setOpen(false);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  };

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setOpen(false), 600);
    } catch {
      setOpen(false);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Command menu</DialogTitle>
      <DialogDescription className="sr-only">
        Search sections, links, and actions.
      </DialogDescription>
      <CommandInput placeholder="Search sections, links, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Jump to">
          {SECTIONS.map((section) => (
            <CommandItem
              key={section.href}
              value={`${section.label} ${section.href}`}
              onSelect={() => scrollTo(section.href)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>{section.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="print save pdf download cv"
            onSelect={() => {
              setOpen(false);
              window.print();
            }}
          >
            <Printer className="mr-2 h-4 w-4" />
            <span>Print / Save as PDF</span>
          </CommandItem>
          <CommandItem value="toggle theme dark light" onSelect={toggleTheme}>
            <SunMoon className="mr-2 h-4 w-4" />
            <span>Toggle theme</span>
          </CommandItem>
          {email ? (
            <CommandItem
              value={`copy email ${email}`}
              onSelect={copyEmail}
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>{copied ? "Email copied" : "Copy email address"}</span>
            </CommandItem>
          ) : null}
          {email ? (
            <CommandItem
              value="send email contact"
              onSelect={() => {
                setOpen(false);
                window.location.href = `mailto:${email}`;
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              <span>Send email</span>
            </CommandItem>
          ) : null}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          {links.map(({ url, title }) => (
            <CommandItem
              key={url}
              value={`${title} ${url}`}
              onSelect={() => {
                setOpen(false);
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <span>{title}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
