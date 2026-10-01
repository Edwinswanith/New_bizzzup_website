import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = "Tech Cogniverse - AI systems and product engineering for UK teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#e6e9ea",
          color: "#16191d",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(22,25,29,0.12) 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 84,
            width: 724,
            height: 3,
            background: "#f2461e",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 724,
            top: 84,
            width: 84,
            height: 84,
            borderTop: "3px solid #f2461e",
            borderRight: "3px solid #f2461e",
            borderTopRightRadius: 84,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 805,
            top: 165,
            width: 184,
            height: 3,
            background: "#f2461e",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 986,
            top: 165,
            width: 86,
            height: 344,
            borderTop: "3px solid #f2461e",
            borderRight: "3px solid #f2461e",
            borderBottom: "3px solid #f2461e",
            borderTopRightRadius: 44,
            borderBottomRightRadius: 44,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 1070,
            top: 506,
            width: 130,
            height: 3,
            background: "#f2461e",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 770,
            top: 133,
            width: 22,
            height: 22,
            borderRadius: 99,
            background: "#f2461e",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 108,
            top: 188,
            display: "flex",
            alignItems: "center",
            gap: 48,
          }}
        >
          <svg width="138" height="138" viewBox="0 0 32 32">
            <path
              d="M14.41 11.55A6.2 6.2 0 1 0 9.8 21.9H30"
              fill="none"
              stroke="#f2461e"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 82, lineHeight: 0.9, fontWeight: 800, letterSpacing: "-3px" }}>
              Tech
            </div>
            <div style={{ fontSize: 82, lineHeight: 0.9, fontWeight: 800, letterSpacing: "-3px" }}>
              Cogniverse
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 110,
            top: 382,
            width: 760,
            fontSize: 48,
            lineHeight: 1.13,
            letterSpacing: "-1px",
          }}
        >
          AI systems and product engineering for UK teams
        </div>

        <div
          style={{
            position: "absolute",
            left: 110,
            bottom: 78,
            display: "flex",
            alignItems: "center",
            gap: 26,
            fontSize: 27,
            letterSpacing: "6px",
            color: "#25292e",
            textTransform: "uppercase",
          }}
        >
          <span>Live in 45 days</span>
          <span style={{ color: "#f2461e", letterSpacing: 0 }}>•</span>
          <span>Fixed price</span>
          <span style={{ color: "#f2461e", letterSpacing: 0 }}>•</span>
          <span>Demo every Friday</span>
        </div>

        <div
          style={{
            position: "absolute",
            right: 92,
            bottom: 42,
            fontSize: 14,
            letterSpacing: "3px",
            color: "#65666b",
            textTransform: "uppercase",
          }}
        >
          {SITE.name}
        </div>
      </div>
    ),
    size,
  );
}
