import s from "./Signature.module.css";
import { d } from "./util";

/* Prof. Hemant Sheth: the patient journey the site was built for. Found in search and AI answers → the right
   treatment page in the library → the clinic → a booking form pre-filled with that procedure and clinic.
   Facts: 15+ treatment pages across Upper GI, Hernia, HPB and Appendicectomy; Physician/MedicalWebPage/FAQPage
   structured data for search and AI answers; a page per clinic (London and Hertfordshire practice) with a
   "Book here" that pre-selects it; booking pre-filled with procedure or clinic; insurance or self-funding. */

export const label =
  "Illustration of the Prof. Hemant Sheth website: a patient finds the practice through search or an AI answer, reaches the right treatment page in a library of 15+ pages across four specialities, picks a clinic in London or Hertfordshire, and lands on a consultation form already filled with that procedure and clinic.";

const COLS = ["Upper GI", "Hernia", "HPB", "Appendicectomy"];

export function Wide() {
  const cx = (c: number) => 270 + c * 96;
  return (
    <svg viewBox="0 0 1200 150" preserveAspectRatio="xMinYMid meet" role="img" aria-label={label}>
      {/* 01 · found */}
      <text x="0" y="12" className={s.fade} style={d(0)}>01 · Search &amp; AI answers</text>
      {[0, 1].map((k) => (
        <g key={k} className={s.rise} style={d(0.05 + k * 0.12)}>
          <rect x="0" y={26 + k * 58} width="200" height="48" rx="3" className={k ? s.boxOn : s.box} />
          <rect x="12" y={38 + k * 58} width={k ? 120 : 140} height="6" rx="1" className={k ? s.hot : s.solid} />
          <rect x="12" y={50 + k * 58} width="160" height="4" rx="1" className={s.mute} />
          <rect x="12" y={59 + k * 58} width="110" height="4" rx="1" className={s.mute} />
        </g>
      ))}
      <text x="0" y="146" className={s.fade} style={d(0.35)}>Physician · FAQPage schema</text>

      {/* 02 · the treatment library, four specialities */}
      <text x="270" y="12" className={s.fade} style={d(0.4)}>02 · 15+ treatment pages</text>
      <path d="M200 108 C236 108 232 84 270 84" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.55)} />
      {COLS.map((c, i) => (
        <g key={c}>
          <text x={cx(i)} y="34" className={`${s.t} ${s.fade}`} style={{ ...d(0.5 + i * 0.06), fontSize: "10px" }}>{c}</text>
          {[0, 1, 2].map((r) => {
            const on = i === 1 && r === 1;
            return <rect key={r} x={cx(i)} y={44 + r * 26} width="86" height="20" rx="2" className={`${on ? s.boxOn : s.box} ${s.rise}`} style={d(0.55 + i * 0.06 + r * 0.05)} />;
          })}
        </g>
      ))}
      <path d="M270 84 H366" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.95)} />
      <rect x={cx(1) + 8} y="81" width="54" height="6" rx="1" className={`${s.hot} ${s.growX}`} style={d(1.1)} />

      {/* 03 · the clinic */}
      <text x="680" y="12" className={s.fade} style={d(1.2)}>03 · Clinic</text>
      <path d={`M${cx(1) + 86} 84 C${cx(1) + 104} 84 ${cx(1) + 104} 136 ${cx(1) + 124} 136 H648 C664 136 664 76 682 76`} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1.2)} />
      <rect x="682" y="26" width="168" height="110" rx="3" className={`${s.box} ${s.fade}`} style={d(1.3)} />
      <path d="M682 92 C730 70 780 104 850 74 M730 26 V136 M800 26 V136" className={`${s.rule} ${s.fade}`} style={d(1.35)} />
      {[[730, 62, "London"], [790, 104, "Herts"]].map(([x, y, n], i) => (
        <g key={n} className={s.pop} style={d(1.45 + i * 0.12)}>
          <path d={`M${x} ${+y + 12} C${+x - 9} ${+y} ${+x - 9} ${+y - 10} ${x} ${+y - 10} C${+x + 9} ${+y - 10} ${+x + 9} ${y} ${x} ${+y + 12} Z`} className={i ? s.solid : s.hot} />
          <text x={+x + 12} y={+y + 4} className={s.t}>{n}</text>
        </g>
      ))}

      {/* 04 · booking, pre-filled with the procedure and clinic the patient was viewing */}
      <text x="900" y="12" className={s.fade} style={d(1.75)}>04 · Book consultation</text>
      <path d="M850 76 C872 76 876 76 900 76" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1.75)} />
      <rect x="900" y="26" width="280" height="110" rx="3" className={`${s.boxOn} ${s.fade}`} style={d(1.8)} />
      {[["Procedure", "Hernia ✓"], ["Clinic", "London ✓"], ["Payment", "Insurance / self"]].map(([k, v], i) => (
        <g key={k} className={s.rise} style={d(1.9 + i * 0.1)}>
          <text x="914" y={48 + i * 22}>{k}</text>
          <text x="1166" y={48 + i * 22} textAnchor="end" className={i < 2 ? s.s : s.t}>{v}</text>
          <path d={`M914 ${54 + i * 22} H1166`} className={s.rule} />
        </g>
      ))}
      <g className={s.pop} style={d(2.3)}>
        <rect x="914" y="112" width="252" height="16" rx="2" className={s.solid} />
        <text x="1040" y="124" textAnchor="middle" style={{ fill: "var(--paper)" }}>Book consultation</text>
      </g>
    </svg>
  );
}

export function Narrow() {
  return (
    <svg viewBox="0 0 360 104" preserveAspectRatio="xMinYMid meet" role="img" aria-label={label}>
      <text x="0" y="10" className={s.fade} style={d(0)}>Found</text>
      <g className={s.rise} style={d(0.05)}>
        <rect x="0" y="22" width="62" height="60" rx="3" className={s.boxOn} />
        <rect x="8" y="32" width="40" height="5" rx="1" className={s.hot} />
        <rect x="8" y="43" width="46" height="3" rx="1" className={s.mute} />
        <rect x="8" y="50" width="34" height="3" rx="1" className={s.mute} />
      </g>
      <path d="M62 52 H82" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.35)} />
      <text x="82" y="10" className={s.fade} style={d(0.35)}>15+ pages</text>
      {[0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => {
        const on = c === 1 && r === 1;
        return <rect key={`${c}${r}`} x={82 + c * 26} y={22 + r * 22} width="22" height="16" rx="1.5" className={`${on ? s.boxOn : s.box} ${s.rise}`} style={d(0.4 + c * 0.05 + r * 0.04)} />;
      }))}
      <path d="M130 52 C160 52 166 52 190 52" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.85)} />
      <g className={s.pop} style={d(1)}>
        <path d="M200 64 C192 54 192 44 200 44 C208 44 208 54 200 64 Z" className={s.hot} />
      </g>
      <text x="190" y="10" className={s.fade} style={d(1)}>Clinic</text>
      <path d="M208 52 H236" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1.1)} />
      <rect x="236" y="18" width="124" height="80" rx="3" className={`${s.boxOn} ${s.fade}`} style={d(1.15)} />
      {["Procedure ✓", "Clinic ✓"].map((t, i) => (
        <g key={t} className={s.rise} style={d(1.25 + i * 0.1)}>
          <text x="246" y={36 + i * 18} className={s.s}>{t}</text>
          <path d={`M246 ${41 + i * 18} H350`} className={s.rule} />
        </g>
      ))}
      <g className={s.pop} style={d(1.5)}>
        <rect x="246" y="76" width="104" height="14" rx="2" className={s.solid} />
        <text x="298" y="86.5" textAnchor="middle" style={{ fill: "var(--paper)", fontSize: "9px" }}>Book</text>
      </g>
    </svg>
  );
}
