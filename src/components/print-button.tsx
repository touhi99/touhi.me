"use client";

import { Printer } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props {
  compact?: boolean;
  className?: string;
}

export function PrintButton({ compact = false, className }: Props) {
  return (
    <Button
      variant={compact ? "ghost" : "outline"}
      size={compact ? "icon" : "sm"}
      onClick={() => window.print()}
      aria-label={compact ? "Print or save as PDF" : undefined}
      className={cn(
        "no-print gap-2",
        compact
          ? "h-9 w-9 text-muted-foreground hover:text-foreground"
          : "h-9 rounded-full px-4",
        className,
      )}
    >
      <Printer className="h-4 w-4" />
      {!compact && <span>Download CV</span>}
    </Button>
  );
}
