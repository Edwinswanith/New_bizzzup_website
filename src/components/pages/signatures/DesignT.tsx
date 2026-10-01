import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, W, Lines, Card, Frame } from "./parts";

/* DesignT: an idea in plain English (with up to 3 reference images) → Gemini artwork → the shirt, customised
   (five colours, XS to 3XL, placement) → the 4-step checkout ending in Razorpay payment. */

export const label =
  "Illustration of DesignT: a design described in plain English, with up to three reference images, becomes artwork, is placed on a t-shirt in one of five colours and sizes XS to 3XL, and moves through a four-step checkout: Design, Customise, Details, Payment.";

const TEE = "M40 8 L16 20 L4 44 L22 52 L28 40 L28 104 L92 104 L92 40 L98 52 L116 44 L104 20 L80 8 C76 18 44 18 40 8 Z";
const SWATCH = ["#f4f5f5", "#2b3036", "#f2461e", "#9aa0a6", "#d3d8da"];

function Art({ x, y, size, at }: { x: number; y: number; size: number; at: number }) {
  const r = size / 2;
  return (
    <g className={s.pop} style={d(at)}>
      <circle cx={x + r} cy={y + r} r={r * 0.62} className={s.hot} />
      <path d={`M${x + r * 0.35} ${y + r * 1.55} L${x + r} ${y + r * 0.5} L${x + r * 1.65} ${y + r * 1.55} Z`} className={s.solid} />
    </g>
  );
}

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="01 · Describe it" at={0} />
      <Card x={0} y={26} w={210} h={62} at={0.05} on />
      <Lines x={12} y={40} ws={[170, 140, 120]} gap={12} at={0.15} hot={0} />
      {[0, 1, 2].map((i) => <rect key={i} x={i * 40} y={100} width="32" height="32" rx="2" className={`${s.box} ${s.rise}`} style={d(0.4 + i * 0.08)} />)}
      <text x="130" y="122" className={s.fade} style={d(0.6)}>≤ 3 refs</text>

      <L x={260} t="02 · Gemini art" at={0.65} />
      <W p="M210 57 C236 57 236 80 262 80" at={0.7} />
      <Card x={262} y={30} w={100} h={100} at={0.8} />
      <Art x={282} y={50} size={60} at={0.95} />

      <L x={420} t="03 · Customise" at={1.15} />
      <W p="M362 80 H420" at={1.2} />
      <g className={s.fade} style={d(1.25)}>
        <path d={TEE} transform="translate(420 26) scale(0.95)" className={s.box} />
      </g>
      <Art x={458} y={60} size={38} at={1.4} />
      {SWATCH.map((c, i) => <circle key={c} cx={560 + i * 24} cy={44} r="8" fill={c} stroke="rgba(22,25,29,0.35)" className={s.pop} style={d(1.45 + i * 0.05)} />)}
      {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((z, i) => (
        <Chip key={z} x={552 + (i % 4) * 36} y={66 + Math.floor(i / 4) * 28} w={32} h={22} t={z} center on={z === "M"} at={1.6 + i * 0.03} size={10} />
      ))}

      <L x={760} t="04 · Checkout" at={1.85} />
      <W p="M700 80 H760" at={1.85} />
      {["Design", "Customise", "Details", "Payment"].map((t, i) => (
        <g key={t}>
          {i > 0 && <W p={`M${760 + i * 106 - 14} 80 H${760 + i * 106}`} at={1.95 + i * 0.12} />}
          <Chip x={760 + i * 106} y={66} w={92} h={28} t={`${i + 1} ${t}`} on={i === 3} at={1.95 + i * 0.12} size={10} />
        </g>
      ))}
      <text x="1078" y="116" className={s.fade} style={d(2.5)}>Razorpay</text>
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <L x={0} t="Idea" at={0} />
      <Card x={0} y={24} w={70} h={42} at={0.05} on />
      <Lines x={8} y={34} ws={[52, 40, 46]} gap={9} h={3} at={0.12} hot={0} />
      {[0, 1, 2].map((i) => <rect key={i} x={i * 22} y={74} width="18" height="18" rx="1.5" className={`${s.box} ${s.rise}`} style={d(0.3 + i * 0.06)} />)}
      <W p="M70 45 H86" at={0.45} />
      <Card x={86} y={22} w={56} h={56} at={0.5} />
      <Art x={96} y={32} size={36} at={0.6} />
      <W p="M142 50 H154" at={0.75} />
      <g className={s.fade} style={d(0.8)}><path d={TEE} transform="translate(154 18) scale(0.62)" className={s.box} /></g>
      <Art x={177} y={40} size={24} at={0.9} />
      {SWATCH.map((c, i) => <circle key={c} cx={160 + i * 14} cy={96} r="5" fill={c} stroke="rgba(22,25,29,0.35)" className={s.pop} style={d(0.95 + i * 0.04)} />)}
      <W p="M232 50 H244" at={1.1} />
      {["Design", "Customise", "Details", "Payment"].map((t, i) => (
        <Chip key={t} x={244} y={14 + i * 22} w={116} h={18} t={`${i + 1} ${t}`} on={i === 3} at={1.15 + i * 0.08} size={10} />
      ))}
    </Frame>
  );
}
