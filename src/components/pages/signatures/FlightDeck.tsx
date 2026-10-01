import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Bar, Frame } from "./parts";

/* FlightDeck: three roles on one system. Students move through subjects, topics, PDFs and MCQ quizzes with
   performance tracked; mentors set availability and run video sessions where identity is protected by
   codenames; admins manage users, materials and question banks. */

export const label =
  "Illustration of FlightDeck: students work through subjects, topics, PDFs and multiple-choice quizzes with their performance tracked; mentors set availability and run video sessions under codenames that protect identity; admins manage users, materials and question banks.";

const ROWS: [string, string[]][] = [
  ["Student", ["Subjects", "Topics", "PDFs", "MCQ quiz"]],
  ["Mentor", ["Availability", "Video session"]],
  ["Admin", ["Users", "Materials", "Question banks"]],
];

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="One system · three roles" at={0} />
      {ROWS.map(([role, steps], r) => {
        const y = 26 + r * 40;
        return (
          <g key={role}>
            <Chip x={0} y={y} w={110} h={28} t={role} solid at={0.05 + r * 0.1} />
            {steps.map((t, i) => {
              const x = 150 + i * 150;
              return (
                <g key={t}>
                  <W p={`M${i ? x - 20 : 110} ${y + 14} H${x}`} at={0.3 + r * 0.15 + i * 0.1} />
                  <Chip x={x} y={y} w={130} h={28} t={t} on={t === "MCQ quiz" || t === "Video session"} at={0.35 + r * 0.15 + i * 0.1} size={11} />
                </g>
              );
            })}
          </g>
        );
      })}
      {/* student → performance */}
      <W p="M730 40 H780" at={1.05} />
      <L x={780} y={20} t="Performance" at={1.1} />
      {[0.4, 0.55, 0.5, 0.7, 0.82].map((h, i) => <Bar key={i} x={780 + i * 22} y={60 - h * 34} w={14} h={h * 34} up hot={i === 4} at={1.15 + i * 0.06} />)}
      {/* mentor session → codename */}
      <W p="M430 80 H900" at={1.45} />
      <g className={s.pop} style={d(1.7)}>
        <rect x="900" y="66" width="230" height="28" rx="2" className={s.boxOn} />
        <text x="914" y="84" className={s.t}>Codename · ID hidden</text>
      </g>
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      {ROWS.map(([role], r) => {
        const y = 8 + r * 32;
        const show = r === 0 ? ["Topics", "PDFs", "MCQ quiz"] : r === 1 ? ["Availability", "Video"] : ["Users", "Q. banks"];
        return (
          <g key={role}>
            <Chip x={0} y={y} w={70} h={24} t={role} solid at={0.05 + r * 0.08} size={10} />
            {show.map((t, i) => {
              const w = r === 1 ? 128 : r === 0 ? 84 : 128;
              const x = 82 + i * (w + 10);
              return (
                <g key={t}>
                  <W p={`M${i ? x - 10 : 70} ${y + 12} H${x}`} at={0.3 + r * 0.12 + i * 0.08} />
                  <Chip x={x} y={y} w={w} h={24} t={r === 1 && i === 1 ? "Video · codename" : t} size={r === 1 && i === 1 ? 9 : 10} on={t === "MCQ quiz" || (r === 1 && i === 1)} at={0.35 + r * 0.12 + i * 0.08} />
                </g>
              );
            })}
          </g>
        );
      })}
    </Frame>
  );
}
