import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Dot, Frame } from "./parts";

/* Nutrition (in progress): two lanes that never mix. Backend rules own the health-critical numbers (calorie
   targets, macro splits, safety floors, daily recomputation); AI only helps with meal classification, the coach
   conversation and phrasing. Recovery Mode pauses a streak after low-engagement days instead of resetting it. */

export const label =
  "Illustration of Nutrition: deterministic backend rules own calorie targets, macro splits, safety floors and daily recomputation, while AI only classifies meals, runs the coach conversation and phrases messages; after low-engagement days Recovery Mode pauses the streak instead of resetting it.";

const RULES = ["Calorie target", "Macro split", "Safety floor", "Daily recompute"];
const AI = ["Meal classification", "Coach chat", "Phrasing"];

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} y={20} t="Rules · deterministic" at={0} size={10} />
      <W p="M190 16 H760" at={0.1} ink />
      {RULES.map((t, i) => <Chip key={t} x={190 + i * 146} y={4} w={136} h={24} t={t} solid at={0.2 + i * 0.08} size={11} />)}
      <L x={0} y={66} t="AI · assists only" at={0.45} hot />
      <W p="M190 62 H760" at={0.5} />
      {AI.map((t, i) => <Chip key={t} x={190 + i * 194} y={50} w={180} h={24} t={t} on at={0.6 + i * 0.08} size={11} />)}
      <path d="M190 39 H760" className={`${s.dash} ${s.fade}`} style={d(0.9)} />
      <text x="770" y="43" className={s.fade} style={{ ...d(0.95), fontSize: "10px" }}>Targets stay deterministic</text>

      <L x={0} y={118} t="Recovery mode" at={1.2} />
      {Array.from({ length: 14 }, (_, i) => {
        const paused = i === 8 || i === 9;
        return paused
          ? <g key={i} className={s.pop} style={d(1.3 + i * 0.06)}><rect x={190 + i * 40 - 6} y={106} width="4" height="14" className={s.solid} /><rect x={190 + i * 40 + 2} y={106} width="4" height="14" className={s.solid} /></g>
          : <Dot key={i} x={190 + i * 40} y={113} r={6} fill={i < 8 || i > 9} at={1.3 + i * 0.06} />;
      })}
      <text x="190" y="142" className={`${s.s} ${s.fade}`} style={d(2.25)}>Streak paused, not reset</text>
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Rules" at={0} />
      {RULES.map((t, i) => <Chip key={t} x={(i % 2) * 182} y={16 + Math.floor(i / 2) * 18} w={176} h={15} t={t} solid at={0.1 + i * 0.06} size={9} />)}
      <L x={0} y={66} t="AI assists" at={0.45} hot size={10} />
      {AI.map((t, i) => <Chip key={t} x={86 + i * 92} y={54} w={86} h={15} t={t === "Meal classification" ? "Meals" : t} on at={0.5 + i * 0.06} size={9} />)}
      {Array.from({ length: 10 }, (_, i) => {
        const paused = i === 6;
        return paused
          ? <g key={i} className={s.pop} style={d(0.8 + i * 0.05)}><rect x={8 + i * 18 - 4} y={84} width="3" height="11" className={s.solid} /><rect x={8 + i * 18 + 2} y={84} width="3" height="11" className={s.solid} /></g>
          : <Dot key={i} x={8 + i * 18} y={89} r={5} fill at={0.8 + i * 0.05} />;
      })}
      <text x="190" y="93" className={`${s.s} ${s.fade}`} style={{ ...d(1.35), fontSize: "10px" }}>Paused, not reset</text>
    </Frame>
  );
}
