import s from "./Signature.module.css";
import { d } from "./util";
import { L, Chip, Frame } from "./parts";

/* Void Runner: a Three.js space shooter. The void boundary rises; the ship stays aggressive to escape it,
   dashing and shielding, collecting crystals. Campaign, Void Rush and Endless modes. Drawn as a game diagram,
   not a screenshot. */

export const label =
  "Illustration of Void Runner: a rising void boundary pushes the player's ship to stay aggressive, dashing, shielding and collecting crystals, across Campaign, Void Rush and Endless modes.";

const SHIP = "M0 -9 L22 0 L0 9 L5 0 Z";

export function Wide() {
  return (
    <Frame label={label}>
      <L x={0} t="Stay aggressive · escape the void" at={0} />
      {/* the void rises from below */}
      <rect x="0" y="104" width="900" height="44" className={`${s.soft} ${s.grow}`} style={d(0.1)} />
      <path d="M0 104 C120 96 220 112 340 102 S560 94 700 104 S860 110 900 100" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.15)} />
      <text x="12" y="132" className={`${s.s} ${s.fade}`} style={d(0.5)}>Void boundary ↑</text>
      {/* the ship's run: dash streaks, grazing past, shield */}
      <path d="M60 86 C200 84 260 54 400 56 S620 40 760 46" pathLength={1} className={`${s.dash} ${s.draw}`} style={d(0.35)} />
      {[[200, 76], [400, 56], [600, 46]].map(([x, y], i) => (
        <g key={i} className={s.fade} style={d(0.6 + i * 0.2)}>
          <path d={`M${x - 44} ${y} H${x - 10}`} className={s.wireInk} />
          <path d={`M${x - 36} ${y + 6} H${x - 14}`} className={s.wireInk} />
        </g>
      ))}
      {[[300, 40], [480, 72], [690, 30], [560, 28]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 7} L${x + 6} ${y} L${x} ${y + 7} L${x - 6} ${y} Z`} className={`${s.hot} ${s.pop}`} style={d(0.9 + i * 0.12)} />
      ))}
      <g className={s.drift} style={{ ...d(0.5), ["--dx" as string]: "-640px", ["--dy" as string]: "40px", animationDuration: "1.6s" }}>
        <circle cx="780" cy="44" r="18" className={s.dashBox} />
        <path d={SHIP} transform="translate(772 44)" className={s.solid} />
      </g>
      <text x="806" y="24" className={s.fade} style={d(2)}>Dash · shield · graze</text>

      {["Campaign", "Void Rush", "Endless"].map((t, i) => <Chip key={t} x={960} y={28 + i * 36} w={200} h={28} t={t} on={i === 1} at={2.1 + i * 0.1} />)}
    </Frame>
  );
}

export function Narrow() {
  return (
    <Frame narrow label={label}>
      <rect x="0" y="74" width="250" height="30" className={`${s.soft} ${s.grow}`} style={d(0.1)} />
      <path d="M0 74 C60 68 120 80 180 72 S240 70 250 72" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.15)} />
      <path d="M10 62 C70 60 110 36 200 34" pathLength={1} className={`${s.dash} ${s.draw}`} style={d(0.3)} />
      {[[90, 26], [150, 52], [120, 18]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y - 5} L${x + 4} ${y} L${x} ${y + 5} L${x - 4} ${y} Z`} className={`${s.hot} ${s.pop}`} style={d(0.7 + i * 0.1)} />
      ))}
      <g className={s.drift} style={{ ...d(0.4), ["--dx" as string]: "-180px", ["--dy" as string]: "26px", animationDuration: "1.4s" }}>
        <circle cx="214" cy="34" r="12" className={s.dashBox} />
        <path d={SHIP} transform="translate(208 34) scale(0.7)" className={s.solid} />
      </g>
      <text x="0" y="12" className={s.fade} style={d(0)}>Escape the void</text>
      {["Campaign", "Void Rush", "Endless"].map((t, i) => <Chip key={t} x={266} y={20 + i * 26} w={94} h={20} t={t} on={i === 1} at={1.3 + i * 0.08} size={10} />)}
    </Frame>
  );
}
