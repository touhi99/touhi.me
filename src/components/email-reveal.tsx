"use client";

import * as React from "react";
import { Copy, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  enc: string;
  kind: "link" | "cta";
  className?: string;
  children: React.ReactNode;
}

export function EmailReveal({ enc, kind, className, children }: Props) {
  const [address, setAddress] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  if (!address) {
    return kind === "cta" ? (
      <Button
        className="h-9 rounded-full px-4"
        onClick={() => setAddress(atob(enc))}
      >
        <Mail className="mr-2 h-4 w-4" />
        {children}
      </Button>
    ) : (
      <button
        type="button"
        className={className}
        onClick={() => setAddress(atob(enc))}
      >
        {children}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <a
        href={`mailto:${address}`}
        className={
          kind === "cta"
            ? "text-sm font-medium underline underline-offset-4"
            : className
        }
      >
        {address}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Copy className="h-3 w-3" />
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
