import type { RESUME_DATA } from "@/data/resume-data";

type Resume = typeof RESUME_DATA;

export type NodeType =
  | "role"
  | "edu"
  | "project"
  | "paper"
  | "skill"
  | "group"
  | "hl"
  | "contact";

export interface GNode {
  id: string;
  type: NodeType;
  title: string;
  /** Shorter label drawn on the map. */
  short?: string;
  sub: string;
  x: number;
  y: number;
  r: number;
  body: string;
  when?: string;
  tags?: string[];
  links?: [string, string][];
  text?: string[];
  /** Year span, used for the duration rails. */
  a?: number;
  b?: number;
  /** Accent colour override. */
  col?: string;
  /** Label in the detail panel. */
  kind?: string;
  /** Hub this node belongs to; hidden until the hub is open. */
  parent?: string;
  /** Node whose children are listed as highlights. */
  hls?: boolean;
}

export type EdgeKind = "t" | "l" | "h" | "s" | "k";

export interface GEdge {
  a: string;
  b: string;
  kind: EdgeKind;
}

export interface Graph {
  nodes: GNode[];
  edges: GEdge[];
  /** Experience path, newest first. */
  path: string[];
}

export const TYPE_META: Record<NodeType, { name: string; color: string }> = {
  role: { name: "Experience", color: "#34d399" },
  edu: { name: "Education", color: "#97b4ff" },
  project: { name: "Project", color: "#ff7a50" },
  paper: { name: "Research", color: "#c9a4ff" },
  skill: { name: "Skill", color: "#7fd9ff" },
  group: { name: "Skill group", color: "#7fd9ff" },
  hl: { name: "Highlight", color: "#34d399" },
  contact: { name: "Contact", color: "#ffb3c7" },
};

export const skillId = (name: string) =>
  "sk:" + name.toLowerCase().replace(/[^a-z0-9]+/g, "");

/** Time runs upward: 2011 at y = 0, later years higher. */
const Y = (year: number) => -(year - 2011) * 150;

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Authored layout and short copy. Content comes from RESUME_DATA by index. */
const ROLES = [
  { id: "deepset", x: 0, y: Y(2026.45), r: 22 },
  { id: "arch", x: 24, y: Y(2023), r: 28, hls: true },
  { id: "fraun", x: -30, y: Y(2019.5), r: 16 },
  { id: "intern", x: 40, y: Y(2018.5), r: 15 },
  { id: "smart", x: -40, y: Y(2017.5), r: 15 },
  { id: "panacea", x: 30, y: Y(2016.5), r: 15 },
];

const EDU = [
  { id: "msc", title: "MSc Computational Linguistics", x: -380, y: Y(2018.5), r: 19 },
  { id: "bsc", title: "BSc Computer Science and Engineering", x: -380, y: Y(2013), r: 17 },
];

const HIGHLIGHTS: { title: string; dx: number; dy: number }[] = [
  { title: "RAG reference architecture", dx: 150, dy: -175 },
  { title: "Evaluation and observability", dx: 215, dy: -50 },
  { title: "NLP recommendation system", dx: 210, dy: 125 },
  { title: "Workshops and hackathons", dx: -200, dy: -150 },
  { title: "Mentoring and architecture", dx: -270, dy: -10 },
];

const PROJECTS = [
  { id: "atlas", sub: "Dashboard and knowledge-graph agent", x: 780, y: -2240, big: true },
  { id: "crew", sub: "Multi-agent with RAG", x: 1020, y: -2070, big: true },
  { id: "search", sub: "Search, analyse, generate", x: 790, y: -1960, big: true },
  { id: "kg", sub: "Cypher search over a graph", x: 1040, y: -1840, big: true },
  { id: "tags", sub: "Tags with an open-source LLM", x: 770, y: -1580, big: true },
  { id: "datime", sub: "Temporal expression recognizer", x: 700, y: -1390, big: true },
  { id: "music", sub: "Language modeling on MIDI", x: 1010, y: -1570 },
  { id: "dialog", sub: "Ensemble model, speech and text", x: 910, y: -1440 },
  { id: "emotion", sub: "Twitter text and image", x: 1050, y: -1320 },
  { id: "ngram", sub: "N-gram model from scratch", x: 860, y: -1220 },
];

/** Publications are listed newest first in RESUME_DATA. */
const PAPERS = [
  { id: "arxiv", short: "LLMs in conversational agents", venue: "arXiv 2023", year: 2023.4 },
  { id: "iwcs", short: "New Domain, Major Effort?", venue: "IWCS 2021", year: 2021.3 },
  { id: "pate", short: "PÂTÉ", venue: "LREC 2020", year: 2020.2 },
];

const GROUPS = [
  { id: "gen", x: -700, y: -2150 },
  { id: "eng", x: -840, y: -1790 },
  { id: "ml", x: -650, y: -1480 },
];

/** Skills each project or highlight draws on. Matches the tech stacks plus the descriptions. */
const PROJECT_SKILLS: Record<string, string[]> = {
  atlas: ["Python", "FastAPI", "Haystack", "Graph DB"],
  crew: ["Python", "LangChain", "Multi-agent Systems", "RAG", "LLM"],
  search: ["Python", "LangChain", "Multi-agent Systems", "LLM"],
  kg: ["Python", "LangChain", "Cypher", "Graph DB", "LLM"],
  tags: ["Python", "LLM"],
  datime: ["Python"],
  music: ["Python", "PyTorch"],
  dialog: ["Python"],
  emotion: ["Python"],
  ngram: ["Python"],
  arxiv: ["LLM"],
  hl0: ["RAG"],
  hl1: ["LLM Evaluation", "Langfuse"],
};

export function buildGraph(data: Resume): Graph {
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const byId = new Map<string, GNode>();
  const add = (n: GNode) => {
    nodes.push(n);
    byId.set(n.id, n);
    return n;
  };
  const link = (a: string, b: string, kind: EdgeKind = "l") => {
    if (!byId.has(a) || !byId.has(b)) throw new Error(`graph edge ${a} > ${b}`);
    edges.push({ a, b, kind });
  };

  const place = data.location.split(",")[0];
  add({
    id: "contact",
    type: "contact",
    title: "Say hello",
    sub: `${place} · ${data.timezone}`,
    x: 0,
    y: -2480,
    r: 14,
    body: "Open to a conversation about GenAI, RAG and agents.",
    links: data.contact.social.map((s) => [s.name, s.url] as [string, string]),
  });

  data.work.forEach((w, i) => {
    const c = ROLES[i];
    const now = w.end === "Present";
    const end = now ? 2027 : Number(w.end);
    add({
      id: c.id,
      type: "role",
      title: w.title,
      sub: `${w.company} · ${w.start} ${now ? "→ now" : "– " + w.end}`,
      x: c.x,
      y: c.y,
      r: c.r,
      a: Number(w.start),
      b: end,
      body: w.description,
      tags: [...w.badges],
      hls: c.hls,
      links: [[host(w.link), w.link]],
      when: `${w.start} – ${w.end}`,
    });
  });

  const arch = data.work[1];
  const archHighlights = "highlights" in arch ? arch.highlights : [];
  HIGHLIGHTS.forEach((h, i) => {
    add({
      id: `hl${i}`,
      type: "hl",
      title: h.title,
      sub: "Accenture highlight",
      x: ROLES[1].x + h.dx,
      y: ROLES[1].y + h.dy,
      r: 9,
      body: archHighlights[i] ?? "",
      when: "2020 – 2026",
      parent: "arch",
    });
  });

  data.education.forEach((e, i) => {
    const c = EDU[i];
    add({
      id: c.id,
      type: "edu",
      title: c.title,
      sub: `${e.school} · ${e.start} – ${e.end}`,
      x: c.x,
      y: c.y,
      r: c.r,
      a: Number(e.start),
      b: Number(e.end),
      body: e.degree,
      when: `${e.start} – ${e.end}`,
    });
  });

  data.publications.forEach((p, i) => {
    const c = PAPERS[i];
    add({
      id: c.id,
      type: "paper",
      title: p.title,
      short: c.short,
      sub: c.venue,
      x: 490,
      y: Y(c.year),
      r: 14,
      body: p.description.replace(/\s+/g, " ").trim(),
      tags: [...p.techStack],
      links: [[p.link.label, p.link.href]],
      when: c.venue,
      parent: "research",
    });
  });

  data.projects.forEach((p, i) => {
    const c = PROJECTS[i];
    add({
      id: c.id,
      type: "project",
      title: p.title,
      sub: c.sub,
      x: c.x,
      y: c.y,
      r: c.big ? 15 : 12,
      body: p.description,
      tags: [...p.techStack],
      links: [[p.link.label, p.link.href]],
      when: "Open source",
      parent: "oss",
    });
  });

  data.skillGroups.forEach((g, i) => {
    const c = GROUPS[i];
    add({
      id: c.id,
      type: "group",
      title: g.title,
      sub: `${g.skills.length} skills`,
      x: c.x,
      y: c.y,
      r: 19,
      body: g.skills.join(", ") + ".",
      tags: [...g.skills],
      kind: "Skill group",
    });
    g.skills.forEach((s, j) => {
      const a = -Math.PI / 2 + (j / g.skills.length) * Math.PI * 2;
      const R = g.skills.length > 7 ? 165 : 140;
      add({
        id: skillId(s),
        type: "skill",
        title: s,
        sub: g.title,
        x: c.x + Math.cos(a) * R,
        y: c.y + Math.sin(a) * R,
        r: 7,
        body: "",
        parent: c.id,
      });
    });
  });

  add({
    id: "research",
    type: "group",
    col: "#c9a4ff",
    kind: "Research",
    title: "Research",
    sub: `${data.publications.length} papers`,
    x: 620,
    y: -1640,
    r: 19,
    body: "Temporal expression recognition for voice assistants, and LLM-enhanced conversational agents.",
  });
  add({
    id: "oss",
    type: "group",
    col: "#ff7a50",
    kind: "Open source",
    title: "Open source",
    sub: `${data.projects.length} projects`,
    x: 900,
    y: -1740,
    r: 19,
    body: "Repositories on GitHub: agents, knowledge graphs, NLP and language modeling.",
  });

  /* Edges */
  const trunk = ["panacea", "smart", "intern", "fraun", "arch", "deepset", "contact"];
  for (let i = 0; i < trunk.length - 1; i++) link(trunk[i], trunk[i + 1], "t");
  link("bsc", "msc");
  link("bsc", "panacea");
  link("msc", "smart");
  link("msc", "fraun");
  link("fraun", "pate");
  link("fraun", "iwcs");
  link("pate", "iwcs");
  link("arch", "arxiv");
  link("datime", "iwcs");
  link("datime", "fraun");
  HIGHLIGHTS.forEach((_, i) => link("arch", `hl${i}`, "s"));
  link("research", "fraun", "h");
  link("research", "arch", "h");
  link("oss", "arch", "h");
  link("oss", "deepset", "h");
  PAPERS.forEach((p) => link("research", p.id, "s"));
  PROJECTS.forEach((p) => link("oss", p.id, "s"));
  link("atlas", "deepset", "h");
  ["crew", "search", "kg", "tags"].forEach((p) => link(p, "arch", "h"));
  link("gen", "deepset", "h");
  link("gen", "arch", "h");
  link("eng", "arch", "h");
  link("ml", "arch", "h");
  link("ml", "deepset", "h");
  data.skillGroups.forEach((g, i) =>
    g.skills.forEach((s) => link(GROUPS[i].id, skillId(s), "s")),
  );
  Object.entries(PROJECT_SKILLS).forEach(([from, skills]) =>
    skills.forEach((s) => link(from, skillId(s), "k")),
  );

  return {
    nodes,
    edges,
    path: ["deepset", "arch", "fraun", "intern", "smart", "panacea"],
  };
}
