import s from "./Signature.module.css";
import { d, wave } from "./util";

/* Caption CC: code-switched speech → two-language transcript → one English track → subtitle files.
   Facts: FFmpeg extracts WAV (16 kHz mono) → Groq Whisper transcribes → Gemini corrects code-switching and
   translates to English → SRT, VTT or burned-in MP4. */

const SEGS: ["ta" | "en", number][] = [["ta", 52], ["en", 34], ["ta", 40], ["en", 58], ["ta", 30], ["en", 36]];

function lanes(x0: number, gap: number, yTa: number, yEn: number, h: number, scale: number, delay: number) {
  let x = x0;
  return SEGS.map(([lang, w], i) => {
    const el = (
      <rect key={i} x={x} y={(lang === "ta" ? yTa : yEn) - h / 2} width={w * scale} height={h} rx="2"
        className={`${lang === "ta" ? s.boxOn : s.box} ${s.rise}`} style={d(delay + i * 0.09)} />
    );
    x += w * scale + gap;
    return el;
  });
}

function merged(x0: number, gap: number, y: number, h: number, scale: number, delay: number) {
  let x = x0;
  return SEGS.map(([, w], i) => {
    const el = <rect key={i} x={x} y={y - h / 2} width={w * scale} height={h} rx="2" className={`${s.solid} ${s.growX}`} style={d(delay + i * 0.05)} />;
    x += w * scale + gap;
    return el;
  });
}

export const label =
  "Illustration of Caption CC: Tamil-English speech is extracted as audio, transcribed with both languages mixed, corrected and translated into one English track, and exported as SRT, VTT or burned-in MP4 subtitles.";

export function Wide() {
  return (
    <svg viewBox="0 0 1200 150" preserveAspectRatio="xMinYMid meet" role="img" aria-label={label}>
      {/* 01 · audio */}
      <text x="0" y="12" className={s.fade} style={d(0)}>01 · Audio · WAV 16 kHz mono</text>
      <path d={wave(0, 290, 78, 34, 7)} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.05)} />

      {/* 02 · code-switched transcript: each segment lands in its language's lane */}
      <text x="330" y="12" className={s.fade} style={d(0.45)}>02 · Whisper · code-switched</text>
      <text x="330" y="58" className={`${s.s} ${s.fade}`} style={d(0.5)}>TA</text>
      <text x="330" y="102" className={`${s.t} ${s.fade}`} style={d(0.5)}>EN</text>
      <path d="M290 78 L310 78" className={`${s.wire} ${s.draw}`} pathLength={1} style={d(0.55)} />
      <path d="M362 54 H640 M362 98 H640" className={`${s.rule} ${s.fade}`} style={d(0.5)} />
      {lanes(362, 6, 54, 98, 16, 1, 0.6)}

      {/* 03 · Gemini corrects + translates: both lanes converge into one English track */}
      <text x="676" y="12" className={s.fade} style={d(1.1)}>03 · Gemini → EN</text>
      <path d="M646 54 C672 54 672 78 700 78 M646 98 C672 98 672 78 700 78" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1.15)} />
      <circle cx="700" cy="78" r="4.5" className={`${s.dot} ${s.pop}`} style={d(1.4)} />
      {merged(714, 4, 78, 16, 0.6, 1.45)}

      {/* 04 · subtitles: the English track becomes captions on the video and three export files */}
      <text x="900" y="12" className={s.fade} style={d(1.8)}>04 · Subtitles</text>
      <path d="M884 78 L906 78" className={`${s.wire} ${s.draw}`} pathLength={1} style={d(1.8)} />
      <rect x="906" y="26" width="188" height="110" rx="3" className={`${s.box} ${s.fade}`} style={d(1.85)} />
      <path d="M992 66 L1012 78 L992 90 Z" className={`${s.mute} ${s.fade}`} style={d(1.9)} />
      <rect x="936" y="108" width="128" height="8" rx="1.5" className={`${s.solid} ${s.growX}`} style={d(2.05)} />
      <rect x="954" y="120" width="92" height="8" rx="1.5" className={`${s.solid} ${s.growX}`} style={d(2.15)} />
      {["SRT", "VTT", "MP4"].map((f, i) => (
        <g key={f} className={s.pop} style={d(2.25 + i * 0.1)}>
          <rect x="1116" y={30 + i * 36} width="64" height="26" rx="2" className={f === "MP4" ? s.boxOn : s.box} />
          <text x="1148" y={47 + i * 36} textAnchor="middle" className={s.t}>{f}</text>
        </g>
      ))}
      <text x="1116" y="146" className={s.fade} style={d(2.5)}>burned-in</text>
    </svg>
  );
}

export function Narrow() {
  return (
    <svg viewBox="0 0 360 104" preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}>
      <text x="0" y="10" className={s.fade} style={d(0)}>WAV</text>
      <path d={wave(0, 74, 56, 22, 4)} pathLength={1} className={`${s.wire} ${s.draw}`} style={d(0.05)} />
      <text x="90" y="10" className={s.fade} style={d(0.4)}>TA / EN</text>
      <path d="M90 40 H178 M90 72 H178" className={`${s.rule} ${s.fade}`} style={d(0.45)} />
      {lanes(90, 3, 40, 72, 12, 0.3, 0.5)}
      <path d="M182 40 C194 40 194 56 206 56 M182 72 C194 72 194 56 206 56" pathLength={1} className={`${s.wire} ${s.draw}`} style={d(1)} />
      <circle cx="206" cy="56" r="3.5" className={`${s.dot} ${s.pop}`} style={d(1.2)} />
      <text x="214" y="10" className={s.fade} style={d(1.2)}>EN</text>
      {merged(214, 2, 56, 12, 0.25, 1.25)}
      {["SRT", "VTT", "MP4"].map((f, i) => (
        <g key={f} className={s.pop} style={d(1.7 + i * 0.1)}>
          <rect x="306" y={20 + i * 28} width="54" height="22" rx="2" className={f === "MP4" ? s.boxOn : s.box} />
          <text x="333" y={35 + i * 28} textAnchor="middle" className={s.t}>{f}</text>
        </g>
      ))}
    </svg>
  );
}
