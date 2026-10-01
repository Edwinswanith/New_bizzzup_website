import type { CSSProperties } from "react";

/** Arrival delay for one element (seconds). */
export const d = (sec: number) => ({ ["--d" as string]: `${sec}s` }) as CSSProperties;

const r1 = (v: number) => Math.round(v * 10) / 10;

/** A speech-like waveform: a carrier under an envelope of `bursts` syllable groups with short pauses between. */
export function wave(x0: number, x1: number, y: number, amp: number, bursts: number) {
  const n = Math.round((x1 - x0) / 1.5);
  let p = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const env = Math.max(0, Math.sin(t * Math.PI * bursts)) ** 0.7 * (0.55 + 0.45 * Math.sin(t * 17.3 + 1.1) ** 2) * Math.sin(t * Math.PI) ** 0.4;
    const v = Math.sin(t * (x1 - x0) * 0.42) * env;
    p += `${i ? "L" : "M"}${r1(x0 + t * (x1 - x0))} ${r1(y - v * amp)}`;
  }
  return p;
}
