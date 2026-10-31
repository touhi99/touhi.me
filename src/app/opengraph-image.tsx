import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Touhidul Alam — Senior Solution Engineer, GenAI & NLP Specialist";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0b0c",
          backgroundImage:
            "linear-gradient(135deg, #0b0b0c 0%, #0f1a17 55%, #0b0b0c 100%)",
          color: "#f5f4f1",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: "#10b981",
                color: "#04120c",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: -1,
              }}
            >
              TA
            </div>
            <span style={{ color: "#a1a1aa" }}>touhi.me</span>
          </div>
          <span style={{ color: "#34d399", fontSize: 20 }}>
            GenAI · NLP · RAG
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#34d399",
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Senior Solution Engineer at deepset
          </span>
          <span
            style={{
              marginTop: 20,
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
            }}
          >
            Touhidul Alam
          </span>
          <span
            style={{
              marginTop: 24,
              fontSize: 30,
              color: "#a1a1aa",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            Building production-grade Generative AI applications for the
            enterprise.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272a",
            paddingTop: 28,
            fontSize: 22,
            color: "#a1a1aa",
          }}
        >
          <span>Munich, Germany · CET</span>
          <span>GenAI &amp; NLP Specialist</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
