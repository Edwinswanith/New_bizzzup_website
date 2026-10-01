import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Dot, Frame } from "./parts";

/* Kanaka Gold Loan: the borrower journey for a pledge-backed gold or silver loan, step by step, with the
   server-side rules (rate snapshot, LTV, fees, GST, repayment schedule) underneath and the admin reviewing. */

export const label =
  "Illustration of Kanaka Gold Loan: a borrower estimates eligibility, applies, completes KYC, uploads documents, books an appointment, tracks status and repays, while server-side rules handle the rate snapshot, loan-to-value, fees, GST and repayment schedule and an admin reviews each application.";

const STEPS = ["Estimate", "Apply", "KYC", "Documents", "Appointment", "Status", "Repay"];
const RULES = ["Rate snapshot", "LTV", "Fees", "GST", "Schedule"];

export function Wide() {
  const x = (i: number) => 20 + i * 190;
  return (
    <Frame label={label}>
      <L x={0} t="Borrower journey" at={0} />
      <path d={`M${x(0)} 48 H${x(6)}`} className={`${s.rule} ${s.fade}`} style={d(0.05)} />
      <W p={`M${x(0)} 48 H${x(6)}`} at={0.15} />
      {STEPS.map((t, i) => (
        <g key={t}>
          <Dot x={x(i)} y={48} r={6} at={0.2 + i * 0.12} fill={i === 6} />
          <text x={x(i)} y="74" textAnchor="middle" className={`${i === 6 ? s.s : s.t} ${s.fade}`} style={{ ...d(0.25 + i * 0.12), fontSize: "11px" }}>{t}</text>
        </g>
      ))}
      <L x={0} y={104} t="Server-side rules" at={1.1} />
      {RULES.map((t, i) => <Chip key={t} x={180 + i * 150} y={92} w={138} h={24} t={t} at={1.15 + i * 0.08} size={11} />)}
      <W p="M918 104 H960" at={1.6} ink />
      <Chip x={960} y={92} w={150} h={24} t="Admin review" dash at={1.65} size={11} />
      <text x="0" y="142" className={s.fade} style={d(1.8)}>Gold · silver · pledge-backed</text>
    </Frame>
  );
}

export function Narrow() {
  const x = (i: number) => 12 + i * 56;
  return (
    <Frame narrow label={label}>
      <W p={`M${x(0)} 26 H${x(6)}`} at={0.05} />
      {STEPS.map((t, i) => (
        <g key={t}>
          <Dot x={x(i)} y={26} r={5} at={0.1 + i * 0.08} fill={i === 6} />
          <text x={i === 0 ? 2 : i === 6 ? 360 : x(i)} y={i % 2 ? 50 : 12} textAnchor={i === 0 ? "start" : i === 6 ? "end" : "middle"} className={`${i === 6 ? s.s : s.t} ${s.fade}`} style={{ ...d(0.15 + i * 0.08), fontSize: "9px" }}>{t === "Appointment" ? "Visit" : t === "Documents" ? "Docs" : t}</text>
        </g>
      ))}
      {RULES.map((t, i) => <Chip key={t} x={(i % 3) * 122} y={62 + Math.floor(i / 3) * 22} w={114} h={18} t={t} at={0.75 + i * 0.06} size={9} />)}
      <Chip x={244} y={84} w={114} h={18} t="Admin review" dash at={1.1} size={9} />
    </Frame>
  );
}
