import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Bar, Card, Frame } from "./parts";

/* Health Activity Dashboard: HealthKit (iOS), Health Connect (Android) and backend-synced data (Web) behind one
   HealthProvider interface → one shared dashboard UI (heart rate, steps, calories, distance) → wellness scoring,
   informational only. If a source is unavailable, a clearly labelled Demo Mode takes over. */

export const label =
  "Illustration of the Health Activity Dashboard: Apple Health on iOS, Health Connect on Android and synced data on the web all sit behind one shared provider interface, feeding one dashboard of heart rate, steps, calories and distance and an informational wellness score; when no source is available, a labelled Demo Mode is used.";

const SRC: [string, string][] = [["HealthKit", "iOS"], ["Health Connect", "Android"], ["Synced data", "Web"]];
const HR = "M0 20 L14 20 L20 6 L26 32 L32 14 L38 20 L60 20 L66 10 L72 28 L78 20 L100 20";

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Three platforms" at={0} />
      {SRC.map(([a, b], i) => (
        <g key={a} className={s.rise} style={d(0.05 + i * 0.08)}>
          <rect x="0" y={26 + i * 34} width="226" height="26" rx="2" className={s.box} />
          <text x="10" y={43 + i * 34} className={s.t} style={{ fontSize: "11px" }}>{a}</text>
          <text x="216" y={43 + i * 34} textAnchor="end" style={{ fontSize: "11px" }}>{b}</text>
        </g>
      ))}
      <Chip x={0} y={128} w={226} h={20} t="Demo Mode · labelled" dash at={0.4} size={10} />

      <L x={262} t="02 · One interface" at={0.45} />
      {SRC.map((_, i) => <W key={i} p={`M226 ${39 + i * 34} C244 ${39 + i * 34} 244 80 262 80`} at={0.5 + i * 0.04} />)}
      <W p="M226 138 C244 138 244 80 262 80" at={0.6} ink />
      <g className={s.pop} style={d(0.7)}>
        <rect x="262" y="56" width="180" height="48" rx="3" className={s.boxOn} />
        <text x="276" y="85" className={s.big}>HealthProvider</text>
      </g>

      <L x={490} t="03 · One dashboard" at={0.9} />
      <W p="M440 80 H490" at={0.9} />
      <Card x={490} y={26} w={330} h={110} at={0.95} />
      <path d={HR} transform="translate(504 40) scale(1.5 1)" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1.05)} />
      {["Heart rate", "Steps", "Calories", "Distance"].map((t, i) => (
        <g key={t}>
          <text x={504 + (i % 2) * 160} y={98 + Math.floor(i / 2) * 22} className={`${i ? s.t : s.s} ${s.fade}`} style={{ ...d(1.2 + i * 0.06), fontSize: "10px" }}>{t}</text>
          {i > 0 && <Bar x={600 + (i % 2) * 160} y={91 + Math.floor(i / 2) * 22} w={50} h={7} at={1.3 + i * 0.06} />}
        </g>
      ))}
      {[0.5, 0.7, 0.45, 0.8, 0.6].map((h, i) => <Bar key={i} x={680 + i * 24} y={70 - h * 34} w={16} h={h * 34} up at={1.25 + i * 0.05} />)}

      <L x={870} t="04 · Wellness score" at={1.6} />
      <W p="M820 80 H870" at={1.6} />
      {["Activity", "Sleep", "Heart", "Recovery"].map((t, i) => (
        <g key={t}>
          <text x="870" y={46 + i * 24} className={`${s.t} ${s.fade}`} style={{ ...d(1.7 + i * 0.07), fontSize: "11px" }}>{t}</text>
          <path d={`M970 ${42 + i * 24} H1150`} className={`${s.rule} ${s.fade}`} style={d(1.7 + i * 0.07)} />
          <Bar x={970} y={39 + i * 24} w={[130, 100, 150, 120][i]} h={7} hot={i === 3} at={1.8 + i * 0.07} />
        </g>
      ))}
      <text x="870" y="146" className={s.fade} style={d(2.2)}>BMI · BMR · informational only</text>
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      {SRC.map(([, b], i) => <Chip key={b} x={0} y={8 + i * 24} w={70} h={20} t={b} at={0.05 + i * 0.06} size={10} />)}
      <Chip x={0} y={80} w={70} h={20} t="Demo" dash at={0.3} size={10} />
      {[18, 42, 66, 90].map((y, i) => <W key={y} p={`M70 ${y} C80 ${y} 80 52 90 52`} at={0.35 + i * 0.03} ink={i === 3} />)}
      <g className={s.pop} style={d(0.55)}>
        <rect x="90" y="36" width="84" height="32" rx="3" className={s.boxOn} />
        <text x="132" y="56" textAnchor="middle" className={s.t} style={{ fontSize: "10px" }}>Provider</text>
      </g>
      <W p="M174 52 H186" at={0.7} />
      <Card x={186} y={8} w={174} h={92} at={0.75} />
      <path d={HR} transform="translate(196 18) scale(1.1 0.9)" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.85)} />
      {[0.5, 0.7, 0.45, 0.8].map((h, i) => <Bar key={i} x={320 + i * 9} y={48 - h * 28} w={6} h={h * 28} up at={1 + i * 0.05} />)}
      {["Activity", "Sleep", "Recovery"].map((t, i) => (
        <g key={t}>
          <text x="196" y={66 + i * 13} className={`${s.t} ${s.fade}`} style={{ ...d(1.1 + i * 0.06), fontSize: "9px" }}>{t}</text>
          <Bar x={262} y={60 + i * 13} w={[70, 56, 84][i]} h={5} hot={i === 2} at={1.2 + i * 0.06} />
        </g>
      ))}
    </Frame>
  );
}
