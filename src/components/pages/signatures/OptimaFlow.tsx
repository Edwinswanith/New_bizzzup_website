import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Frame } from "./parts";

/* OptimaFlow: nodes dropped on a canvas and wired into a pipeline → the backend validates the DAG and runs the
   nodes in topological order → Baseline and Tilde (Rect, Spoke, Fovea) quantisation compared side by side across
   training and inference. No results are shown: the site publishes none. */

export const label =
  "Illustration of OptimaFlow: data, model, quantisation and training nodes are wired into a pipeline on a canvas, the backend validates and runs them in order, and Baseline, Rect, Spoke and Fovea quantisation are compared side by side across training and inference.";

const NODES = ["Data", "Model", "Quantise", "Train"];
const VARIANTS = ["Baseline", "Rect", "Spoke", "Fovea"];
const POS = [[0, 22], [70, 22], [70, 62], [0, 62]]; // snake: Data → Model ↓ Quantise ← Train
const SCAT = [[-18, 14, -6], [12, -16, 5], [-10, -12, 7], [16, 12, -5]];

export function Wide() {
  const nx = (i: number) => i * 128, ny = (i: number) => (i % 2 ? 84 : 40);
  return (
    <Frame label={label}>
      <L x={0} t="01 · Wire the canvas" at={0} />
      {NODES.map((n, i) => (
        <g key={n} className={s.drift} style={{ ...d(0.05 + i * 0.06), ["--dx" as string]: `${SCAT[i][0]}px`, ["--dy" as string]: `${SCAT[i][1]}px`, ["--r" as string]: `${SCAT[i][2]}deg` }}>
          <rect x={nx(i)} y={ny(i)} width="100" height="30" rx="3" className={s.box} />
          <circle cx={nx(i) + 100} cy={ny(i) + 15} r="3.5" className={s.dot} />
          <circle cx={nx(i)} cy={ny(i) + 15} r="3.5" className={s.dot} />
          <text x={nx(i) + 12} y={ny(i) + 19} className={s.t}>{n}</text>
        </g>
      ))}
      {NODES.slice(1).map((_, i) => (
        <W key={i} p={`M${nx(i) + 100} ${ny(i) + 15} C${nx(i) + 116} ${ny(i) + 15} ${nx(i + 1) - 16} ${ny(i + 1) + 15} ${nx(i + 1)} ${ny(i + 1) + 15}`} at={0.55 + i * 0.1} />
      ))}

      <L x={0} y={142} t="02 · Validate DAG → run in order" at={0.9} />
      {NODES.map((_, i) => (
        <g key={i} className={s.pop} style={d(1 + i * 0.16)}>
          <rect x={nx(i)} y={ny(i)} width="100" height="30" rx="3" fill="none" stroke="var(--signal)" strokeWidth="1.6" />
          <text x={nx(i) + 92} y={ny(i) - 4} textAnchor="end" className={s.s} style={{ fontSize: "10px" }}>{i + 1}</text>
        </g>
      ))}

      <L x={600} t="03 · Quantisation, side by side" at={1.6} />
      <text x="1000" y="34" textAnchor="middle" className={s.fade} style={{ ...d(1.65), fontSize: "10px" }}>Training</text>
      <text x="1110" y="34" textAnchor="middle" className={s.fade} style={{ ...d(1.65), fontSize: "10px" }}>Inference</text>
      {VARIANTS.map((v, i) => (
        <g key={v}>
          <W p={`M484 99 C540 99 540 ${52 + i * 26} 600 ${52 + i * 26}`} at={1.65 + i * 0.06} />
          <Chip x={600} y={40 + i * 26} w={140} h={22} t={i ? `Tilde · ${v}` : v} on={i > 0} at={1.75 + i * 0.08} size={10} />
          <path d={`M748 ${51 + i * 26} H1160`} className={`${s.rule} ${s.fade}`} style={d(1.8 + i * 0.08)} />
          {[1000, 1110].map((x, k) => (
            <g key={x} className={s.pop} style={d(2 + i * 0.08 + k * 0.05)}>
              <rect x={x - 26} y={43 + i * 26} width="52" height="16" rx="2" className={s.box} />
              <path d={`M${x - 6} ${51 + i * 26} l4 4 l8 -8`} className={s.wireInk} />
            </g>
          ))}
        </g>
      ))}
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Pipeline" at={0} />
      {NODES.map((n, i) => (
        <g key={n} className={s.drift} style={{ ...d(0.05 + i * 0.05), ["--dx" as string]: `${SCAT[i][0] / 2}px`, ["--dy" as string]: `${SCAT[i][1] / 2}px`, ["--r" as string]: `${SCAT[i][2]}deg` }}>
          <rect x={POS[i][0]} y={POS[i][1]} width="62" height="26" rx="3" className={s.box} />
          <text x={POS[i][0] + 31} y={POS[i][1] + 17} textAnchor="middle" className={s.t} style={{ fontSize: "9px" }}>{n}</text>
        </g>
      ))}
      <W p="M62 35 H70 M101 48 V62 M70 75 H62" at={0.45} />
      {NODES.map((_, i) => (
        <rect key={i} x={POS[i][0]} y={POS[i][1]} width="62" height="26" rx="3" fill="none" stroke="var(--signal)" strokeWidth="1.4" className={s.pop} style={d(0.7 + i * 0.12)} />
      ))}
      <W p="M132 75 C150 75 150 52 166 52" at={1.15} />
      <L x={166} t="Compared" at={1.2} />
      {VARIANTS.map((v, i) => (
        <g key={v}>
          <Chip x={166} y={20 + i * 21} w={92} h={17} t={v} on={i > 0} at={1.25 + i * 0.07} size={10} />
          {[290, 336].map((x, k) => (
            <path key={x} d={`M${x} ${29 + i * 21} l4 4 l8 -8`} className={`${s.wireInk} ${s.pop}`} style={d(1.5 + i * 0.06 + k * 0.04)} />
          ))}
        </g>
      ))}
      <text x="296" y="14" textAnchor="middle" className={s.fade} style={{ ...d(1.25), fontSize: "9px" }}>Train</text>
      <text x="342" y="14" textAnchor="middle" className={s.fade} style={{ ...d(1.25), fontSize: "9px" }}>Infer</text>
    </Frame>
  );
}
