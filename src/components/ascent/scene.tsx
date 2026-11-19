"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

import { initAscent, type AscentState, type Engine } from "./engine";
import { skillId, TYPE_META, type GNode, type Graph } from "./graph";
import "./ascent.css";

export interface Profile {
  name: string;
  role: string;
  place: string;
  avatar: string;
  summary: string;
  social: { name: string; url: string }[];
  emailEnc: string;
}

const INITIAL: AscentState = {
  sel: null,
  pathIdx: -1,
  nextId: null,
  prevId: null,
  explored: 0,
  total: 0,
  intro: false,
  done: false,
};

export function AscentScene({
  graph,
  profile,
}: {
  graph: Graph;
  profile: Profile;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const labRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const engine = useRef<Engine | null>(null);
  const wasDone = useRef<boolean | null>(null);
  const [st, setSt] = useState<AscentState>(INITIAL);
  const [toast, setToast] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyHint, setKeyHint] = useState("⌘K");
  const [expanded, setExpanded] = useState(false);
  const [coachWanted, setCoachWanted] = useState(false);
  const [touch, setTouch] = useState(false);

  const byId = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = cvRef.current;
    const labels = labRef.current;
    const mini = miniRef.current;
    if (!root || !canvas || !labels || !mini) return;
    const eng = initAscent({
      root,
      canvas,
      labels,
      mini,
      graph,
      onState: (s) => {
        if (wasDone.current === null) wasDone.current = s.done;
        else if (s.done && !wasDone.current) {
          wasDone.current = true;
          setToast(true);
        }
        setSt(s);
      },
    });
    engine.current = eng;
    return () => {
      eng.destroy();
      engine.current = null;
    };
  }, [graph]);

  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [st.sel]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setKeyHint("Ctrl K");
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
    let seen = false;
    try {
      seen = localStorage.getItem("touhi.coach.v1") === "1";
    } catch {
      /* ignore */
    }
    if (!seen || location.hash === "#intro") setCoachWanted(true);
  }, []);

  const dismissCoach = useCallback(() => {
    setCoachWanted(false);
    try {
      localStorage.setItem("touhi.coach.v1", "1");
    } catch {
      /* ignore */
    }
  }, []);

  const go = useCallback((id: string) => engine.current?.select(id), []);
  const sel = st.sel ? byId.get(st.sel) : null;
  const next = st.nextId ? byId.get(st.nextId) : null;
  const pathLabel =
    st.pathIdx < 0
      ? st.done
        ? "Tour finished"
        : "Walk through the experience"
      : `${byId.get(graph.path[st.pathIdx])!.sub.split(" · ")[0]} · ${st.pathIdx + 1} of ${graph.path.length}`;

  const showCoach = coachWanted && !st.intro;

  return (
    <div
      ref={rootRef}
      className="asc"
      onPointerDownCapture={(e) => {
        const t = e.target as HTMLElement;
        if (t.classList.contains("asc-canvas")) {
          if (expanded) setExpanded(false);
          if (showCoach) dismissCoach();
        }
      }}
    >
      <canvas ref={cvRef} className="asc-canvas" aria-hidden="true" />
      <div ref={labRef} className="asc-labels" />

      <header className="asc-id">
        <div className="asc-card" data-expanded={expanded ? "true" : "false"}>
          <div
            className="asc-who"
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label="Profile"
            onClick={() => setExpanded((v) => !v)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExpanded((v) => !v)}
          >
            <Image
              className="asc-avatar"
              src={profile.avatar}
              alt={profile.name}
              width={144}
              height={144}
              priority
            />
            <div>
              <h1>{profile.name}</h1>
              <div className="asc-role">{profile.role}</div>
              <div className="asc-place">{profile.place}</div>
            </div>
            <span className="asc-chev" aria-hidden="true">
              {expanded ? "▴" : "▾"}
            </span>
          </div>
          <p>{profile.summary}</p>
          <div className="asc-row">
            <Link className="asc-btn asc-pri" href="/cv">
              Read as CV
            </Link>
            <button className="asc-btn" type="button" onClick={() => engine.current?.select("contact")}>
              Say hello
            </button>
            {profile.social.map((s) => (
              <a key={s.name} className="asc-btn" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ))}
            <button className="asc-btn" type="button" onClick={() => setSearchOpen(true)}>
              Search <kbd className="asc-kbd">{keyHint}</kbd>
            </button>
            <button className="asc-btn" type="button" onClick={() => engine.current?.fit()}>
              Fit all
            </button>
          </div>
        </div>
      </header>

      <canvas ref={miniRef} className="asc-mini" width={264} height={300} aria-hidden="true" />

      {!st.intro && (
        <nav className="asc-path" aria-label="Experience path">
          <button
            className="asc-btn"
            type="button"
            aria-label="Previous role"
            disabled={!st.prevId}
            onClick={() => engine.current?.step(-1)}
          >
            ←
          </button>
          <span>{pathLabel}</span>
          <button
            className="asc-btn asc-pri asc-go"
            type="button"
            disabled={!next}
            onClick={() => {
              if (showCoach) dismissCoach();
              engine.current?.step(1);
            }}
          >
            {next ? (st.pathIdx < 0 ? (st.done ? "Replay tour →" : "Take the tour →") : `Next: ${next.title} →`) : "End"}
          </button>
          <button className="asc-btn asc-dock-extra asc-icon" type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <SearchIcon size={18} aria-hidden="true" />
          </button>
          <Link className="asc-btn asc-dock-extra" href="/cv">
            CV
          </Link>
        </nav>
      )}
      {!st.intro && (
        <button
          className="asc-btn asc-icon asc-help"
          type="button"
          aria-label="How to explore"
          onClick={() => setCoachWanted((v) => !v)}
        >
          ?
        </button>
      )}
      {showCoach && (
        <div className="asc-coach" role="dialog" aria-label="How to explore">
          <b>How to read the map</b>
          <p>
            Time runs up the line, newest role at the top.{" "}
            {touch
              ? "Drag to move, pinch to zoom, tap a point to read more."
              : "Drag to move, scroll to zoom, click a point to read more."}
          </p>
          <div>
            <button
              className="asc-btn asc-pri"
              type="button"
              onClick={() => {
                dismissCoach();
                engine.current?.step(1);
              }}
            >
              Take the tour
            </button>
            <button className="asc-btn" type="button" onClick={dismissCoach}>
              Got it
            </button>
          </div>
        </div>
      )}
      {st.intro && (
        <button className="asc-btn asc-skip" type="button" onClick={() => engine.current?.skipIntro()}>
          Skip intro
        </button>
      )}

      {toast && (
        <div className="asc-toast" role="status">
          <span>End of the tour.</span>
          <button
            type="button"
            onClick={() => {
              setToast(false);
              go("contact");
            }}
          >
            Say hello →
          </button>
        </div>
      )}

      {searchOpen && (
        <Search
          graph={graph}
          onClose={() => setSearchOpen(false)}
          onPick={(id) => {
            setSearchOpen(false);
            engine.current?.select(id);
          }}
        />
      )}

      <aside ref={panelRef} className="asc-panel" aria-live="polite" aria-label="Details">
        {sel && (
          <Panel
            key={sel.id}
            n={sel}
            graph={graph}
            hasSkill={(t) => byId.has(skillId(t))}
            emailEnc={profile.emailEnc}
            onGo={go}
            onClose={() => engine.current?.close()}
          />
        )}
      </aside>

    </div>
  );
}

function Panel({
  n,
  graph,
  hasSkill,
  emailEnc,
  onGo,
  onClose,
}: {
  n: GNode;
  graph: Graph;
  hasSkill: (tag: string) => boolean;
  emailEnc: string;
  onGo: (id: string) => void;
  onClose: () => void;
}) {
  const color = n.col || TYPE_META[n.type].color;
  const children = graph.nodes.filter((m) => m.parent === n.id);
  const isHub = n.type === "group" && children.length > 0;
  const rowHub = isHub && children[0].type !== "skill";
  const highlights = n.hls ? children : [];
  const meta = n.type === "role" && n.tags?.length ? `${n.sub} · ${n.tags.join(" / ")}` : n.sub;
  const usedIn =
    n.type === "skill"
      ? graph.edges
          .filter((e) => e.kind === "k" && e.b === n.id)
          .map((e) => graph.nodes.find((m) => m.id === e.a)!)
      : [];
  const showTech = n.tags && n.tags.length > 0 && (n.type === "project" || n.type === "paper" || n.type === "group");
  const links = n.links ?? [];
  return (
    <div style={{ ["--c" as string]: color }}>
      <button className="asc-x" type="button" aria-label="Close" onClick={onClose}>
        ×
      </button>
      <div className="asc-kind">
        <i />
        {n.kind || TYPE_META[n.type].name}
      </div>
      <h2>{n.title}</h2>
      {meta && <div className="asc-meta">{meta}</div>}
      {n.body && <p className="asc-body">{n.body}</p>}
      {n.text && (
        <p className="asc-body" style={{ marginTop: 8 }}>
          {n.text.join(" · ")}
        </p>
      )}

      {n.id === "contact" && <EmailReveal enc={emailEnc} />}

      {highlights.length > 0 && (
        <>
          <h3>Highlights</h3>
          <ul className="asc-rows">
            {highlights.map((h) => (
              <li key={h.id}>
                <details>
                  <summary>{h.title}</summary>
                  <p>{h.body}</p>
                </details>
              </li>
            ))}
          </ul>
        </>
      )}

      {rowHub && (
        <>
          <h3>{n.id === "oss" ? "Projects" : "Papers"}</h3>
          <ul className="asc-rows">
            {children.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => onGo(c.id)}>
                  {c.short || c.title}
                  <small>{c.sub}</small>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {isHub && !rowHub && (
        <>
          <h3>Skills</h3>
          <div className="asc-chips">
            {children.map((c) => (
              <button key={c.id} type="button" className="asc-chip" onClick={() => onGo(c.id)}>
                {c.title}
              </button>
            ))}
          </div>
        </>
      )}

      {showTech && !isHub && (
        <>
          <h3>{n.type === "project" ? "Built with" : "Topics"}</h3>
          <div className="asc-chips">
            {n.tags!.map((t) =>
              hasSkill(t) ? (
                <button key={t} type="button" className="asc-chip" title={`Show everything that uses ${t}`} onClick={() => onGo(skillId(t))}>
                  {t}
                </button>
              ) : (
                <span key={t} className="asc-chip">
                  {t}
                </span>
              ),
            )}
          </div>
        </>
      )}

      {usedIn.length > 0 && (
        <>
          <h3>{`Used in ${usedIn.length} ${usedIn.length === 1 ? "place" : "places"}`}</h3>
          <ul className="asc-rows">
            {usedIn.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => onGo(m.id)}>
                  {m.short || m.title}
                  <small>{m.sub}</small>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {links.length > 0 && (
        <p style={{ margin: 0 }}>
          {links.map(([label, href], i) => (
            <a
              key={href}
              className={i === 0 ? "asc-link" : "asc-link alt"}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {links.length === 1 && label.toLowerCase() === "github" ? "Open on GitHub ↗" : `${label} ↗`}
            </a>
          ))}
        </p>
      )}
    </div>
  );
}

function score(n: GNode, q: string): number {
  const t = n.title.toLowerCase();
  const sh = (n.short ?? "").toLowerCase();
  if (t === q || sh === q) return 100;
  if (t.startsWith(q) || sh.startsWith(q)) return 80;
  if (t.includes(q) || sh.includes(q)) return 60;
  if ((n.tags ?? []).some((x) => x.toLowerCase().includes(q))) return 45;
  if (n.sub.toLowerCase().includes(q)) return 35;
  if (n.body.toLowerCase().includes(q)) return 20;
  return 0;
}

function Search({
  graph,
  onClose,
  onPick,
}: {
  graph: Graph;
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      return graph.nodes.filter((n) => ["deepset", "arch", "research", "oss", "gen", "contact"].includes(n.id));
    }
    return graph.nodes
      .map((n) => ({ n, s: score(n, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.n);
  }, [q, graph]);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => setIdx(0), [q]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && items[idx]) {
      e.preventDefault();
      onPick(items[idx].id);
    }
  };

  return (
    <div className="asc-search" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="asc-search-box" role="dialog" aria-label="Search">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search roles, projects, papers, skills…"
          aria-label="Search"
          aria-controls="asc-results"
          autoComplete="off"
        />
        <ul id="asc-results" role="listbox">
          {items.length === 0 && <li className="asc-empty">Nothing matches “{q}”.</li>}
          {items.map((n, i) => (
            <li key={n.id} role="option" aria-selected={i === idx}>
              <button
                type="button"
                className={i === idx ? "on" : ""}
                style={{ ["--c" as string]: n.col || TYPE_META[n.type].color }}
                onMouseEnter={() => setIdx(i)}
                onClick={() => onPick(n.id)}
              >
                <i />
                <span>
                  {n.short || n.title}
                  <small>{n.kind || TYPE_META[n.type].name}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="asc-search-hint">↑↓ to move · Enter to open · Esc to close</div>
      </div>
    </div>
  );
}

/** The address is kept out of the page source and decoded only after a click. */
function EmailReveal({ enc }: { enc: string }) {
  const [address, setAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the address is selectable text */
    }
  };
  if (!address) {
    return (
      <p style={{ margin: 0 }}>
        <button type="button" className="asc-link" onClick={() => setAddress(atob(enc))}>
          Show email
        </button>
      </p>
    );
  }
  return (
    <>
      <p className="asc-body" style={{ marginTop: 14, userSelect: "all" }}>
        {address}
      </p>
      <p style={{ margin: 0 }}>
        <a className="asc-link" style={{ marginTop: 8 }} href={`mailto:${address}`}>
          Write an email
        </a>
        <button type="button" className="asc-link alt" style={{ marginTop: 8 }} onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </p>
    </>
  );
}
