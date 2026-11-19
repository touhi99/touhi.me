import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Touhidul Alam — Senior Solution Engineer at deepset, GenAI & NLP Specialist";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Oxanium:wght@700", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      })
    ).text();
    const match = css.match(
      /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
    );
    if (!match) return null;
    return await (await fetch(match[1])).arrayBuffer();
  } catch {
    return null;
  }
}

function MiniMap() {
  const glow = (cx: number, cy: number, r: number, c: string) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={r * 3} fill={c} opacity={0.1} />
      <circle cx={cx} cy={cy} r={r * 1.8} fill={c} opacity={0.18} />
      <circle cx={cx} cy={cy} r={r} fill="#08080c" stroke={c} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r * 0.34} fill="#fff7e2" />
    </g>
  );
  return (
    <svg width="470" height="570" viewBox="0 0 470 570">
      <g fill="none" strokeLinecap="round">
        <path
          d="M232 540 C 215 470, 250 430, 238 380 C 228 330, 245 300, 236 250 C 228 200, 240 150, 234 70"
          stroke="#34d399"
          strokeWidth={14}
          opacity={0.12}
        />
        <path
          d="M232 540 C 215 470, 250 430, 238 380 C 228 330, 245 300, 236 250 C 228 200, 240 150, 234 70"
          stroke="#34d399"
          strokeWidth={4}
        />
        <path
          d="M238 300 C 330 300, 360 270, 410 250"
          stroke="#c9a4ff"
          strokeWidth={2}
          opacity={0.6}
        />
        <path
          d="M238 300 C 330 330, 360 380, 405 400"
          stroke="#ff7a50"
          strokeWidth={2}
          opacity={0.6}
        />
        <path
          d="M234 150 C 160 150, 120 120, 70 110"
          stroke="#7fd9ff"
          strokeWidth={2}
          opacity={0.6}
        />
        <path
          d="M238 300 C 170 320, 120 360, 70 380"
          stroke="#7fd9ff"
          strokeWidth={2}
          opacity={0.6}
        />
        <path
          d="M232 470 C 160 480, 120 470, 70 470"
          stroke="#97b4ff"
          strokeWidth={2}
          opacity={0.6}
        />
      </g>
      {glow(234, 70, 14, "#ffb3c7")}
      {glow(236, 150, 22, "#34d399")}
      {glow(238, 300, 28, "#34d399")}
      {glow(228, 410, 14, "#34d399")}
      {glow(236, 470, 14, "#34d399")}
      {glow(232, 530, 14, "#34d399")}
      {glow(410, 250, 18, "#c9a4ff")}
      {glow(405, 400, 18, "#ff7a50")}
      {glow(70, 110, 18, "#7fd9ff")}
      {glow(70, 380, 18, "#7fd9ff")}
      {glow(70, 470, 16, "#97b4ff")}
    </svg>
  );
}

export default async function Image() {
  const [fontData, photo] = await Promise.all([
    loadFont(),
    readFile(path.join(process.cwd(), "public", "touhi.jpg")),
  ]);
  const display = fontData ? "Oxanium" : "sans-serif";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#08080c",
        backgroundImage:
          "linear-gradient(135deg, #0a0a10 0%, #101a17 60%, #08080c 100%)",
        color: "#f1e8d4",
        padding: "64px 72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img
            src={`data:image/jpeg;base64,${photo.toString("base64")}`}
            width={116}
            height={116}
            alt=""
            style={{
              borderRadius: 58,
              border: "4px solid #34d399",
              objectFit: "cover",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: display,
                fontSize: 30,
                fontWeight: 700,
                color: "#34d399",
              }}
            >
              touhi.me
            </span>
            <span style={{ fontSize: 24, color: "#a39eb0", marginTop: 4 }}>
              Munich · CET
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: display,
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.02,
            }}
          >
            Touhidul Alam
          </span>
          <span
            style={{
              fontFamily: display,
              marginTop: 18,
              fontSize: 36,
              fontWeight: 700,
              color: "#34d399",
            }}
          >
            Senior Solution Engineer at deepset
          </span>
          <span
            style={{
              marginTop: 22,
              fontSize: 28,
              color: "#b9b4c4",
              lineHeight: 1.4,
              maxWidth: 620,
            }}
          >
            Production-grade Generative AI for the enterprise. Explore the
            career map.
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 470,
        }}
      >
        <MiniMap />
      </div>
    </div>,
    {
      ...size,
      fonts: fontData
        ? [{ name: "Oxanium", data: fontData, weight: 700, style: "normal" }]
        : undefined,
    },
  );
}
