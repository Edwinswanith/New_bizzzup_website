import s from "./Signature.module.css";
import { d } from "./util";

/* Saloon Management System (Priya Natural Care): seven branches keeping their own versions of the truth
   → one system, one record → billing, stock, staff and customers on it → live revenue visibility.
   Facts: 7 branches, 600+ customers, 1,000+ transactions; POS, inventory (low-stock alert at ≤5 units),
   staff, CRM; analytics filterable per branch; live on Google Cloud Run. */

export const label =
  "Illustration of the Saloon Management System: seven separate branches are connected to one system with one record, which runs billing, stock, staff and customers and gives live revenue visibility across branches.";

const SCATTER = [[-14, -10, -7], [10, 14, 6], [-8, 12, 9], [16, -12, -5], [-12, 8, 5], [12, 10, -8], [-10, -14, 6]];
const MODULES = ["POS billing", "Inventory", "Staff", "Customers"];
const BARS = [0.62, 0.48, 0.8, 0.55, 0.7, 0.42, 0.9];

export function Wide() {
  // Two staggered columns: every branch's wire runs right through the gap between the boxes of the next column.
  const bx = (i: number) => (i < 4 ? 0 : 100);
  const by = (i: number) => (i < 4 ? 24 + i * 34 : 41 + (i - 4) * 34);
  const node = { x: 290, y: 50, w: 190, h: 52 };
  return (
    <svg viewBox="0 0 1200 150" preserveAspectRatio="xMinYMid meet" role="img" aria-label={label}>
      <text x="0" y="12" className={s.fade} style={d(0)}>01 · 7 branches · 7 records</text>
      {/* branches arrive scattered and slightly askew, then settle into line */}
      {SCATTER.map(([dx, dy, r], i) => (
        <g key={i} className={s.drift} style={{ ...d(0.05 + i * 0.05), ["--dx" as string]: `${dx}px`, ["--dy" as string]: `${dy}px`, ["--r" as string]: `${r}deg` }}>
          <rect x={bx(i)} y={by(i)} width="84" height="22" rx="2" className={s.box} />
          <text x={bx(i) + 42} y={by(i) + 15} textAnchor="middle" className={s.t} style={{ fontSize: "10px" }}>Branch {i + 1}</text>
        </g>
      ))}

      {/* every branch wired into one system */}
      {SCATTER.map((_, i) => {
        const y = by(i) + 11;
        return <path key={i} d={`M${bx(i) + 84} ${y} H210 C250 ${y} 250 76 ${node.x} 76`} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.75 + i * 0.04)} />;
      })}
      <text x={node.x} y="12" className={s.fade} style={d(1)}>02 · One record</text>
      <g className={s.pop} style={d(1.15)}>
        <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="3" className={s.boxOn} />
        <text x={node.x + 14} y="73" className={s.big}>One system</text>
        <text x={node.x + 14} y="91" style={{ fontSize: "10px" }}>Google Cloud Run</text>
      </g>

      {/* 03 · what runs on it */}
      <text x="530" y="12" className={s.fade} style={d(1.35)}>03 · Runs on it</text>
      {MODULES.map((m, i) => (
        <g key={m}>
          <path d={`M480 76 C505 76 505 ${36 + i * 30} 530 ${36 + i * 30}`} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1.4 + i * 0.05)} />
          <g className={s.rise} style={d(1.55 + i * 0.07)}>
            <rect x="530" y={24 + i * 30} width="150" height="24" rx="2" className={s.box} />
            <text x="542" y={40 + i * 30} className={s.t}>{m}</text>
          </g>
        </g>
      ))}
      <g className={s.pop} style={d(2.05)}>
        <circle cx="666" cy="66" r="4" className={s.hot} />
      </g>
      <text x="692" y="70" className={`${s.s} ${s.fade}`} style={d(2.1)}>Low stock ≤ 5</text>

      {/* 04 · live revenue, per branch */}
      <text x="870" y="12" className={s.fade} style={d(1.9)}>04 · Live revenue visibility</text>
      <path d="M870 124 H1170" className={`${s.rule} ${s.fade}`} style={d(1.9)} />
      {BARS.map((h, i) => (
        <rect key={i} x={882 + i * 40} y={124 - h * 92} width="22" height={h * 92} className={`${i === 6 ? s.hot : s.solid} ${s.grow}`} style={d(2 + i * 0.06)} />
      ))}
      <text x="870" y="142" className={s.fade} style={d(2.4)}>600+ customers · 1,000+ transactions</text>
    </svg>
  );
}

export function Narrow() {
  return (
    <svg viewBox="0 0 360 104" preserveAspectRatio="xMinYMid meet" role="img" aria-label={label}>
      <text x="0" y="10" className={s.fade} style={d(0)}>7 branches</text>
      {SCATTER.map(([dx, dy, r], i) => (
        <g key={i} className={s.drift} style={{ ...d(0.05 + i * 0.04), ["--dx" as string]: `${dx / 2}px`, ["--dy" as string]: `${dy / 2}px`, ["--r" as string]: `${r}deg` }}>
          <rect x={i % 2 ? 26 : 0} y={20 + i * 11} width="22" height="9" rx="1.5" className={s.box} />
        </g>
      ))}
      {SCATTER.map((_, i) => (
        <path key={i} d={`M${(i % 2 ? 26 : 0) + 22} ${24.5 + i * 11} C78 ${24.5 + i * 11} 78 58 100 58`} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.5 + i * 0.03)} />
      ))}
      <g className={s.pop} style={d(0.85)}>
        <rect x="100" y="40" width="104" height="36" rx="3" className={s.boxOn} />
        <text x="152" y="62" textAnchor="middle" className={s.t} style={{ fontSize: "11px" }}>One system</text>
      </g>
      {["POS", "Stock", "Staff", "CRM"].map((m, i) => (
        <g key={m}>
          <path d={`M204 58 C212 58 212 ${26 + i * 22} 220 ${26 + i * 22}`} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1 + i * 0.04)} />
          <g className={s.rise} style={d(1.1 + i * 0.06)}>
            <rect x="220" y={17 + i * 22} width="58" height="18" rx="2" className={s.box} />
            <text x="249" y={30 + i * 22} textAnchor="middle" className={s.t}>{m}</text>
          </g>
        </g>
      ))}
      <path d="M288 100 H360" className={`${s.rule} ${s.fade}`} style={d(1.3)} />
      {BARS.map((h, i) => (
        <rect key={i} x={290 + i * 10} y={100 - h * 70} width="6" height={h * 70} className={`${i === 6 ? s.hot : s.solid} ${s.grow}`} style={d(1.4 + i * 0.05)} />
      ))}
    </svg>
  );
}
