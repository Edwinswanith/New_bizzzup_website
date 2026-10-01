import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Lines, Card, Frame } from "./parts";

/* Legal Assistant: legal documents in (scanned ones through OCR) → four CrewAI crews → clauses, risks and
   obligations extracted → case law from Indian Kanoon shown beside the active document. */

export const label =
  "Illustration of Legal Assistant: legal documents, including scanned ones read with OCR, go to four specialised agent crews for comparison, content listing, suggestions and PDF analysis; the result surfaces clauses, risks and obligations, with Indian Kanoon case law shown beside the document.";

const CREWS = ["Compare", "List content", "Suggest", "PDF analysis"];

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Documents · OCR" at={0} />
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.rise} style={d(0.05 + i * 0.1)}>
          <rect x={i * 22} y={30 + i * 10} width="96" height="86" rx="2" className={i === 2 ? s.boxOn : s.box} />
        </g>
      ))}
      <Lines x={56} y={64} ws={[70, 56, 64, 48]} gap={10} at={0.4} />
      <text x="0" y="148" className={s.fade} style={d(0.45)}>Scanned → OCR</text>

      <L x={230} t="02 · Four crews" at={0.6} />
      {CREWS.map((c, i) => (
        <g key={c}>
          <W p={`M138 80 C180 80 180 ${40 + i * 28} 230 ${40 + i * 28}`} at={0.65 + i * 0.06} />
          <Chip x={230} y={28 + i * 28} w={150} t={c} on={i === 0} at={0.75 + i * 0.08} size={11} />
        </g>
      ))}

      <L x={440} t="03 · Clauses · risks · obligations" at={1.2} />
      {CREWS.map((_, i) => <W key={i} p={`M380 ${40 + i * 28} C410 ${40 + i * 28} 410 80 440 80`} at={1.2 + i * 0.04} />)}
      <Card x={440} y={26} w={300} h={110} at={1.3} />
      {[["Clause", true], ["Risk", false], ["Obligation", false]].map(([t, hot], i) => (
        <g key={String(t)} className={s.rise} style={d(1.4 + i * 0.12)}>
          <text x="454" y={52 + i * 30} className={hot ? s.s : s.t}>{String(t)}</text>
          <rect x="580" y={44 + i * 30} width={i === 1 ? 110 : 140} height="8" rx="1.5" className={hot ? s.hot : s.solid} />
          <path d={`M454 ${62 + i * 30} H726`} className={s.rule} />
        </g>
      ))}

      <L x={790} t="04 · Case law, beside the document" at={1.85} />
      <W p="M740 80 H790" at={1.85} />
      <Card x={790} y={26} w={180} h={110} at={1.9} />
      <Lines x={804} y={42} ws={[150, 130, 146, 120, 140, 100, 136, 110]} gap={11} at={1.95} hot={3} />
      <Card x={984} y={26} w={196} h={110} at={2.05} on />
      <text x="998" y="46" className={`${s.s} ${s.fade}`} style={d(2.1)}>Indian Kanoon</text>
      {[0, 1, 2].map((i) => (
        <g key={i} className={s.rise} style={d(2.2 + i * 0.1)}>
          <rect x="998" y={58 + i * 24} width={150 - i * 20} height="6" rx="1" className={s.solid} />
          <rect x="998" y={68 + i * 24} width={120} height="4" rx="1" className={s.mute} />
        </g>
      ))}
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Docs" at={0} />
      {[0, 1, 2].map((i) => <rect key={i} x={i * 10} y={22 + i * 6} width="44" height="56" rx="2" className={`${i === 2 ? s.boxOn : s.box} ${s.rise}`} style={d(0.05 + i * 0.08)} />)}
      <Lines x={28} y={44} ws={[26, 20, 24]} gap={8} h={3} at={0.3} />
      <L x={82} t="Crews" at={0.45} />
      {CREWS.map((c, i) => (
        <g key={c}>
          <W p={`M64 56 C74 56 74 ${30 + i * 20} 82 ${30 + i * 20}`} at={0.5 + i * 0.05} />
          <rect x="82" y={23 + i * 20} width="58" height="14" rx="2" className={`${i === 0 ? s.boxOn : s.box} ${s.rise}`} style={d(0.6 + i * 0.06)} />
        </g>
      ))}
      <W p="M140 56 H154" at={0.95} />
      <L x={154} t="Found" at={1} />
      <Card x={154} y={22} w={96} h={74} at={1} />
      {["Clause", "Risk", "Obligation"].map((t, i) => (
        <text key={t} x="162" y={40 + i * 20} className={`${i ? s.t : s.s} ${s.rise}`} style={{ ...d(1.1 + i * 0.1), fontSize: "9px" }}>{t}</text>
      ))}
      <W p="M250 56 H262" at={1.4} />
      <L x={262} t="Case law" at={1.45} />
      <Card x={262} y={22} w={98} h={74} at={1.45} on />
      <Lines x={270} y={34} ws={[80, 64, 76, 56, 70]} gap={11} h={3} at={1.55} hot={0} />
    </Frame>
  );
}
