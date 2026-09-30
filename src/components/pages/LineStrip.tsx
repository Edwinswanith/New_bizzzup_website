import type { RegionId } from "@/content/types";
import {
  tangle, taut, wave, resample, knowledgeAnchors, routeAnchors, framePath, type Geo, type Pt,
} from "@/lib/line/engine";
import styles from "./LineStrip.module.css";

export type StripShape = RegionId | "tangle" | "taut";

type Drawing = { d: string; docs: Pt[]; branches: [Pt, Pt][] };

const r1 = (v: number) => Math.round(v * 10) / 10;

function toD(buf: Float32Array, n: number) {
  let d = `M${r1(buf[0])} ${r1(buf[1])}`;
  for (let i = 1; i < n; i++) d += `L${r1(buf[i * 2])} ${r1(buf[i * 2 + 1])}`;
  return d;
}

/** The same shapes the homepage line takes, computed once on the server at a fixed size. */
function drawing(shape: StripShape, w: number, h: number): Drawing {
  const g: Geo = { w, h, portrait: false, n: 480 };
  const buf = new Float32Array(g.n * 2);
  let docs: Pt[] = [];
  let branches: [Pt, Pt][] = [];
  if (shape === "tangle") tangle(g, buf);
  if (shape === "taut") taut(g, buf);
  if (shape === "voice") wave(g, buf, 1, 9);
  if (shape === "knowledge") {
    const ka = knowledgeAnchors(g);
    resample(ka.path, g.n, buf, true);
    docs = ka.docs;
  }
  if (shape === "operations") {
    const ra = routeAnchors(g);
    resample(ra.path, g.n, buf, false);
    branches = ra.branches.map((b) => {
      const i = Math.round(b.from * (g.n - 1));
      return [[buf[i * 2], buf[i * 2 + 1]], b.to];
    });
  }
  if (shape === "products") resample(framePath(g, { x: 0.5 * w, y: 0.16 * h, w: 0.42 * w, h: 0.68 * h }, 0.16 * h), g.n, buf, false);
  return { d: toD(buf, g.n), docs, branches };
}

function Svg({ shape, w, h, className }: { shape: StripShape; w: number; h: number; className: string }) {
  const { d, docs, branches } = drawing(shape, w, h);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {docs.map(([x, y], i) => <rect key={i} x={r1(x - 44)} y={r1(y - 30)} width="88" height="60" className={styles.doc} />)}
      {branches.map(([a, b], i) => (
        <g key={i}>
          <path d={`M${r1(a[0])} ${r1(a[1])}L${r1(a[0])} ${r1(b[1])}L${r1(b[0])} ${r1(b[1])}`} pathLength={1} className={styles.branch} />
          <circle cx={r1(b[0])} cy={r1(b[1])} r="5" className={styles.node} />
        </g>
      ))}
      <path d={d} pathLength={1} className={styles.path} />
    </svg>
  );
}

/** A still of the Line, drawn in once on load. Inner pages use it where the homepage runs it live. */
export function LineStrip({ shape, children }: { shape: StripShape; children?: React.ReactNode }) {
  return (
    <div className={styles.strip}>
      <Svg shape={shape} w={1600} h={300} className={styles.wide} />
      <Svg shape={shape} w={760} h={300} className={styles.narrow} />
      {children && <div className={`wrap ${styles.inner}`}>{children}</div>}
    </div>
  );
}
