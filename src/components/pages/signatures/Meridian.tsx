import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Dot, Frame } from "./parts";

/* MERIDIAN: three apps (storefront 15 routes, vendor portal 17, admin panel 16) → one NestJS backend of 12
   bounded-context modules → explicit state machines: stock reserved on order creation and released on
   cancellation, prices snapshotted at order time → payment and shipping behind adapters. */

export const label =
  "Illustration of MERIDIAN: a customer storefront, vendor portal and admin panel share one backend of twelve modules; explicit state machines reserve stock when an order is created, release it on cancellation and snapshot the price; payments and shipping sit behind adapters.";

const APPS: [string, number][] = [["Storefront", 15], ["Vendor portal", 17], ["Admin panel", 16]];

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Three apps · routes" at={0} />
      {APPS.map(([a, n], i) => (
        <g key={a} className={s.rise} style={d(0.05 + i * 0.1)}>
          <rect x="0" y={28 + i * 38} width="190" height="30" rx="2" className={i === 0 ? s.boxOn : s.box} />
          <text x="12" y={47 + i * 38} className={s.t}>{a}</text>
          <text x="178" y={47 + i * 38} textAnchor="end" className={s.s}>{n}</text>
        </g>
      ))}

      <L x={250} t="02 · Backend · 12 modules" at={0.5} />
      {APPS.map((_, i) => <W key={i} p={`M190 ${43 + i * 38} C220 ${43 + i * 38} 220 81 250 81`} at={0.55 + i * 0.05} />)}
      <rect x="250" y="28" width="200" height="106" rx="3" className={`${s.boxOn} ${s.fade}`} style={d(0.65)} />
      {Array.from({ length: 12 }, (_, k) => (
        <rect key={k} x={262 + (k % 4) * 46} y={40 + Math.floor(k / 4) * 30} width="38" height="22" rx="2" className={`${k === 5 ? s.hot : s.box} ${s.pop}`} style={d(0.75 + k * 0.03)} />
      ))}

      <L x={500} t="03 · Order state machine" at={1.2} />
      <W p="M450 81 H500" at={1.2} />
      <Chip x={500} y={66} w={140} h={30} t="Order created" on at={1.3} />
      <W p="M640 81 H670" at={1.45} />
      <Chip x={670} y={34} w={180} h={28} t="Stock reserved" at={1.5} size={11} />
      <Chip x={670} y={68} w={180} h={28} t="Price snapshot" at={1.6} size={11} />
      <W p="M655 81 C655 116 660 118 670 118" at={1.7} ink />
      <Chip x={670} y={104} w={180} h={28} t="Cancelled → released" at={1.75} size={11} />
      <W p="M655 81 C655 48 660 48 670 48" at={1.45} />

      <L x={890} t="04 · Adapters" at={1.95} />
      <W p="M850 48 H890 M850 82 H890" at={2} />
      {[["Payments", 34], ["Shipping", 74]].map(([t, y], i) => (
        <g key={String(t)}>
          <Chip x={890} y={Number(y)} w={150} h={28} t={String(t)} at={2.05 + i * 0.1} />
          <Dot x={1040} y={Number(y) + 14} at={2.2 + i * 0.1} />
          <W p={`M1044 ${Number(y) + 14} H1080`} at={2.25 + i * 0.1} />
          <rect x="1080" y={Number(y) + 4} width="90" height="20" rx="2" className={`${s.box} ${s.fade}`} style={d(2.3 + i * 0.1)} />
          <text x="1125" y={Number(y) + 18} textAnchor="middle" className={s.fade} style={{ ...d(2.3 + i * 0.1), fontSize: "10px" }}>Provider</text>
        </g>
      ))}
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="3 apps" at={0} />
      {APPS.map(([a], i) => <Chip key={a} x={0} y={20 + i * 26} w={90} h={20} t={a.split(" ")[0]} on={i === 0} at={0.05 + i * 0.08} size={10} />)}
      {APPS.map((_, i) => <W key={i} p={`M90 ${30 + i * 26} C96 ${30 + i * 26} 96 56 102 56`} at={0.35 + i * 0.04} />)}
      <L x={102} t="12 modules" at={0.4} />
      <rect x="102" y="22" width="96" height="70" rx="3" className={`${s.boxOn} ${s.fade}`} style={d(0.45)} />
      {Array.from({ length: 12 }, (_, k) => (
        <rect key={k} x={109 + (k % 4) * 22} y={30 + Math.floor(k / 4) * 20} width="18" height="15" rx="1.5" className={`${k === 5 ? s.hot : s.box} ${s.pop}`} style={d(0.5 + k * 0.02)} />
      ))}
      <W p="M198 56 H212" at={0.85} />
      <L x={212} t="Order" at={0.9} />
      <Chip x={212} y={20} w={148} h={20} t="Stock reserved" on at={0.95} size={10} />
      <Chip x={212} y={46} w={148} h={20} t="Price snapshot" at={1.05} size={10} />
      <Chip x={212} y={72} w={148} h={20} t="Cancel → released" at={1.15} size={10} />
    </Frame>
  );
}
