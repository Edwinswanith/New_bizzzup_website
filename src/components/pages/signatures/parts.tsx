import s from "./Signature.module.css";
import { d } from "./util";

/* Small drawing vocabulary shared by the signatures. Each piece takes its arrival time `at` (seconds). */

/** Stage label: "01 · …" over a column. */
export const L = ({ x, y = 12, t, at, hot, size }: { x: number; y?: number; t: string; at: number; hot?: boolean; size?: number }) => (
  <text x={x} y={y} className={`${hot ? s.s : ""} ${s.fade}`} style={{ ...d(at), ...(size ? { fontSize: `${size}px` } : {}) }}>{t}</text>
);

/** A labelled box. `on` draws it in signal; `dash` marks a human gate; `solid` fills it ink. */
export const Chip = ({ x, y, w, h = 24, t, at, on, dash, solid, center, size }: {
  x: number; y: number; w: number; h?: number; t: string; at: number; on?: boolean; dash?: boolean; solid?: boolean; center?: boolean; size?: number;
}) => (
  <g className={s.rise} style={d(at)}>
    <rect x={x} y={y} width={w} height={h} rx="2" className={solid ? s.solid : dash ? `${s.box} ${s.dashEdge}` : on ? s.boxOn : s.box} />
    <text x={center ? x + w / 2 : x + 9} y={y + h / 2 + 4} textAnchor={center ? "middle" : "start"} className={solid ? s.inv : s.t}
      style={size ? { fontSize: `${size}px` } : undefined}>{t}</text>
  </g>
);

/** A connecting wire, drawn in. */
export const W = ({ p, at, ink }: { p: string; at: number; ink?: boolean }) => (
  <path d={p} pathLength={1} className={`${ink ? s.wireInk : s.wire} ${s.draw}`} style={d(at)} />
);

/** A junction dot. */
export const Dot = ({ x, y, at, r = 4, fill }: { x: number; y: number; at: number; r?: number; fill?: boolean }) => (
  <circle cx={x} cy={y} r={r} className={`${fill ? s.hot : s.dot} ${s.pop}`} style={d(at)} />
);

/** A bar (rect) that grows from its left edge or its base. */
export const Bar = ({ x, y, w, h, at, hot, up, mute }: { x: number; y: number; w: number; h: number; at: number; hot?: boolean; up?: boolean; mute?: boolean }) => (
  <rect x={x} y={y} width={w} height={h} rx="1.5" className={`${hot ? s.hot : mute ? s.mute : s.solid} ${up ? s.grow : s.growX}`} style={d(at)} />
);

/** Lines of text-like bars inside a card. */
export const Lines = ({ x, y, ws, at, gap = 9, h = 4, hot }: { x: number; y: number; ws: number[]; at: number; gap?: number; h?: number; hot?: number }) => (
  <>{ws.map((w, i) => <Bar key={i} x={x} y={y + i * gap} w={w} h={h} at={at + i * 0.05} hot={hot === i} mute={hot !== i} />)}</>
);

/** A card outline. */
export const Card = ({ x, y, w, h, at, on, dash }: { x: number; y: number; w: number; h: number; at: number; on?: boolean; dash?: boolean }) => (
  <rect x={x} y={y} width={w} height={h} rx="3" className={`${dash ? `${s.box} ${s.dashEdge}` : on ? s.boxOn : s.box} ${s.fade}`} style={d(at)} />
);

/** The SVG frame every signature uses. */
export const Frame = ({ narrow, label, children }: { narrow?: boolean; label: string; children: React.ReactNode }) => (
  <svg viewBox={narrow ? "0 0 360 104" : "0 0 1200 150"} preserveAspectRatio="xMinYMid meet" role="img" aria-label={label}>
    {children}
  </svg>
);
