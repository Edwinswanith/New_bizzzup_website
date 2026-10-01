import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Bar, Frame } from "./parts";

/* Neura: conversations, voice notes, meetings and WhatsApp in → transcribed and segmented → tasks, decisions,
   risks, people, projects and follow-ups extracted → founder-scoped memory for review, search, reminders, chat. */

export const label =
  "Illustration of Neura: conversations, voice notes, meetings and WhatsApp messages are transcribed and segmented, then tasks, decisions, risks, people, projects and follow-ups are extracted into a founder's own memory for review, search, reminders and chat.";

const IN = ["Conversations", "Voice notes", "Meetings", "WhatsApp"];
const OUT = ["Tasks", "Decisions", "Risks", "People", "Projects", "Follow-ups"];
const SEG = [44, 30, 58, 26, 40, 34, 50];

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Inputs" at={0} />
      {IN.map((t, i) => <Chip key={t} x={0} y={26 + i * 28} w={160} h={22} t={t} at={0.05 + i * 0.07} size={11} />)}

      <L x={220} t="02 · Transcribe · segment" at={0.45} />
      {IN.map((_, i) => <W key={i} p={`M160 ${37 + i * 28} C190 ${37 + i * 28} 190 80 220 80`} at={0.5 + i * 0.04} />)}
      {SEG.map((w, i) => <Bar key={i} x={220 + SEG.slice(0, i).reduce((p, q) => p + q + 5, 0)} y={72} w={w} h={16} at={0.75 + i * 0.06} hot={i === 2} />)}

      <L x={580} t="03 · Extracted" at={1.25} />
      <W p="M537 80 H580" at={1.25} />
      {OUT.map((t, i) => <Chip key={t} x={580 + (i % 2) * 130} y={26 + Math.floor(i / 2) * 36} w={120} h={26} t={t} on={i === 1} at={1.3 + i * 0.07} size={11} />)}

      <L x={900} t="04 · Founder memory" at={1.85} />
      <W p="M830 80 H900" at={1.85} />
      <g className={s.pop} style={d(1.95)}>
        <rect x="900" y="30" width="270" height="100" rx="3" className={s.boxOn} />
        <text x="916" y="60" className={s.big}>Founder memory</text>
      </g>
      {["Review", "Search", "Reminders", "Chat"].map((t, i) => (
        <Chip key={t} x={910 + i * 64} y={82} w={62} h={22} t={t} center at={2.1 + i * 0.07} size={9} />
      ))}
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Inputs" at={0} />
      {IN.map((t, i) => <Chip key={t} x={0} y={18 + i * 21} w={104} h={17} t={t.split(" ")[0]} at={0.05 + i * 0.06} size={9} />)}
      {IN.map((_, i) => <W key={i} p={`M104 ${26 + i * 21} C110 ${26 + i * 21} 110 56 116 56`} at={0.35 + i * 0.03} />)}
      {[18, 12, 22, 10, 16].map((w, i, a) => <Bar key={i} x={116 + a.slice(0, i).reduce((p, q) => p + q + 3, 0)} y={50} w={w} h={12} at={0.5 + i * 0.05} hot={i === 2} />)}
      <W p="M206 56 H214" at={0.8} />
      <L x={214} t="Extracted" at={0.85} />
      {OUT.slice(0, 4).map((t, i) => <Chip key={t} x={214} y={18 + i * 21} w={80} h={17} t={t} on={i === 1} at={0.9 + i * 0.06} size={9} />)}
      <W p="M294 56 H302" at={1.2} />
      <g className={s.pop} style={d(1.25)}>
        <rect x="302" y="22" width="58" height="68" rx="3" className={s.boxOn} />
        <text x="331" y="52" textAnchor="middle" className={s.t} style={{ fontSize: "10px" }}>Founder</text>
        <text x="331" y="66" textAnchor="middle" className={s.t} style={{ fontSize: "10px" }}>memory</text>
      </g>
    </Frame>
  );
}
