import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Bar, Frame } from "./parts";

/* Apex (in progress): daily check-ins, attendance, session plans, RPE, recovery and feedback → readiness
   indicators and risk flags, with coach, athlete and guardian access scoped separately. No values are shown. */

export const label =
  "Illustration of Apex: daily check-ins, attendance, session plans, effort ratings (RPE), recovery and feedback are turned into readiness indicators and risk flags, with coach, athlete and guardian access each scoped to their own data.";

const IN = ["Check-in", "Attendance", "Session plan", "RPE", "Recovery", "Feedback"];
const ROLES = ["Coach", "Athlete", "Guardian"];

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Daily training + wellness" at={0} />
      {IN.map((t, i) => <Chip key={t} x={(i % 2) * 150} y={26 + Math.floor(i / 2) * 36} w={138} h={28} t={t} on={t === "RPE"} at={0.05 + i * 0.07} size={11} />)}

      <L x={360} t="02 · Readiness" at={0.6} />
      {[0, 1, 2].map((r) => <W key={r} p={`M288 ${40 + r * 36} C324 ${40 + r * 36} 324 80 360 80`} at={0.6 + r * 0.05} />)}
      {[0.55, 0.7, 0.62, 0.8, 0.74, 0.5, 0.42].map((h, i) => (
        <Bar key={i} x={360 + i * 36} y={130 - h * 96} w={26} h={h * 96} up hot={i === 6} at={0.75 + i * 0.07} />
      ))}
      <path d="M360 130 H612" className={`${s.rule} ${s.fade}`} style={d(0.7)} />
      <g className={s.pop} style={d(1.4)}>
        <path d="M628 76 L640 54 L652 76 Z" className={s.hot} />
        <text x="660" y="74" className={s.s}>Risk flag</text>
      </g>

      <L x={820} t="03 · Scoped access" at={1.55} />
      <W p="M760 80 H820" at={1.55} ink />
      {ROLES.map((t, i) => (
        <g key={t}>
          <Chip x={820} y={26 + i * 38} w={150} h={30} t={t} solid={i === 0} at={1.65 + i * 0.1} size={11} />
          <rect x="986" y={26 + i * 38} width="180" height="30" rx="2" className={`${s.box} ${s.fade}`} style={d(1.75 + i * 0.1)} />
          <text x="998" y={45 + i * 38} className={s.fade} style={{ ...d(1.8 + i * 0.1), fontSize: "10px" }}>Scoped data</text>
        </g>
      ))}
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Inputs" at={0} />
      {["Check-in", "Attendance", "RPE · recovery"].map((t, i) => <Chip key={t} x={0} y={20 + i * 26} w={106} h={20} t={t} on={i === 2} at={0.05 + i * 0.06} size={9} />)}
      <W p="M106 58 H112" at={0.4} />
      <L x={112} t="Readiness" at={0.45} />
      {[0.55, 0.7, 0.62, 0.8, 0.5, 0.42].map((h, i) => <Bar key={i} x={112 + i * 17} y={100 - h * 72} w={12} h={h * 72} up hot={i === 5} at={0.5 + i * 0.05} />)}
      <g className={s.pop} style={d(0.9)}><path d="M222 46 L230 32 L238 46 Z" className={s.hot} /></g>
      <W p="M240 58 H250" at={1} ink />
      {ROLES.map((t, i) => <Chip key={t} x={250} y={22 + i * 26} w={110} h={20} t={t} solid={i === 0} at={1.05 + i * 0.08} size={10} />)}
    </Frame>
  );
}
