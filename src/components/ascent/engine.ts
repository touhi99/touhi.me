import { TYPE_META, type GEdge, type GNode, type Graph } from "./graph";

export interface AscentState {
  sel: string | null;
  pathIdx: number;
  nextId: string | null;
  prevId: string | null;
  explored: number;
  total: number;
  intro: boolean;
  done: boolean;
}

export interface Engine {
  destroy(): void;
  select(id: string): void;
  close(): void;
  step(dir: number): void;
  fit(): void;
  skipIntro(): void;
}

interface RNode extends GNode {
  c: string;
  v: number;
  f: number;
  rx: number;
  ry: number;
  adj: RNode[];
  label: string;
}
interface REdge {
  a: RNode;
  b: RNode;
  kind: GEdge["kind"];
}
interface View {
  x: number;
  y: number;
  k: number;
}

const STORE_KEY = "touhi.explored.v1";
const Y = (yr: number) => -(yr - 2011) * 150;
const BOUNDS = { x0: -1050, x1: 1250, y0: -2600, y1: 120 };
const TAU = Math.PI * 2;

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function initAscent(o: {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  labels: HTMLElement;
  mini: HTMLCanvasElement;
  graph: Graph;
  onState: (s: AscentState) => void;
}): Engine {
  const { root, canvas: cv, labels: labBox, mini, graph, onState } = o;
  const ctx = cv.getContext("2d")!;
  const mc = mini.getContext("2d")!;
  const cleanups: (() => void)[] = [];
  const listen = <T extends EventTarget>(
    t: T,
    type: string,
    fn: (e: any) => void,
    opts?: AddEventListenerOptions,
  ) => {
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };

  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const monoFamily =
    getComputedStyle(root).getPropertyValue("--asc-mono").trim() ||
    "ui-monospace, monospace";

  const by: Record<string, RNode> = {};
  const nodes: RNode[] = graph.nodes.map((n) => {
    const r: RNode = {
      ...n,
      c: n.col || TYPE_META[n.type].color,
      v: n.parent ? 0 : 1,
      f: 1,
      rx: n.x,
      ry: n.y,
      adj: [],
      label: n.short || n.title,
    };
    by[r.id] = r;
    return r;
  });
  const edges: REdge[] = graph.edges.map((e) => {
    const a = by[e.a];
    const b = by[e.b];
    a.adj.push(b);
    b.adj.push(a);
    return { a, b, kind: e.kind };
  });
  const PATH = graph.path;
  const kids = (n: RNode) => nodes.filter((m) => m.parent === n.id);
  const totalCount = nodes.filter((n) => n.type !== "contact").length;

  let W = 0;
  let H = 0;
  let DPR = 1;
  const cam: View = { x: 0, y: 0, k: 0.5 };
  const tgt: View = { x: 0, y: 0, k: 0.5 };
  const intro = { on: false, t: 0, dur: 2.4 };
  let front = -9999;
  let hover: RNode | null = null;
  let sel: RNode | null = null;
  let open: Record<string, number> = {};
  const visited: Record<string, number> = {};
  let done = false;
  let T = 0;
  let last = performance.now();
  let raf = 0;
  let destroyed = false;
  let activeUntil = 0;
  let lastDraw = 0;
  const poke = (ms = 1500) => {
    activeUntil = Math.max(activeUntil, performance.now() + ms);
  };
  const vel = { x: 0, y: 0 };
  const ptrs = new Map<number, { x: number; y: number }>();
  let drag: { x: number; y: number } | null = null;
  let pinch: { d: number; k: number } | null = null;
  let moved = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    if (Array.isArray(saved))
      saved.forEach((id) => by[id] && (visited[id] = 1));
  } catch {}
  let introSeen = false;
  try {
    introSeen =
      sessionStorage.getItem("touhi.intro") === "1" &&
      location.hash !== "#intro";
  } catch {}
  done = PATH.every((id) => visited[id]);

  const phone = () => W < 700;
  const panelOn = () => root.dataset.panel === "1";

  const stars = Array.from({ length: 140 }, (_, i) => ({
    x: rnd(i) * 2000,
    y: rnd(i + 500) * 1400,
    z: 0.1 + rnd(i + 900) * 0.5,
    r: 0.4 + rnd(i + 30) * 1.2,
    p: rnd(i + 77) * 6,
  }));
  const embers = Array.from({ length: 70 }, (_, i) => ({
    x: rnd(i + 1200),
    y: rnd(i + 1300),
    z: 0.3 + rnd(i + 1400) * 0.7,
    s: 0.01 + rnd(i + 1500) * 0.03,
    r: 0.6 + rnd(i + 1600) * 1.6,
  }));

  const S = (wx: number, wy: number): [number, number] => [
    (wx - cam.x) * cam.k + W / 2,
    (wy - cam.y) * cam.k + H / 2,
  ];
  const toWorld = (sx: number, sy: number, c: View = cam): [number, number] => [
    (sx - W / 2) / c.k + c.x,
    (sy - H / 2) / c.k + c.y,
  ];
  function restView(): View {
    if (phone()) return { x: 60, y: -1700, k: 0.28 };
    const k = Math.max(0.34, Math.min(0.55, W / 2500));
    return { x: 40, y: -2000, k };
  }
  function fitView(): View {
    const k = Math.min(
      W / (BOUNDS.x1 - BOUNDS.x0 + 150),
      H / (BOUNDS.y1 - BOUNDS.y0 + 150),
    );
    return {
      x: (BOUNDS.x0 + BOUNDS.x1) / 2,
      y: (BOUNDS.y0 + BOUNDS.y1) / 2,
      k,
    };
  }
  function panelShift() {
    if (!panelOn()) return { x: 0, y: 0 };
    return phone() ? { x: 0, y: H * 0.2 } : { x: 200, y: 0 };
  }
  function flyTo(x: number, y: number, k?: number) {
    const s = panelShift();
    if (k) tgt.k = k;
    tgt.x = x + s.x / tgt.k;
    tgt.y = y + s.y / tgt.k;
  }
  function zoomAt(sx: number, sy: number, k: number, now?: boolean) {
    k = Math.max(0.16, Math.min(2.4, k));
    const w = toWorld(sx, sy, tgt);
    tgt.k = k;
    tgt.x = w[0] - (sx - W / 2) / k;
    tgt.y = w[1] - (sy - H / 2) / k;
    if (now) Object.assign(cam, tgt);
  }
  function frameSet(list: RNode[]): View {
    let x0 = 1e9;
    let x1 = -1e9;
    let y0 = 1e9;
    let y1 = -1e9;
    list.forEach((m) => {
      x0 = Math.min(x0, m.x);
      x1 = Math.max(x1, m.x);
      y0 = Math.min(y0, m.y);
      y1 = Math.max(y1, m.y);
    });
    const aw = phone() ? W : W - 420;
    const ah = phone() ? H * 0.45 : H;
    let k = Math.max(
      phone() ? 0.17 : 0.3,
      Math.min(0.85, Math.min(aw / (x1 - x0 + 360), ah / (y1 - y0 + 360))),
    );
    if (phone()) k = Math.min(k, 0.45);
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, k };
  }

  const lit = (n: RNode) =>
    intro.on ? Math.max(0, Math.min(1, (n.y - front) / 160)) : 1;
  const ZOOM_REVEAL: Record<string, number> = {
    skill: 1.15,
    project: 0.95,
    paper: 0.9,
    hl: 0.95,
  };
  function wantVis(n: RNode) {
    if (!n.parent) return true;
    if (open[n.parent]) return true;
    if (sel && (sel === n || sel.adj.includes(n))) return true;
    const z = ZOOM_REVEAL[n.type];
    return z ? cam.k >= z : false;
  }
  function updVis(dt: number) {
    for (const n of nodes) {
      const tv = wantVis(n) ? 1 : 0;
      n.v += (tv - n.v) * Math.min(1, dt * 7);
      if (Math.abs(tv - n.v) < 0.003) n.v = tv;
      const ft = sel ? (n === sel || sel.adj.includes(n) ? 1 : 0.16) : 1;
      n.f += (ft - n.f) * Math.min(1, dt * 8);
      const h = n.parent ? by[n.parent] : null;
      if (h) {
        const e = n.v * n.v * (3 - 2 * n.v);
        n.rx = h.x + (n.x - h.x) * e;
        n.ry = h.y + (n.y - h.y) * e;
      } else {
        n.rx = n.x;
        n.ry = n.y;
      }
    }
  }
  const nextWaypoint = () =>
    PATH.map((id) => by[id]).find((n) => !visited[n.id]) || null;

  function emit() {
    poke();
    const i = sel ? PATH.indexOf(sel.id) : -1;
    const nx =
      i < 0 ? nextWaypoint() || by[PATH[0]] : by[PATH[i + 1]] || by.contact;
    const explored = Object.keys(visited).filter(
      (id) => by[id] && by[id].type !== "contact",
    ).length;
    onState({
      sel: sel ? sel.id : null,
      pathIdx: i,
      nextId: nx ? nx.id : null,
      prevId: i > 0 ? PATH[i - 1] : null,
      explored,
      total: totalCount,
      intro: intro.on,
      done,
    });
  }
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(Object.keys(visited)));
    } catch {}
  }

  const sprites: Record<string, HTMLCanvasElement> = {};
  function glow(color: string) {
    let c = sprites[color];
    if (!c) {
      c = document.createElement("canvas");
      c.width = c.height = 96;
      const g = c.getContext("2d")!;
      const gr = g.createRadialGradient(48, 48, 0, 48, 48, 48);
      gr.addColorStop(0, rgba(color, 1));
      gr.addColorStop(1, rgba(color, 0));
      g.fillStyle = gr;
      g.fillRect(0, 0, 96, 96);
      sprites[color] = c;
    }
    return c;
  }
  function poly(x: number, y: number, r: number, n: number, rot: number) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * TAU;
      if (i) ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      else ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
  }
  function bez(a: RNode, b: RNode): number[] {
    const A = S(a.rx, a.ry);
    const B = S(b.rx, b.ry);
    const dx = Math.abs(B[0] - A[0]);
    const dy = Math.abs(B[1] - A[1]);
    if (dx > dy) {
      const mx = (A[0] + B[0]) / 2;
      return [A[0], A[1], mx, A[1], mx, B[1], B[0], B[1]];
    }
    const m = (A[1] + B[1]) / 2;
    return [A[0], A[1], A[0], m, B[0], m, B[0], B[1]];
  }
  function bpt(p: number[], t: number): [number, number] {
    const u = 1 - t;
    return [
      u * u * u * p[0] +
        3 * u * u * t * p[2] +
        3 * u * t * t * p[4] +
        t * t * t * p[6],
      u * u * u * p[1] +
        3 * u * u * t * p[3] +
        3 * u * t * t * p[5] +
        t * t * t * p[7],
    ];
  }
  const isActive = (n: RNode) => n === hover || n === sel;

  function draw(dt: number) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const x =
        ((((s.x - cam.x * cam.k * s.z * 0.4) % 2000) + 2000) % 2000) *
        (W / 1400);
      const y =
        ((((s.y - cam.y * cam.k * s.z * 0.4) % 1400) + 1400) % 1400) *
        (H / 900);
      if (x > W || y > H) continue;
      ctx.fillStyle = `rgba(241,232,212,${(0.18 + 0.22 * Math.sin(T * 0.8 + s.p)) * s.z * 1.6})`;
      ctx.fillRect(x, y, s.r, s.r);
    }
    const a0 = S(-96, Y(2011));
    const a1 = S(-96, Y(2027));
    ctx.strokeStyle = "rgba(241,232,212,.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a0[0], a0[1]);
    ctx.lineTo(a1[0], a1[1]);
    ctx.stroke();
    if (cam.k > 0.2) {
      ctx.font = `500 ${Math.max(9, Math.min(12, 11 * cam.k * 1.6))}px ${monoFamily}`;
      ctx.fillStyle = "rgba(241,232,212,.3)";
      ctx.textAlign = "right";
      for (let yr = 2011; yr <= 2026; yr++) {
        const p = S(-104, Y(yr));
        ctx.fillText(String(yr), p[0], p[1] + 4);
        ctx.fillRect(p[0] + 4, p[1], 8 * cam.k + 4, 1);
      }
    }
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (const n of nodes) {
      if (n.a == null || n.b == null) continue;
      const L = lit(n) * n.f;
      if (L <= 0) continue;
      const x = n.type === "role" ? -62 : n.x;
      const p = S(x, Y(n.a));
      const q = S(x, Y(n.b));
      ctx.strokeStyle = rgba(n.c, (isActive(n) ? 0.55 : 0.22) * L);
      ctx.lineWidth = Math.max(3, 7 * cam.k);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(q[0], q[1]);
      ctx.stroke();
    }
    for (const e of edges) {
      const L = Math.min(lit(e.a) * e.a.v, lit(e.b) * e.b.v);
      if (L <= 0.01) continue;
      const hot =
        isActive(e.a) ||
        isActive(e.b) ||
        (!!sel && e.kind !== "t" && (e.a === sel || e.b === sel));
      const base =
        e.kind === "t"
          ? 0.5
          : e.kind === "s"
            ? 0.32
            : e.kind === "k"
              ? 0
              : e.kind === "h"
                ? 0.13
                : 0.2;
      const fd = hot ? 1 : Math.min(e.a.f, e.b.f);
      const al = (hot ? 0.95 : base * fd) * L;
      if (al < 0.01) continue;
      const p = bez(e.a, e.b);
      const col = e.kind === "t" ? "#34d399" : hot ? "#f1e8d4" : "#c9c2d6";
      ctx.strokeStyle = rgba(col, al * 0.35);
      ctx.lineWidth =
        (e.kind === "t" ? 9 : hot ? 6 : 3) * Math.min(1, cam.k + 0.3);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.bezierCurveTo(p[2], p[3], p[4], p[5], p[6], p[7]);
      ctx.stroke();
      ctx.strokeStyle = rgba(col, al);
      ctx.lineWidth = e.kind === "t" ? 2.2 : hot ? 1.8 : 1;
      ctx.stroke();
      if ((hot || e.kind === "t") && !RM && L > 0.9) {
        const k =
          (T * (hot ? 0.5 : 0.18) + ((((e.a.x + e.b.y) % 7) + 7) % 7) * 0.13) %
          1;
        const pt = bpt(p, k);
        ctx.fillStyle = rgba(hot ? "#ffffff" : "#34d399", hot ? 0.95 : 0.7);
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], hot ? 2.6 : 2, 0, TAU);
        ctx.fill();
      }
    }
    const wp = nextWaypoint();
    const order = nodes.slice().sort((a, b) => a.r - b.r);
    for (const n of order) {
      const L = lit(n) * n.v * n.f;
      if (L <= 0.01) continue;
      const p = S(n.rx, n.ry);
      const r = Math.max(3.5, n.r * cam.k) * (0.5 + 0.5 * n.v);
      const h = isActive(n);
      const v = visited[n.id];
      const pulse = RM ? 0 : Math.sin(T * 1.6 + n.x * 0.01) * 0.5 + 0.5;
      if (p[0] < -80 || p[0] > W + 80 || p[1] < -80 || p[1] > H + 80) continue;
      const gr = r * (h ? 4.8 : 3.4);
      ctx.globalAlpha = (h ? 0.7 : v ? 0.5 : 0.34) * L;
      ctx.drawImage(glow(n.c), p[0] - gr, p[1] - gr, gr * 2, gr * 2);
      ctx.globalAlpha = 1;
      const sides =
        n.type === "edu"
          ? 6
          : n.type === "project"
            ? 4
            : n.type === "paper"
              ? 3
              : n.type === "group"
                ? 8
                : n.type === "contact"
                  ? 5
                  : 0;
      ctx.strokeStyle = rgba(n.c, L);
      ctx.lineWidth = h ? 2.4 : 1.6;
      if (sides) {
        poly(
          p[0],
          p[1],
          r,
          sides,
          n.type === "project" ? Math.PI / 4 : -Math.PI / 2,
        );
      } else {
        ctx.beginPath();
        ctx.arc(p[0], p[1], r, 0, TAU);
      }
      ctx.fillStyle = rgba(n.c, 0.16 * L);
      ctx.fill();
      ctx.stroke();
      if (n.type === "role" || n.type === "group") {
        ctx.strokeStyle = rgba(n.c, 0.35 * L);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p[0], p[1], r * (1.35 + pulse * 0.12), 0, TAU);
        ctx.stroke();
      }
      ctx.fillStyle = rgba(
        "#fff7e2",
        (0.55 + (v ? 0.35 : 0) + (h ? 0.1 : 0)) * L,
      );
      ctx.beginPath();
      ctx.arc(p[0], p[1], Math.max(1.6, r * 0.34), 0, TAU);
      ctx.fill();
      if (n === sel) {
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -T * 14;
        ctx.strokeStyle = rgba("#ffffff", 0.9);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(p[0], p[1], r * 1.9 + 4, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      const ring =
        (n === wp || (done && n.id === "contact" && n !== sel)) &&
        !intro.on &&
        n !== sel;
      if (ring) {
        const ph = RM ? 0.5 : (T * 0.9) % 1;
        ctx.strokeStyle = `rgba(255,247,226,${0.85 * (1 - ph)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p[0], p[1], r * (1.5 + ph * 1.6) + 3, 0, TAU);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    if (!RM) {
      for (const m of embers) {
        m.y -= m.s * dt;
        if (m.y < -0.02) m.y = 1.02;
        const ex = (((m.x * W - cam.x * cam.k * m.z * 0.6) % W) + W) % W;
        ctx.fillStyle = `rgba(52,211,153,${0.12 + 0.25 * m.z})`;
        ctx.beginPath();
        ctx.arc(ex, m.y * H, m.r * m.z, 0, TAU);
        ctx.fill();
      }
    }
  }

  const labs: Record<string, HTMLButtonElement> = {};
  const subs: Record<string, HTMLElement | null> = {};
  for (const n of nodes) {
    const b = document.createElement("button");
    b.className = "asc-lab" + (n.type === "skill" ? " sk" : "");
    b.type = "button";
    b.style.setProperty("--c", n.c);
    b.setAttribute("aria-label", n.title + (n.sub ? ", " + n.sub : ""));
    const t = document.createElement("span");
    t.textContent = n.label;
    b.appendChild(t);
    if (n.sub && n.type !== "skill") {
      const s = document.createElement("small");
      s.textContent = n.sub;
      b.appendChild(s);
      subs[n.id] = s;
    }
    listen(b, "focus", () => {
      flyTo(n.x, n.y, Math.max(tgt.k, 0.55));
      hover = n;
    });
    listen(b, "blur", () => {
      if (hover === n) hover = null;
    });
    listen(b, "keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        select(n.id);
      }
    });
    labBox.appendChild(b);
    labs[n.id] = b;
  }
  const REGIONS: [string, number, number][] = [
    ["Experience", 90, -560],
    ["Education", -380, -720],
    ["Skills", -760, -1230],
  ];
  const regEls = REGIONS.map((r) => {
    const d = document.createElement("div");
    d.className = "asc-reg";
    d.textContent = r[0];
    d.setAttribute("aria-hidden", "true");
    labBox.appendChild(d);
    return d;
  });
  const minK = (n: RNode) =>
    n.type === "skill"
      ? 0.5
      : n.type === "hl"
        ? 0.35
        : n.type === "project"
          ? 0.35
          : n.type === "paper"
            ? 0.3
            : 0.2;
  const weight = (n: RNode) =>
    (isActive(n) ? 100 : 0) +
    (n.type === "role" ||
    n.type === "edu" ||
    n.type === "group" ||
    n.type === "contact"
      ? 10
      : n.type === "paper" || n.type === "project"
        ? 6
        : n.type === "hl"
          ? 4
          : 1) +
    n.r / 100;

  const cache: Record<string, { o: string; t: string; s: string; h: boolean }> =
    {};
  const regCache = REGIONS.map(() => ({ fs: 0, o: "", t: "" }));
  function updLabels() {
    type Cand = { n: RNode; p: [number, number]; r: number; show: boolean };
    const cands: Cand[] = [];
    for (const n of nodes) {
      const p = S(n.rx, n.ry);
      const r = Math.max(3.5, n.r * cam.k);
      const L = lit(n) * n.v;
      const related = !!sel && sel.type === "skill" && sel.adj.includes(n);
      const on =
        L > 0.7 &&
        (cam.k >= minK(n) || related) &&
        p[0] > -120 &&
        p[0] < W + 120 &&
        p[1] > -60 &&
        p[1] < H + 60;
      cands.push({ n, p, r, show: on || (isActive(n) && L > 0.5) });
    }
    const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const ok = new Set<string>();
    cands
      .filter((c) => c.show)
      .sort((a, b) => weight(b.n) - weight(a.n))
      .forEach((c) => {
        const big =
          c.n.type === "role" ||
          c.n.type === "edu" ||
          c.n.type === "group" ||
          c.n.type === "contact";
        const subOn = isActive(c.n) || (big && cam.k > 0.45) || cam.k > 0.9;
        const fs = c.n.type === "skill" ? 11 : 13;
        const w = Math.min(190, c.n.label.length * fs * 0.62) + 8;
        const lines = Math.max(
          1,
          Math.ceil((c.n.label.length * fs * 0.62) / 190),
        );
        const h =
          lines * (fs + 3) +
          (subOn && c.n.sub && c.n.type !== "skill" ? 15 : 0);
        const x0 = c.p[0] - w / 2;
        const y0 = c.p[1] + c.r * 1.5 + 7;
        const box = { x0, y0, x1: x0 + w, y1: y0 + h };
        const clash = placed.some(
          (q) =>
            box.x0 < q.x1 && box.x1 > q.x0 && box.y0 < q.y1 && box.y1 > q.y0,
        );
        const blocked =
          phone() &&
          (box.x0 < 4 || box.x1 > W - 4 || box.y0 < 70 || box.y1 > H - 92);
        if ((!clash && !blocked) || isActive(c.n)) {
          placed.push(box);
          ok.add(c.n.id);
        }
      });
    for (const c of cands) {
      const b = labs[c.n.id];
      const n = c.n;
      const L = lit(n) * n.v;
      const shown = ok.has(n.id);
      const c0 =
        cache[n.id] || (cache[n.id] = { o: "", t: "", s: "", h: false });
      const op = shown
        ? (Math.min(1, n.f * 1.2) * Math.min(1, L * 1.3)).toFixed(2)
        : "0";
      if (op !== c0.o) {
        b.style.opacity = op;
        const vis = op !== "0";
        b.tabIndex = vis ? 0 : -1;
        b.setAttribute("aria-hidden", vis ? "false" : "true");
        c0.o = op;
      }
      const hot = isActive(n);
      if (hot !== c0.h) {
        b.classList.toggle("hot", hot);
        c0.h = hot;
      }
      const big =
        n.type === "role" ||
        n.type === "edu" ||
        n.type === "group" ||
        n.type === "contact";
      const sm = subs[n.id];
      const sd = hot || (big && cam.k > 0.45) || cam.k > 0.9 ? "block" : "none";
      if (sm && sd !== c0.s) {
        sm.style.display = sd;
        c0.s = sd;
      }
      if (op !== "0") {
        const tr = `translate(${c.p[0].toFixed(1)}px,${(c.p[1] + c.r * 1.5 + 7).toFixed(1)}px)`;
        if (tr !== c0.t) {
          b.style.transform = tr;
          c0.t = tr;
        }
      }
    }
    REGIONS.forEach((r, i) => {
      const p = S(r[1], r[2]);
      const d = regEls[i];
      const rc = regCache[i];
      const tr = `translate(${p[0].toFixed(0)}px,${p[1].toFixed(0)}px) translate(-50%,-50%)`;
      if (tr !== rc.t) {
        d.style.transform = tr;
        rc.t = tr;
      }
      const fs = Math.round(Math.max(14, Math.min(46, 64 * cam.k)));
      if (fs !== rc.fs) {
        d.style.fontSize = `${fs}px`;
        rc.fs = fs;
      }
      const op = intro.on || phone() ? "0" : cam.k > 0.9 ? "0.25" : "1";
      if (op !== rc.o) {
        d.style.opacity = op;
        rc.o = op;
      }
    });
  }

  let miniMap = { ox: 0, oy: 0, s: 1 };
  function drawMini() {
    const w = mini.width;
    const h = mini.height;
    const s = Math.min(
      w / (BOUNDS.x1 - BOUNDS.x0),
      h / (BOUNDS.y1 - BOUNDS.y0),
    );
    const ox = (w - s * (BOUNDS.x1 - BOUNDS.x0)) / 2;
    const oy = (h - s * (BOUNDS.y1 - BOUNDS.y0)) / 2;
    miniMap = { ox, oy, s };
    mc.clearRect(0, 0, w, h);
    const P = (x: number, y: number) => [
      ox + (x - BOUNDS.x0) * s,
      oy + (y - BOUNDS.y0) * s,
    ];
    mc.strokeStyle = "rgba(241,232,212,.18)";
    mc.lineWidth = 1;
    for (const e of edges) {
      if (e.a.parent || e.b.parent) continue;
      const a = P(e.a.x, e.a.y);
      const b = P(e.b.x, e.b.y);
      mc.beginPath();
      mc.moveTo(a[0], a[1]);
      mc.lineTo(b[0], b[1]);
      mc.stroke();
    }
    for (const n of nodes) {
      if (n.parent || lit(n) <= 0) continue;
      const p = P(n.x, n.y);
      mc.fillStyle = n.c;
      mc.beginPath();
      mc.arc(p[0], p[1], n.r > 14 ? 5 : 3.5, 0, TAU);
      mc.fill();
    }
    const a = toWorld(0, 0);
    const b = toWorld(W, H);
    const pa = P(a[0], a[1]);
    const pb = P(b[0], b[1]);
    mc.strokeStyle = "#34d399";
    mc.lineWidth = 2;
    mc.strokeRect(pa[0], pa[1], pb[0] - pa[0], pb[1] - pa[1]);
  }

  function select(id: string) {
    const n = by[id];
    if (!n) return;
    if (intro.on) endIntro(true);
    sel = n;
    visited[n.id] = 1;
    persist();
    const kk = kids(n);
    open = {};
    if (kk.length) open[n.id] = 1;
    else if (n.parent) open[n.parent] = 1;
    root.dataset.panel = "1";
    if (kk.length) {
      const f = frameSet([n, ...kk]);
      flyTo(f.x, f.y, f.k);
    } else if (n.type === "skill") {
      const used = n.adj.filter((m) => m.type !== "group");
      if (used.length) {
        const f = frameSet([n, ...used]);
        flyTo(f.x, f.y, f.k);
      } else flyTo(n.x, n.y, Math.max(tgt.k, phone() ? 0.5 : 0.7));
    } else {
      const pr = n.parent ? by[n.parent] : null;
      if (pr) {
        const f = frameSet([n, ...kids(pr)]);
        flyTo(f.x, f.y, f.k);
      } else {
        flyTo(n.x, n.y, Math.max(tgt.k, phone() ? 0.5 : 0.7));
      }
    }
    const wasDone = done;
    done = PATH.every((p) => visited[p]);
    if (done && !wasDone) root.dataset.done = "1";
    try {
      history.replaceState(null, "", `#node=${encodeURIComponent(id)}`);
    } catch {}
    emit();
  }
  function close() {
    delete root.dataset.panel;
    sel = null;
    open = {};
    const r = restView();
    Object.assign(tgt, r);
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch {}
    emit();
  }
  function step(dir: number) {
    const i = sel ? PATH.indexOf(sel.id) : -1;
    let t: RNode | undefined;
    if (i < 0)
      t = dir > 0 ? nextWaypoint() || by[PATH[0]] : by[PATH[PATH.length - 1]];
    else t = by[PATH[i + dir]] || (dir > 0 ? by.contact : undefined);
    if (t) select(t.id);
  }
  function fit() {
    endIntro(true);
    delete root.dataset.panel;
    sel = null;
    open = {};
    Object.assign(tgt, fitView());
    emit();
  }
  function endIntro(keepTarget = false) {
    if (!intro.on) return;
    intro.on = false;
    try {
      sessionStorage.setItem("touhi.intro", "1");
    } catch {}
    if (!keepTarget) Object.assign(tgt, restView());
    emit();
  }

  function hit(sx: number, sy: number) {
    let best: RNode | null = null;
    let bd = 1e9;
    for (const n of nodes) {
      if (lit(n) < 0.8 || n.v < 0.7) continue;
      const p = S(n.rx, n.ry);
      const d = Math.hypot(p[0] - sx, p[1] - sy);
      const rr = Math.max(n.r * cam.k * 1.25 + 6, phone() ? 22 : 15);
      if (d < rr && d < bd) {
        bd = d;
        best = n;
      }
    }
    return best;
  }
  listen(cv, "pointerdown", (e: PointerEvent) => {
    poke();
    cv.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0;
    endIntro();
    if (ptrs.size === 1) {
      drag = { x: e.clientX, y: e.clientY };
      vel.x = vel.y = 0;
    } else {
      const ps = Array.from(ptrs.values());
      pinch = { d: Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y), k: tgt.k };
      drag = null;
    }
  });
  listen(cv, "pointermove", (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    const sx = e.clientX - r.left;
    const sy = e.clientY - r.top;
    if (ptrs.has(e.pointerId)) {
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && ptrs.size > 1) {
        const ps = Array.from(ptrs.values());
        const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
        zoomAt(
          (ps[0].x + ps[1].x) / 2 - r.left,
          (ps[0].y + ps[1].y) / 2 - r.top,
          (pinch.k * d) / pinch.d,
          true,
        );
      } else if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        moved += Math.abs(dx) + Math.abs(dy);
        if (moved > 4) cv.classList.add("drag");
        cam.x -= dx / cam.k;
        cam.y -= dy / cam.k;
        tgt.x = cam.x;
        tgt.y = cam.y;
        tgt.k = cam.k;
        vel.x = -dx / cam.k;
        vel.y = -dy / cam.k;
        drag = { x: e.clientX, y: e.clientY };
      }
    } else {
      const h = hit(sx, sy);
      if (h !== hover) {
        poke(600);
        hover = h;
        cv.classList.toggle("hov", !!h);
      }
    }
  });
  const up = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    if (ptrs.has(e.pointerId) && moved < 6 && ptrs.size === 1) {
      const h = hit(e.clientX - r.left, e.clientY - r.top);
      if (h) select(h.id);
      else if (sel) close();
    }
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (!ptrs.size) {
      drag = null;
      cv.classList.remove("drag");
      tgt.x = cam.x + vel.x * 8;
      tgt.y = cam.y + vel.y * 8;
    }
  };
  listen(cv, "pointerup", up);
  listen(cv, "pointercancel", up);
  listen(cv, "pointerleave", () => {
    if (!ptrs.size) hover = null;
  });
  listen(
    cv,
    "wheel",
    (e: WheelEvent) => {
      e.preventDefault();
      poke();
      endIntro();
      const r = cv.getBoundingClientRect();
      zoomAt(
        e.clientX - r.left,
        e.clientY - r.top,
        tgt.k * Math.exp(-e.deltaY * 0.0016),
      );
    },
    { passive: false },
  );
  listen(document, "keydown", (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    poke();
    const st = 140 / tgt.k;
    const k = e.key.toLowerCase();
    endIntro();
    if (k === "arrowright") {
      e.preventDefault();
      step(1);
    } else if (k === "arrowleft") {
      e.preventDefault();
      step(-1);
    } else if (k === "a") tgt.x -= st;
    else if (k === "d") tgt.x += st;
    else if (k === "w" || k === "arrowup") tgt.y -= st;
    else if (k === "s" || k === "arrowdown") tgt.y += st;
    else if (k === "=" || k === "+") zoomAt(W / 2, H / 2, tgt.k * 1.25);
    else if (k === "-") zoomAt(W / 2, H / 2, tgt.k / 1.25);
    else if (k === "0") fit();
    else if (k === "escape") close();
  });
  listen(mini, "pointerdown", (e: PointerEvent) => {
    poke();
    endIntro();
    const r = mini.getBoundingClientRect();
    const fx = ((e.clientX - r.left) / r.width) * mini.width;
    const fy = ((e.clientY - r.top) / r.height) * mini.height;
    tgt.x = BOUNDS.x0 + (fx - miniMap.ox) / miniMap.s;
    tgt.y = BOUNDS.y0 + (fy - miniMap.oy) / miniMap.s;
  });

  function resize() {
    poke();
    const r = root.getBoundingClientRect();
    W = r.width;
    H = r.height;
    DPR = Math.min(1.5, window.devicePixelRatio || 1);
    cv.width = W * DPR;
    cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function frame(now: number) {
    if (destroyed) return;
    const settled =
      Math.abs(cam.x - tgt.x) * cam.k < 0.3 &&
      Math.abs(cam.y - tgt.y) * cam.k < 0.3 &&
      Math.abs(Math.log(tgt.k / cam.k)) < 0.002;
    const busy =
      intro.on ||
      ptrs.size > 0 ||
      now < activeUntil ||
      !settled ||
      Math.abs(vel.x) > 0.01 ||
      Math.abs(vel.y) > 0.01;
    if (!busy && (RM || now - lastDraw < 80)) {
      raf = requestAnimationFrame(frame);
      return;
    }
    lastDraw = now;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    T += dt;
    if (intro.on) {
      intro.t += dt;
      const p = Math.min(1, intro.t / intro.dur);
      const e = ease(p);
      front = Y(2010.6) - (Y(2010.6) - Y(2027.2)) * e;
      const rv = restView();
      tgt.x = rv.x;
      tgt.y = front + (H * 0.3) / rv.k;
      tgt.k = rv.k;
      cam.x = tgt.x;
      cam.y += (tgt.y - cam.y) * Math.min(1, dt * 6);
      cam.k = rv.k;
      if (p >= 1) endIntro();
    } else {
      const a = 1 - Math.pow(0.0009, dt);
      cam.x += (tgt.x - cam.x) * a;
      cam.y += (tgt.y - cam.y) * a;
      cam.k *= Math.pow(tgt.k / cam.k, a);
      if (!ptrs.size && (Math.abs(vel.x) > 0.01 || Math.abs(vel.y) > 0.01)) {
        vel.x *= 0.92;
        vel.y *= 0.92;
        tgt.x = cam.x + vel.x * 8;
        tgt.y = cam.y + vel.y * 8;
      }
    }
    updVis(dt);
    draw(dt);
    updLabels();
    const showMini = cam.k < restView().k * 0.8 && !intro.on;
    mini.style.opacity = showMini ? "1" : "0";
    mini.style.pointerEvents = showMini ? "auto" : "none";
    if (showMini) drawMini();
    raf = requestAnimationFrame(frame);
  }

  resize();
  listen(window, "resize", () => {
    resize();
    if (!sel && !intro.on) Object.assign(tgt, restView());
  });
  const deep = /#node=([^&]+)/.exec(location.hash);
  const deepId = deep ? decodeURIComponent(deep[1]) : "";
  const r0 = restView();
  if (deepId && by[deepId]) {
    Object.assign(cam, r0);
    Object.assign(tgt, r0);
    select(deepId);
    for (let i = 0; i < 40; i++) updVis(0.05);
    Object.assign(cam, tgt);
  } else if (RM || introSeen) {
    Object.assign(cam, r0);
    Object.assign(tgt, r0);
  } else {
    intro.on = true;
    cam.x = r0.x;
    cam.k = r0.k;
    cam.y = Y(2010.6) + (H * 0.3) / r0.k;
    front = Y(2010.6) + 200;
  }
  emit();
  raf = requestAnimationFrame((t) => {
    last = t;
    raf = requestAnimationFrame(frame);
  });

  return {
    select,
    close,
    step,
    fit,
    skipIntro: () => endIntro(),
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      labBox.replaceChildren();
    },
  };
}
