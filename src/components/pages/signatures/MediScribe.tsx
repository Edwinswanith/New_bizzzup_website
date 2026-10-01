import s from "./Signature.module.css";
import { d, wave } from "./util";
import { L, Chip, W, Lines, Card, Frame } from "./parts";

/* MediScribe (in progress): consent first, then the ESP32-S3 recorder captures the consultation → transcript →
   a structured draft clinical note that stays a draft at the doctor-review gate. Nothing crosses the gate here. */

export const label =
  "Illustration of MediScribe: with consent recorded, a dedicated recorder captures the consultation, which becomes a transcript and then a structured draft clinical note; the note stays a draft until a doctor reviews it.";

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Consent" at={0} />
      <Chip x={0} y={28} w={130} t="Consent ✓" on at={0.05} />
      <g className={s.rise} style={d(0.2)}>
        <rect x="0" y="66" width="130" height="64" rx="8" className={s.box} />
        <circle cx="34" cy="98" r="12" className={s.dot} />
        <circle cx="34" cy="98" r="4" className={s.hot} />
        <text x="56" y="94" className={s.t} style={{ fontSize: "10px" }}>ESP32-S3</text>
        <text x="56" y="108" style={{ fontSize: "10px" }}>recorder</text>
      </g>

      <L x={180} t="02 · Recording → transcript" at={0.45} />
      <path d={wave(180, 420, 56, 20, 6)} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.5)} />
      <Lines x={180} y={92} ws={[230, 190, 210, 160]} gap={11} at={1} />

      <L x={470} t="03 · Draft clinical note" at={1.25} />
      <W p="M420 80 H470" at={1.25} />
      <Card x={470} y={26} w={250} h={110} at={1.3} />
      {["Visit", "Findings", "Plan"].map((t, i) => (
        <g key={t} className={s.rise} style={d(1.4 + i * 0.1)}>
          <text x="484" y={50 + i * 28} className={s.t}>{t}</text>
          <rect x="590" y={42 + i * 28} width={110 - i * 14} height="7" rx="1.5" className={s.mute} />
        </g>
      ))}
      <text x="706" y="128" textAnchor="end" className={`${s.s} ${s.fade}`} style={d(1.75)}>Draft</text>

      <L x={770} t="04 · Doctor review" at={1.9} />
      <W p="M720 80 H770" at={1.9} />
      <rect x="770" y="30" width="190" height="100" rx="3" className={`${s.box} ${s.dashEdge} ${s.fade}`} style={d(2)} />
      <text x="865" y="76" textAnchor="middle" className={`${s.t} ${s.fade}`} style={d(2.1)}>Waits for</text>
      <text x="865" y="94" textAnchor="middle" className={`${s.t} ${s.fade}`} style={d(2.15)}>the doctor</text>
      <text x="1000" y="76" className={s.fade} style={d(2.3)}>AI output stays</text>
      <text x="1000" y="94" className={s.fade} style={d(2.35)}>a draft until review</text>
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Consent ✓" at={0} hot />
      <g className={s.rise} style={d(0.1)}>
        <rect x="0" y="24" width="56" height="56" rx="7" className={s.box} />
        <circle cx="28" cy="52" r="10" className={s.dot} />
        <circle cx="28" cy="52" r="3.5" className={s.hot} />
      </g>
      <path d={wave(64, 140, 40, 14, 3)} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.3)} />
      <Lines x={64} y={64} ws={[72, 56, 66]} gap={9} h={3} at={0.7} />
      <W p="M140 52 H152" at={0.9} />
      <L x={152} t="Draft" at={0.95} hot />
      <Card x={152} y={22} w={92} h={74} at={0.95} />
      <Lines x={160} y={34} ws={[70, 56, 64, 48, 60]} gap={11} h={3} at={1.05} />
      <W p="M244 58 H256" at={1.3} />
      <rect x="256" y="22" width="104" height="74" rx="3" className={`${s.box} ${s.dashEdge} ${s.fade}`} style={d(1.35)} />
      <text x="308" y="55" textAnchor="middle" className={`${s.t} ${s.fade}`} style={{ ...d(1.45), fontSize: "10px" }}>Doctor</text>
      <text x="308" y="70" textAnchor="middle" className={`${s.t} ${s.fade}`} style={{ ...d(1.5), fontSize: "10px" }}>review</text>
    </Frame>
  );
}
