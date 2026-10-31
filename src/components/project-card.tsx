import { ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  description: string;
  tags: readonly string[];
  link?: string;
  linkLabel?: string;
  clamp?: boolean;
}

const cardClassName =
  "group relative flex h-full break-inside-avoid flex-col rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:shadow-black/20";

interface BodyProps extends Omit<Props, "link"> {}

function CardBody({
  title,
  description,
  tags,
  linkLabel,
  clamp = true,
}: BodyProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground">
          {title}
        </h3>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
      </div>
      <p
        className={`mt-2 text-sm leading-relaxed text-muted-foreground ${
          clamp ? "line-clamp-4" : ""
        }`}
      >
        {description}
      </p>
      <div className="mt-auto flex items-end justify-between gap-2 pt-4">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border/70 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        {linkLabel ? (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground/70">
            {linkLabel}
          </span>
        ) : null}
      </div>
    </>
  );
}

export function ProjectCard({
  title,
  description,
  tags,
  link,
  linkLabel,
  clamp,
}: Props) {
  const body = (
    <CardBody
      title={title}
      description={description}
      tags={tags}
      linkLabel={linkLabel}
      clamp={clamp}
    />
  );

  if (!link) {
    return <div className={cardClassName}>{body}</div>;
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
      aria-label={`${title} (opens in a new tab)`}
    >
      {body}
    </a>
  );
}
