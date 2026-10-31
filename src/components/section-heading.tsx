import type { ReactNode } from "react";

interface Props {
  index: string;
  title: string;
  aside?: ReactNode;
}

export function SectionHeading({ index, title, aside }: Props) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
      <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
        <span className="font-mono text-xs font-medium text-brand">{index}</span>
        {title}
      </h2>
      {aside ? (
        <span className="hidden text-xs text-muted-foreground sm:block">
          {aside}
        </span>
      ) : null}
    </div>
  );
}
