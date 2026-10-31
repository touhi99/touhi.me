import {
  ArrowUp,
  ArrowUpRight,
  Cloud,
  Database,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { CommandMenu } from "@/components/command-menu";
import { PrintButton } from "@/components/print-button";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { RESUME_DATA } from "@/data/resume-data";

const SKILL_GROUP_ICONS = [Sparkles, Database, Cloud] as const;

function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: RESUME_DATA.name,
  jobTitle: RESUME_DATA.role,
  description: RESUME_DATA.specialties,
  url: RESUME_DATA.personalWebsiteUrl,
  email: RESUME_DATA.contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Munich",
    addressCountry: "DE",
  },
  worksFor: {
    "@type": "Organization",
    name: RESUME_DATA.company,
    url: "https://www.deepset.ai",
  },
  sameAs: RESUME_DATA.contact.social.map((social) => social.url),
  alumniOf: RESUME_DATA.education.map((education) => ({
    "@type": "CollegeOrUniversity",
    name: education.school,
  })),
  knowsAbout: RESUME_DATA.skillGroups.flatMap((group) => group.skills),
};

export default function Page() {
  const { contact, role, company, specialties, summary } = RESUME_DATA;
  const email = contact.email;
  const featuredProjects = RESUME_DATA.projects.filter(
    (project) => "featured" in project && project.featured,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <a
        href="#content"
        className="sr-only rounded-md bg-foreground px-3 py-2 text-sm text-background focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main
        id="top"
        className="mx-auto w-full max-w-4xl scroll-mt-20 px-4 sm:px-6"
      >
        {/* Hero */}
        <section className="flex animate-fade-up scroll-mt-20 flex-col-reverse gap-8 pb-12 pt-10 sm:flex-row sm:items-start sm:justify-between sm:pt-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              {role} at {company}
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl">
              {RESUME_DATA.name}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {specialties}
            </p>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              I help enterprise teams design, build, and ship production-grade
              Generative AI applications on the Haystack Enterprise Platform.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <a
                href={RESUME_DATA.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <MapPin className="h-3.5 w-3.5" />
                {RESUME_DATA.location}
                <span className="text-muted-foreground/60">
                  · {RESUME_DATA.timezone}
                </span>
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </a>
              {contact.social.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <social.icon className="h-3.5 w-3.5" />
                  {social.name}
                </a>
              ))}
            </div>

            <div className="no-print mt-6 flex flex-wrap items-center gap-2">
              <Button asChild className="h-9 rounded-full px-4">
                <a href={`mailto:${email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Get in touch
                </a>
              </Button>
              <PrintButton />
            </div>
          </div>

          <div className="relative shrink-0">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-brand/20 via-brand/5 to-transparent blur-xl"
            />
            <Avatar className="relative h-24 w-24 rounded-2xl ring-1 ring-border sm:h-28 sm:w-28">
              <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
              <AvatarFallback className="rounded-2xl font-mono text-lg">
                {RESUME_DATA.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </section>

        <div id="content" className="space-y-12 pb-16 sm:space-y-14">
          {/* About */}
          <Section id="about" className="animate-fade-up-delayed">
            <SectionHeading index="01" title="About" />
            <p className="max-w-3xl text-pretty text-[15px] leading-7 text-muted-foreground">
              {summary}
            </p>
          </Section>

          {/* Experience */}
          <Section id="experience">
            <SectionHeading
              index="02"
              title="Experience"
              aside="Forward deployed · Enterprise AI"
            />
            <div className="overflow-hidden rounded-xl border border-border bg-card/40">
              {RESUME_DATA.work.map((work, index) => {
                const isCurrent = work.end === "Present";

                return (
                  <div
                    key={`${work.company}-${work.start}`}
                    className={`group break-inside-avoid px-4 py-5 transition-colors hover:bg-card sm:px-5 ${
                      index !== 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border font-mono text-xs font-semibold transition-colors ${
                          isCurrent
                            ? "border-brand/30 bg-brand-soft text-brand"
                            : "border-border bg-secondary/50 text-muted-foreground group-hover:text-foreground"
                        }`}
                        aria-hidden
                      >
                        {monogram(work.company)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h3 className="text-[15px] font-semibold leading-none">
                              <a
                                href={work.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 underline-offset-4 hover:text-brand hover:underline"
                              >
                                {work.company}
                                <ArrowUpRight className="h-3 w-3 opacity-40" />
                              </a>
                            </h3>
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand">
                                <span className="h-1 w-1 rounded-full bg-brand" />
                                Now
                              </span>
                            ) : null}
                            {work.badges.map((badge) => (
                              <Badge
                                key={badge}
                                variant="secondary"
                                className="border-border/60 bg-secondary/60 px-1.5 py-0 font-mono text-[10px] font-medium text-muted-foreground"
                              >
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <span className="font-mono text-xs tabular-nums text-muted-foreground">
                            {work.start} — {work.end}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm font-medium text-foreground/90">
                          {work.title}
                        </p>
                        <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                          {work.description}
                        </p>
                        {"highlights" in work && work.highlights.length > 0 ? (
                          <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                            {work.highlights.map((highlight) => (
                              <li
                                key={highlight}
                                className="flex gap-2.5 text-pretty"
                              >
                                <span
                                  aria-hidden
                                  className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-brand/70"
                                />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Education */}
          <Section id="education">
            <SectionHeading index="03" title="Education" />
            <div className="grid gap-3 sm:grid-cols-2">
              {RESUME_DATA.education.map((education) => (
                <div
                  key={education.school}
                  className="break-inside-avoid rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-sm">
                      {education.school}
                    </h3>
                    <GraduationCap
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {education.degree}
                  </p>
                  <p className="mt-3 font-mono text-xs tabular-nums text-muted-foreground">
                    {education.start} — {education.end}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section id="skills">
            <SectionHeading index="04" title="Skills" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RESUME_DATA.skillGroups.map((group, index) => {
                const Icon = SKILL_GROUP_ICONS[index] ?? Sparkles;

                return (
                  <div
                    key={group.title}
                    className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-brand/20 bg-brand-soft text-brand">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold tracking-tight">
                        {group.title}
                      </h3>
                      <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground">
                        {group.skills.length}
                      </span>
                    </div>
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[11px] font-medium text-foreground/80 transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Projects */}
          <Section id="projects">
            <SectionHeading index="05" title="Projects" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.techStack}
                  link={"link" in project ? project.link.href : undefined}
                  linkLabel="GitHub"
                />
              ))}
            </div>
            <div className="no-print flex justify-center pt-1">
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <a
                  href="https://github.com/touhi99"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More on GitHub
                  <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </Section>

          {/* Publications */}
          <Section id="publications" className="print-break">
            <SectionHeading index="06" title="Publications" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RESUME_DATA.publications.map((publication) => (
                <ProjectCard
                  key={publication.title}
                  title={publication.title}
                  description={publication.description}
                  tags={publication.techStack}
                  link={"link" in publication ? publication.link.href : undefined}
                  linkLabel={
                    "link" in publication
                      ? publication.link.label === "aclweb"
                        ? "ACL"
                        : publication.link.label
                      : undefined
                  }
                  clamp={false}
                />
              ))}
            </div>
          </Section>
        </div>
      </main>

      <footer className="no-print border-t border-border">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {RESUME_DATA.name}. Built with
            Next.js.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href={`mailto:${email}`}
              className="transition-colors hover:text-foreground"
            >
              Email
            </a>
            {contact.social.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {social.name}
              </a>
            ))}
            <span className="hidden items-center gap-1.5 sm:flex">
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
              to search
            </span>
            <a
              href="#top"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      <CommandMenu
        email={email}
        links={[
          {
            url: RESUME_DATA.personalWebsiteUrl,
            title: "Personal Website",
          },
          ...contact.social.map((social) => ({
            url: social.url,
            title: social.name,
          })),
        ]}
      />
    </>
  );
}
