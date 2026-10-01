"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  clamp, sstep, geometry, tangle, taut, wave, resample, morph, nearest,
  knowledgeAnchors, routeAnchors, framePath, busPath, busFraction, railPath,
  type Geo, type Rect,
} from "@/lib/line/engine";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";
import { REGIONS } from "@/content/regions";
import {
  COMPANY, PROCESS, PROCESS_PROMISE, ENGAGEMENT_MODELS, PRACTICES, PRACTICES_INTRO, CERTIFICATION_NOTE, TESTIMONIALS,
} from "@/content/company";
import { ContactForm } from "@/components/site/ContactForm";
import { DesignTFlow } from "./DesignTFlow";
import s from "./OneLine.module.css";

const WORDS = ["I", "need", "to", "see", "a", "doctor", "on", "Thursday", "morning."];
const DOCS = ["Agreement v1", "Agreement v2", "Scanned notice · OCR", "Case law · Indian Kanoon"];
const SIGNAL = "#F2461E";
const VELLUM = "#E6E9EA";
const FRAME_HEADER = 44;
/** Brand-flight curves: [c1x, c1y, c2x, c2y] as fractions of the travel, for the mark and the name. */
// Tuned against the copy at 1280, 1440 and 1920 wide: out along the band under the header, then a straight drop onto
// the shirt. The headline and nav are never crossed; the frame chrome is, lifted and in front, on the way down.
const FLY: number[][] = [[0.72, 0, 1.02, 0.04], [0.66, 0.05, 1, 0.08]];
const GATES = new Set(["Human Review Checkpoints", "Fallback Flows"]);

type Sec = { el: HTMLElement; top: number; height: number; p: number };
type Branch = { from: number; to: [number, number] };
/** One travelling part of the brand: where it starts and lands in viewport px, as translate (x, y) + uniform scale. */
type Leg = { el: HTMLElement | SVGElement; w: number; h: number; from: [number, number, number]; to: [number, number, number]; bend: number; gx?: number };

const pad = (n: number) => String(n).padStart(2, "0");

/** Rect of an element relative to its sticky stage, i.e. its viewport position while the stage is pinned. */
function stageRect(el: HTMLElement): Rect {
  const stage = el.closest<HTMLElement>("[data-stage]")!;
  const a = el.getBoundingClientRect(), b = stage.getBoundingClientRect();
  return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
}

export function OneLine() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current!;
    const canvas = host.querySelector<HTMLCanvasElement>("[data-line]")!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    // Phones held sideways (and other very short screens): the pinned scenes cannot fit, so the resolved still layout
    // is used, laid out on a 720px stage (CSS --vh, set by [data-short]).
    const short = matchMedia("(orientation: landscape) and (max-height: 500px)");
    const isStill = () => reduce.matches || short.matches;
    // One stable height for CSS and JS. On phones 100vh is the height with the browser toolbar hidden while innerHeight
    // is measured with it showing; scenes then sat under the toolbar and chapters unpinned before finishing. Both now use
    // the small viewport (svh, via CSS --vh), read back from a probe so the numbers match exactly.
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;left:0;top:0;width:0;height:calc(100 * var(--vh));visibility:hidden;pointer-events:none";
    probe.setAttribute("aria-hidden", "true");
    host.appendChild(probe);
    const viewH = () => (host.hasAttribute("data-short") ? 720 : probe.offsetHeight || innerHeight);
    const fine = matchMedia("(pointer: fine)");

    let g: Geo = geometry(innerWidth, innerHeight);
    let T = new Float32Array(0), TA = T, W1 = T, R = T, RO = T, WF = T, BUS = T, RAIL = T, TC = T, OUT = T;
    let docIdx: number[] = [];
    let docEls: HTMLElement[] = [];
    let cardEls: HTMLElement[] = [];
    let opsBranches: Branch[] = [];
    let mapBranches: Branch[] = [];
    let field = { top: 0, bottom: 0, left: 0, right: 0 };
    const secs: Record<string, Sec> = {};
    // The brand flight: header lockup -> DesignT shirt print, driven by the products chapter's own progress.
    const flight = host.querySelector<HTMLElement>("[data-flight]")!;
    const print = host.querySelector<SVGGElement>("[data-print]")!;
    const flowBody = host.querySelector<HTMLElement>("[data-body]");
    let legs: Leg[] = [];
    let brandEls: HTMLElement[] = [];
    let flightKey = "";
    let fromHeader = false;
    let dpr = 1;

    /* ---------------------------------------------------------- layout, once per resize */
    function measure() {
      g = geometry(innerWidth, viewH(), host.hasAttribute("data-short"));
      const n2 = g.n * 2;
      [T, TA, W1, R, RO, WF, BUS, RAIL, TC, OUT] = Array.from({ length: 10 }, () => new Float32Array(n2));
      tangle(g, T);
      taut(g, TA);
      wave(g, W1, 1, 9);
      const ka = knowledgeAnchors(g);
      resample(ka.path, g.n, R, true);
      const ra = routeAnchors(g);
      resample(ra.path, g.n, RO, false);
      opsBranches = ra.branches;
      resample(railPath(g), g.n, RAIL, false);

      // Knowledge: the DOM is placed from the same anchors the line is drawn through.
      docEls = [...host.querySelectorAll<HTMLElement>("[data-doc]")];
      docEls.forEach((el, i) => { el.style.left = `${ka.docs[i][0]}px`; el.style.top = `${ka.docs[i][1]}px`; });
      docIdx = ka.docs.map((d) => nearest(R, g.n, d));
      const ans = host.querySelector<HTMLElement>("[data-answer]")!;
      ans.style.left = `${ka.answer[0]}px`;
      ans.style.top = `${ka.answer[1]}px`;
      host.querySelectorAll<HTMLElement>("[data-branch]").forEach((el, i) => {
        el.style.left = `${ra.branches[i].to[0]}px`;
        el.style.top = `${ra.branches[i].to[1]}px`;
        // Landscape branches that grow upward end above the route: label above the node, clear of the line.
        el.toggleAttribute("data-up", !g.portrait && ra.branches[i].to[1] < g.h / 2);
      });
      let wx = 0.44 * g.w;
      host.querySelectorAll<HTMLElement>("[data-word]").forEach((el) => {
        if (g.portrait) { el.style.left = ""; el.style.top = ""; return; }
        const ww = el.offsetWidth;
        el.style.left = `${wx + ww / 2}px`;
        el.style.top = `${0.72 * g.h}px`;
        wx += ww + 0.45 * parseFloat(getComputedStyle(el).fontSize);
      });

      // Products and the map: the line is routed around whatever the CSS laid out.
      resample(framePath(g, stageRect(host.querySelector<HTMLElement>("[data-frame]")!), FRAME_HEADER), g.n, WF, false);
      cardEls = [...host.querySelectorAll<HTMLElement>("[data-card]")];
      const cards = cardEls.map(stageRect);
      const busAt = Math.min(...cards.map((c) => c.y)) - 36;
      resample(busPath(g, busAt), g.n, BUS, false);
      mapBranches = cards.map((c) => g.portrait
        ? { from: busFraction(g, c.y + 22), to: [c.x, c.y + 22] as [number, number] }
        : { from: busFraction(g, c.x + 14), to: [c.x + 14, c.y] as [number, number] });

      const ta = host.querySelector<HTMLElement>("[data-field] textarea");
      if (ta) {
        const r = ta.getBoundingClientRect();
        field = { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right };
      }

      measureFlight();

      host.querySelectorAll<HTMLElement>("[data-sec]").forEach((el) => {
        const r = el.getBoundingClientRect();
        secs[el.dataset.sec!] = { el, top: r.top + scrollY, height: r.height, p: -1 };
      });

      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(g.w * dpr);
      canvas.height = Math.round(g.h * dpr);
      canvas.style.width = `${g.w}px`;
      canvas.style.height = `${g.h}px`;
    }

    /* ---------------------------------------------------------- state */
    let targetY = scrollY, shownY = scrollY;
    const ptr = { tx: 0, ty: 0, x: 0, y: 0, on: 0, onT: 0 };
    let energy = 0; // typing in the contact field
    let raf: number | null = null;
    let last = 0;
    let drawnKey = "";

    /* ---------------------------------------------------------- the brand flight */
    // Every coordinate is measured at runtime. Source: the header lockup (sticky, so its viewport rect is fixed).
    // Destination: the print anchors inside the shirt SVG, read relative to the pinned stage (= viewport while pinned).
    function textBox(el: Element) {
      const r = document.createRange();
      r.selectNodeContents(el);
      return r.getBoundingClientRect();
    }
    function measureFlight() {
      legs = [];
      const hMark = document.querySelector<SVGElement>("[data-brand] svg");
      const hWord = document.querySelector<HTMLElement>("[data-brand-word]");
      brandEls = [hMark, hWord].filter(Boolean) as HTMLElement[];
      const anchor = host.querySelector<SVGGraphicsElement>("[data-print-anchor]")!;
      const pWord = host.querySelector<SVGTextElement>("[data-print-word]")!;
      const flowStage = host.querySelector<HTMLElement>("#dt-panel");
      flowStage?.setAttribute("data-measuring", ""); // measure the shirt as it sits in Design, whatever step is open
      const fMark = flight.querySelector<SVGElement>("[data-fly-mark]")!;
      const fWord = flight.querySelector<HTMLElement>("[data-fly-word]")!;
      fMark.style.transform = fWord.style.transform = "none";
      const stage = anchor.closest<HTMLElement>("[data-stage]")!.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const mBox = fMark.getBoundingClientRect();
      const pWordBox = pWord.getBoundingClientRect();
      flowStage?.removeAttribute("data-measuring");
      const toMark: [number, number, number] = [a.left - stage.left, a.top - stage.top, a.width / mBox.width];
      const headerShown = !!hMark && !!hWord && hMark.getBoundingClientRect().width > 0 && hWord.getBoundingClientRect().width > 0;
      fromHeader = headerShown;
      if (!headerShown) {
        // Fallback (no visible header lockup): a short drop onto the shirt inside the section.
        const k = 1.35;
        legs.push({ el: fMark, w: mBox.width, h: mBox.height, bend: 0, to: toMark,
          from: [toMark[0] - (mBox.width * toMark[2] * (k - 1)) / 2, toMark[1] - 56, toMark[2] * k] });
        fWord.style.display = "none";
      } else {
        // Desktop and phones alike: the header lockup itself lifts off and lands on the shirt as its print.
        fWord.style.display = "";
        const hm = hMark!.getBoundingClientRect();
        legs.push({ el: fMark, w: mBox.width, h: mBox.height, bend: -1, from: [hm.left, hm.top, hm.width / mBox.width], to: toMark });
        // The name lands by its text box: same face, weight and tracking at both ends, so a uniform scale maps one onto the other.
        const own = fWord.getBoundingClientRect(), ot = textBox(fWord);
        const dx = ot.left - own.left, dy = ot.top - own.top;
        const src = textBox(hWord!), dst = pWordBox;
        const s0 = src.width / ot.width, s1 = dst.width / ot.width;
        legs.push({ el: fWord, w: own.width, h: own.height, bend: 1,
          from: [src.left - dx * s0, src.top - dy * s0, s0],
          to: [dst.left - stage.left - dx * s1, dst.top - stage.top - dy * s1, s1] });
        if (g.portrait) {
          // Phones have no room beside the headline: travel down the left gutter (the line's lane), mark and name side by side.
          legs[0].gx = 2;
          legs[1].gx = 2 + mBox.width * toMark[2] * 0.85 + 2 - dx * s1 * 0.85;
        }
      }
      flightKey = "";
    }

    function flyFrame(pp: number) {
      if (!legs.length) return;
      // Lift 0-.2, travel .2-.6, recompose .6-.85, settle .85-1 of t, over pp .60-.92 of the pinned chapter (all screens).
      const t = fromHeader ? clamp((pp - 0.6) / 0.32) : clamp((pp - 0.78) / 0.14);
      const key = t.toFixed(4) + (fromHeader ? "h" : "d") + (t >= 1 ? pp.toFixed(4) : "");
      if (key === flightKey) return;
      flightKey = key;
      const on = t > 0 && t < 1;
      flight.toggleAttribute("data-on", on);
      // The flight lands on the Design state: back in its range, the order-flow demo restarts from Design.
      if (t < 1 && flowBody && flowBody.dataset.step !== "0") flowBody.dispatchEvent(new Event("designt:reset"));
      // Hand-off masking only: the clone and the print are pixel-aligned at t = 1, so this is a 4% crossfade, not the transition.
      const handoff = sstep(0.96, 1, t);
      print.style.opacity = String(t <= 0 ? 0 : handoff);
      flight.style.opacity = String(1 - handoff);
      if (fromHeader) {
        const back = t <= 0 ? 1 : t < 1 ? 0 : sstep(0.92, 0.98, pp);
        brandEls.forEach((el) => (el.style.opacity = back === 1 ? "" : String(back)));
      }
      if (!on) return;
      const lift = sstep(0, 0.2, t), u = sstep(0.2, 0.85, t), land = sstep(0.85, 1, t);
      const depth = lift * (1 - land);
      for (const L of legs) {
        const [x0, y0, s0] = L.from, [x1, y1, s1] = L.to;
        // Curved path (cubic): control points as fractions of the travel (dx, dy); the two parts use slightly different
        // curves, so they bow apart in flight and recombine as the stacked print.
        const dx = x1 - x0, dy = y1 - y0;
        const k = FLY[L.bend < 0 ? 0 : 1];
        const ax = x0 + dx * k[0], ay = y0 + dy * k[1], bx = x0 + dx * k[2], by = y0 + dy * k[3];
        const v = 1 - u;
        const cub = (a: number, b: number, c: number, d: number) => v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
        let x: number, y: number, sc: number;
        if (L.gx !== undefined) {
          // Phones: an orthogonal route with blended corners. Shrink to print size and slide into the left gutter
          // (the line's lane), descend it side by side (slightly reduced so both fit), then slide across into the shirt.
          const a = sstep(0.12, 0.34, t), d = sstep(0.28, 0.8, t), c = sstep(0.74, 0.96, t);
          x = x0 + (L.gx - x0) * a + (x1 - L.gx) * c;
          y = y0 + dy * d - 8 * lift * (1 - d);
          sc = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * sstep(0, 0.3, t)) * (1 - 0.15 * a * (1 - c)) * (1 + 0.06 * depth);
        } else {
          x = cub(x0, ax, bx, x1);
          y = cub(y0, ay, by, y1) - 8 * lift * (1 - u) + L.bend * 16 * Math.sin(Math.PI * u); // mark rides above, name below
          sc = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u) * (1 + 0.06 * depth);
        }
        const rz = (L.bend || -1) * 4 * Math.sin(Math.PI * u);
        const rx = 16 * depth * (1 - u * 0.4);
        L.el.style.transform =
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${sc.toFixed(4)}) ` +
          `translate(${L.w / 2}px, ${L.h / 2}px) perspective(500px) rotateX(${rx.toFixed(2)}deg) rotate(${rz.toFixed(2)}deg) translate(${-L.w / 2}px, ${-L.h / 2}px)`;
        L.el.style.filter = depth > 0.01
          ? `drop-shadow(0 ${(10 * depth).toFixed(1)}px ${(14 * depth).toFixed(1)}px rgba(22, 25, 29, ${(0.22 * depth).toFixed(3)}))` : "";
      }
    }

    const progress = (sec: Sec, y: number) => clamp((y - sec.top) / Math.max(1, sec.height - g.h));
    const idx = (f: number) => Math.round(clamp(f) * (g.n - 1));

    function setP(sec: Sec, p: number) {
      // Delta-gated: only touch the DOM when the value moved enough to matter (ends always land).
      if (sec.p === p || (Math.abs(sec.p - p) < 0.002 && p > 0 && p < 1)) return;
      sec.p = p;
      sec.el.style.setProperty("--p", p.toFixed(4));
    }

    function lightAll(els: HTMLElement[], test: (i: number) => boolean) {
      els.forEach((el, i) => {
        const lit = test(i);
        if ((el.dataset.lit === "1") !== lit) el.dataset.lit = lit ? "1" : "0";
      });
    }

    function frame(y: number, now: number) {
      const { hero, voice, knowledge, ops, products, map } = secs;
      const ph = progress(hero, y), pv = progress(voice, y), pk = progress(knowledge, y), po = progress(ops, y);
      const pp = progress(products, y), pm = progress(map, y);
      setP(hero, ph); setP(voice, pv); setP(knowledge, pk); setP(ops, po); setP(products, pp); setP(map, pm);
      flyFrame(pp);

      let branches: Branch[] = [];
      let grow = 0;
      let pulse = -1;
      if (y < voice.top) {
        // Hero: the tangle (leaning toward the cursor) pulls taut.
        const m = sstep(0.12, 0.72, ph);
        TC.set(T);
        const strength = ptr.on * (1 - m);
        if (strength > 0.001) {
          const Rr = Math.min(g.w, g.h) * 0.26;
          for (let i = 0; i < g.n; i++) {
            const dx = ptr.x - TC[i * 2], dy = ptr.y - TC[i * 2 + 1];
            const d = Math.hypot(dx, dy);
            if (d < Rr) {
              const f = (1 - d / Rr) ** 2 * 0.42 * strength;
              TC[i * 2] += dx * f;
              TC[i * 2 + 1] += dy * f;
            }
          }
        }
        morph(TC, TA, m, g.n, OUT);
      } else if (y < knowledge.top) {
        // Voice: the taut line starts to speak.
        wave(g, OUT, sstep(0, 0.3, pv), pv * 9);
      } else if (y < ops.top) {
        // Knowledge: speech flattens into a path that threads the documents.
        morph(W1, R, sstep(0, 0.36, pk), g.n, OUT);
        pulse = pk > 0.36 ? idx(sstep(0.38, 0.92, pk)) : -1;
      } else if (y < products.top) {
        // Operations: the path squares up into routes, branches grow, then one signal runs the whole route.
        morph(R, RO, sstep(0, 0.3, po), g.n, OUT);
        branches = opsBranches;
        grow = sstep(0.32, 0.62, po);
        pulse = po > 0.66 ? idx(sstep(0.66, 0.96, po)) : -1;
      } else if (y < map.top) {
        // Products: branches fold back in, the route squares up into a screen.
        morph(RO, WF, sstep(0.14, 0.5, pp), g.n, OUT);
        branches = opsBranches;
        grow = 1 - sstep(0, 0.14, pp);
      } else if (pm < 1) {
        // Map: the screen collapses into one channel; every region hangs from it; then it stands up as the rail.
        const toRail = sstep(0.82, 1, pm);
        if (toRail > 0) morph(BUS, RAIL, toRail, g.n, OUT);
        else morph(WF, BUS, sstep(0, 0.28, pm), g.n, OUT);
        branches = mapBranches;
        grow = sstep(0.26, 0.48, pm) * (1 - sstep(0.72, 0.82, pm));
        pulse = pm > 0.48 && pm < 0.8 ? idx(sstep(0.48, 0.78, pm)) : -1;
      } else {
        // Normal flow: the rail, bending at the end to run under the contact field.
        const fy = field.bottom + 4 - y;
        resample(railPath(g, { y: fy, x2: field.right }), g.n, OUT, false);
        if (energy > 0.002 && fy < g.h) {
          for (let i = 0; i < g.n; i++) {
            const x = OUT[i * 2];
            if (Math.abs(OUT[i * 2 + 1] - fy) > 0.5 || x < field.left) continue;
            const env = sstep(field.left, field.left + 60, x) * (1 - sstep(field.right - 60, field.right, x));
            OUT[i * 2 + 1] += Math.sin(x * 0.075 - now * 0.011) * 9 * energy * env;
          }
        }
      }

      lightAll(docEls, (i) => pulse >= docIdx[i] && y < ops.top ? true : y >= ops.top);
      lightAll(cardEls, (i) => (y >= map.top && pm >= 0.48 && (pm >= 0.8 || pulse >= idx(mapBranches[i]?.from ?? 1))));
      draw(pulse, grow, branches);
    }

    function draw(pulse: number, grow: number, branches: Branch[]) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, g.w, g.h);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = SIGNAL;
      ctx.lineWidth = g.portrait ? 2 : 2.4;
      ctx.beginPath();
      ctx.moveTo(OUT[0], OUT[1]);
      for (let i = 1; i < g.n; i++) ctx.lineTo(OUT[i * 2], OUT[i * 2 + 1]);
      ctx.stroke();

      if (grow > 0) {
        ctx.lineWidth = 1.6;
        for (const b of branches) {
          const i = idx(b.from);
          const x0 = OUT[i * 2], y0 = OUT[i * 2 + 1];
          const x1 = x0 + (b.to[0] - x0) * grow, y1 = y0 + (b.to[1] - y0) * grow;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          if (g.portrait) { ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); } else { ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); }
          ctx.stroke();
          if (grow > 0.98) {
            ctx.fillStyle = VELLUM;
            ctx.beginPath(); ctx.arc(b.to[0], b.to[1], 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          }
        }
      }

      if (pulse >= 0) {
        // The signal: a short brighter run of the line with a head, travelling forward.
        const from = Math.max(0, pulse - 28);
        ctx.lineWidth = g.portrait ? 4 : 5;
        ctx.beginPath();
        ctx.moveTo(OUT[from * 2], OUT[from * 2 + 1]);
        for (let i = from + 1; i <= pulse; i++) ctx.lineTo(OUT[i * 2], OUT[i * 2 + 1]);
        ctx.stroke();
        ctx.fillStyle = SIGNAL;
        ctx.beginPath(); ctx.arc(OUT[pulse * 2], OUT[pulse * 2 + 1], 6, 0, Math.PI * 2); ctx.fill();
      }
    }

    /* ---------------------------------------------------------- the loop that rests */
    function tick(now: number) {
      const dt = Math.min(100, now - (last || now));
      last = now;
      const k = 1 - Math.pow(1 - 0.14, dt / 16.667);
      shownY += (targetY - shownY) * k;
      ptr.x += (ptr.tx - ptr.x) * k;
      ptr.y += (ptr.ty - ptr.y) * k;
      ptr.on += (ptr.onT - ptr.on) * k;
      energy *= Math.pow(0.25, dt / 1000);
      const settled = Math.abs(targetY - shownY) < 0.3 && Math.abs(ptr.tx - ptr.x) < 0.3 && Math.abs(ptr.ty - ptr.y) < 0.3
        && Math.abs(ptr.onT - ptr.on) < 0.002 && energy < 0.002;
      if (settled) { shownY = targetY; ptr.x = ptr.tx; ptr.y = ptr.ty; ptr.on = ptr.onT; energy = 0; }
      const key = `${shownY.toFixed(1)}|${ptr.x.toFixed(1)}|${ptr.y.toFixed(1)}|${ptr.on.toFixed(3)}|${energy > 0 ? now : 0}`;
      if (key !== drawnKey) { drawnKey = key; frame(shownY, now); }
      if (settled) { raf = null; last = 0; } else raf = requestAnimationFrame(tick);
    }
    const wake = () => { if (raf === null) raf = requestAnimationFrame(tick); };
    const onScroll = () => { targetY = scrollY; wake(); };
    const onPointer = (e: PointerEvent) => {
      if (!fine.matches || scrollY > secs.hero.top + secs.hero.height) return;
      ptr.tx = e.clientX; ptr.ty = e.clientY; ptr.onT = 1; wake();
    };
    const onLeave = () => { ptr.onT = 0; wake(); };
    // Keyboard focus can land on a control whose chapter hasn't revealed it yet (opacity from --p). Jump that chapter
    // to the point where the control is fully shown, so focus is never on something invisible.
    const SHOWN: Record<string, number> = { products: 1, map: 0.6 };
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      const secEl = el?.closest<HTMLElement>("[data-sec]");
      if (!el || !secEl || isStill()) return;
      let o = 1;
      for (let x: HTMLElement | null = el; x && x !== secEl; x = x.parentElement) o *= +getComputedStyle(x).opacity;
      if (o > 0.5) return;
      const sec = secs[secEl.dataset.sec!];
      scrollTo(0, sec.top + (SHOWN[secEl.dataset.sec!] ?? 1) * (sec.height - g.h));
      targetY = shownY = scrollY;
      drawnKey = "";
      frame(shownY, performance.now());
    };
    const onType = (e: Event) => {
      if (!(e.target instanceof HTMLTextAreaElement)) return;
      energy = Math.min(1, energy + 0.35);
      wake();
    };

    /* ---------------------------------------------------------- reduced motion: static stills */
    function stroke(x: CanvasRenderingContext2D, buf: Float32Array, n: number) {
      x.beginPath(); x.moveTo(buf[0], buf[1]);
      for (let i = 1; i < n; i++) x.lineTo(buf[i * 2], buf[i * 2 + 1]);
      x.stroke();
    }
    function drawStills() {
      host.querySelectorAll<HTMLCanvasElement>("[data-still]").forEach((c) => {
        const which = c.dataset.still!;
        const stage = c.parentElement!;
        const sg = geometry(stage.clientWidth, stage.clientHeight, host.hasAttribute("data-short"));
        const buf = new Float32Array(sg.n * 2);
        let extra: Branch[] = [];
        if (which === "hero") taut(sg, buf);
        if (which === "voice") wave(sg, buf, 1, 9);
        if (which === "knowledge") resample(knowledgeAnchors(sg).path, sg.n, buf, true);
        if (which === "ops") { resample(routeAnchors(sg).path, sg.n, buf, false); extra = routeAnchors(sg).branches; }
        if (which === "products") resample(framePath(sg, stageRect(stage.querySelector<HTMLElement>("[data-frame]")!), FRAME_HEADER), sg.n, buf, false);
        if (which === "map") {
          const cards = [...stage.querySelectorAll<HTMLElement>("[data-card]")].map(stageRect);
          resample(busPath(sg, Math.min(...cards.map((q) => q.y)) - 36), sg.n, buf, false);
          extra = cards.map((q) => sg.portrait
            ? { from: busFraction(sg, q.y + 22), to: [q.x, q.y + 22] as [number, number] }
            : { from: busFraction(sg, q.x + 14), to: [q.x + 14, q.y] as [number, number] });
        }
        const r = Math.min(devicePixelRatio || 1, 2);
        c.width = sg.w * r; c.height = sg.h * r;
        const x = c.getContext("2d")!;
        x.setTransform(r, 0, 0, r, 0, 0);
        x.strokeStyle = SIGNAL; x.lineWidth = 2.2; x.lineJoin = "round";
        stroke(x, buf, sg.n);
        x.lineWidth = 1.4;
        for (const b of extra) {
          const i = Math.round(b.from * (sg.n - 1));
          x.beginPath(); x.moveTo(buf[i * 2], buf[i * 2 + 1]);
          if (sg.portrait) x.lineTo(b.to[0], buf[i * 2 + 1]); else x.lineTo(buf[i * 2], b.to[1]);
          x.lineTo(b.to[0], b.to[1]); x.stroke();
        }
      });
    }

    function resetFlight() {
      flight.removeAttribute("data-on");
      print.style.opacity = "";
      brandEls.forEach((el) => (el.style.opacity = ""));
    }

    function applyMode() {
      const still = isStill();
      host.toggleAttribute("data-short", short.matches);
      host.dataset.mode = still ? "still" : "live";
      measure();
      if (still) {
        removeEventListener("scroll", onScroll);
        if (raf !== null) cancelAnimationFrame(raf);
        raf = null;
        host.querySelectorAll<HTMLElement>("[data-sec]").forEach((el) => el.style.setProperty("--p", "1"));
        [...docEls, ...cardEls].forEach((el) => (el.dataset.lit = "1"));
        resetFlight();
        drawStills();
      } else {
        addEventListener("scroll", onScroll, { passive: true });
        targetY = shownY = scrollY;
        drawnKey = "";
        Object.values(secs).forEach((x) => (x.p = -1));
        frame(shownY, performance.now());
      }
    }

    const ro = new ResizeObserver(() => {
      measure();
      drawnKey = "";
      if (isStill()) drawStills(); else frame(shownY, performance.now());
    });
    ro.observe(document.documentElement);
    addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    host.addEventListener("input", onType);
    host.addEventListener("focusin", onFocus);
    reduce.addEventListener("change", applyMode);
    short.addEventListener("change", applyMode);
    document.fonts?.ready.then(() => { drawnKey = ""; applyMode(); });
    applyMode();

    return () => {
      ro.disconnect();
      probe.remove();
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("input", onType);
      host.removeEventListener("focusin", onFocus);
      reduce.removeEventListener("change", applyMode);
      short.removeEventListener("change", applyMode);
      if (raf !== null) cancelAnimationFrame(raf);
      resetFlight();
    };
  }, []);

  const designt = PROJECTS.find((p) => p.slug === "designt")!;
  const testimonial = TESTIMONIALS[0];

  return (
    <div ref={root} className={s.root} data-mode="live">
      <canvas data-line className={s.line} aria-hidden="true" />
      {/* The brand's travelling copy (visual only): the header logo itself never moves. */}
      <div data-flight className={s.flight} aria-hidden="true">
        <svg data-fly-mark viewBox="0 0 32 32" className={s.flyMark}>
          <path d="M14.41 11.55A6.2 6.2 0 1 0 9.8 21.9H30" fill="none" stroke="#f2461e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span data-fly-word className={s.flyWord}>Tech Cogniverse</span>
      </div>

      {/* 00 · Hero: the statement is readable at once; the tangle runs between two type layers. */}
      <section data-sec="hero" className={`${s.sec} ${s.hero}`} aria-labelledby="h-title">
        <div className={`${s.stage} ${s.back}`} aria-hidden="true">
          <span className={s.giant}>complexity</span>
        </div>
        <div data-stage className={`${s.stage} ${s.front}`}>
          <canvas data-still="hero" className={s.still} aria-hidden="true" />
          <p className={s.kicker}>Custom AI &amp; software development · Chennai</p>
          <h1 id="h-title" className={s.h1}>
            We turn business complexity into <em>AI systems that work.</em>
          </h1>
          <p className={s.facts}>Live in 45 days · Fixed price · A demo every Friday</p>
          <p className={s.actions}>
            <a className={s.cta} href="#friction">Start a project</a>
            <a className={s.link} href="#work">See our work</a>
          </p>
          <p className={s.next} aria-hidden="true">01 · Voice AI</p>
        </div>
      </section>

      {/* 01 · Voice */}
      <section id="voice" data-sec="voice" className={`${s.sec} ${s.voice}`} aria-labelledby="v-title">
        <div data-stage className={s.stage}>
          <canvas data-still="voice" className={s.still} aria-hidden="true" />
          <div className={s.copy}>
            <p className={s.marker}>01 · Voice AI</p>
            <h2 id="v-title" className={s.h2}>A conversation ends. Nothing usable is left behind.</h2>
            <p className={s.body}>We build voice systems that listen live, turn speech into structure, and act on it, with a person reviewing anything consequential.</p>
          </div>
          <div className={s.transcript}>
            <p className={s.words}>
              <span className="sr-only">Sample call: I need to see a doctor on Thursday morning.</span>
              {WORDS.map((w, i) => (
                <span key={i} data-word className={s.word} style={{ ["--i" as string]: i }} aria-hidden="true">{w}</span>
              ))}
            </p>
            <dl className={s.fields}>
              <div><dt>intent</dt><dd>consultation</dd></div>
              <div><dt>day</dt><dd>Thursday</dd></div>
              <div><dt>slot</dt><dd>morning</dd></div>
            </dl>
            <p className={s.action}>Appointment booked · calendar synced</p>
            <p className={s.gate}>Prescription draft · waits for doctor review</p>
          </div>
          <p className={s.caption}>Illustration of MediConsult’s voice layer, sample call.</p>
        </div>
      </section>

      {/* 02 · Knowledge */}
      <section data-sec="knowledge" className={`${s.sec} ${s.knowledge}`} aria-labelledby="k-title">
        <div data-stage className={s.stage}>
          <canvas data-still="knowledge" className={s.still} aria-hidden="true" />
          <div className={s.copy}>
            <p className={s.marker}>02 · RAG &amp; AI agents</p>
            <h2 id="k-title" className={s.h2}>The answer is in there. Somewhere.</h2>
            <p className={`${s.body} ${s.wideOnly}`}>We build retrieval systems that ground AI answers in your own documents and data.</p>
          </div>
          {DOCS.map((d, i) => (
            <article key={d} data-doc data-lit="0" className={s.doc} style={{ ["--i" as string]: i }}>
              <span className={s.docTitle}>{d}</span>
              <span className={s.docLines} aria-hidden="true" />
            </article>
          ))}
          <div data-answer className={s.answer}>
            <p className={s.answerTitle}>Answer · 2 citations</p>
            <p className={s.answerGate}>Reviewed before use</p>
          </div>
          <p className={s.caption}>Illustration of Legal Assistant’s document flow: four agent crews, Indian Kanoon case law.</p>
        </div>
      </section>

      {/* 03 · Operations */}
      <section data-sec="ops" className={`${s.sec} ${s.ops}`} aria-labelledby="o-title">
        <div data-stage className={s.stage}>
          <canvas data-still="ops" className={s.still} aria-hidden="true" />
          <div className={s.copy}>
            <p className={s.marker}>03 · Business software</p>
            <h2 id="o-title" className={s.h2}>Seven branches. Seven versions of the truth.</h2>
            <p className={s.body}>We put billing, stock, staff and customers on one system, so every branch reads from the same record.</p>
            <dl className={s.metrics}>
              <div><dt>Branches</dt><dd>7</dd></div>
              <div><dt>Customers</dt><dd>600+</dd></div>
              <div><dt>Transaction records</dt><dd>1,000+</dd></div>
            </dl>
          </div>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} data-branch className={s.branch} style={{ ["--i" as string]: i }}>Branch {i + 1}</span>
          ))}
          <p className={s.caption}>Illustration of the Saloon Management System, in production for Priya Natural Care.</p>
        </div>
      </section>

      {/* 04 · Products */}
      <section data-sec="products" className={`${s.sec} ${s.products}`} aria-labelledby="p-title">
        <div data-stage className={s.stage}>
          <canvas data-still="products" className={s.still} aria-hidden="true" />
          <div className={s.copy}>
            <p className={s.marker}>04 · AI MVPs</p>
            <h2 id="p-title" className={s.h2}>The idea is clear. The product doesn’t exist yet.</h2>
            <p className={`${s.body} ${s.wideOnly}`}>We ship a working, deployed product in a fixed 45-day scope: auth, payments, deployment and one or two AI features.</p>
          </div>
          <div data-frame className={s.frame}>
            <p className={s.frameBar}>{designt.name} · order flow</p>
            <DesignTFlow />
          </div>
          <p className={s.caption}>Illustration of DesignT, a Tech Cogniverse build: a prompt becomes artwork, then a four-step checkout.</p>
        </div>
      </section>

      {/* 05 · The map: every shape the line made becomes one region of one system. */}
      <section id="system" data-sec="map" className={`${s.sec} ${s.map}`} aria-labelledby="m-title">
        <div data-stage className={s.stage}>
          <canvas data-still="map" className={s.still} aria-hidden="true" />
          <div className={s.copy}>
            <p className={s.marker}>05 · What we build</p>
            <h2 id="m-title" className={s.h2}>Four kinds of system. We design, build and run all four.</h2>
          </div>
          <ol className={s.cards}>
            {REGIONS.map((r, i) => (
              <li key={r.id} data-card data-lit="0" className={s.card} style={{ ["--i" as string]: i }}>
                <p className={s.cardNum}>{pad(i + 1)} · {r.name}</p>
                <p className={s.cardGrammar}>{r.grammar.join(" → ")}</p>
                <ul>
                  {r.serviceSlugs.map((slug) => {
                    const svc = SERVICES.find((x) => x.slug === slug)!;
                    return <li key={slug}><Link href={`/services/${slug}`}>{svc.shortName}</Link></li>;
                  })}
                </ul>
                <p className={s.cardCount}>{PROJECTS.filter((p) => p.region === r.id).length} builds in this region</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* From here the line is a rail down the left edge; the page returns to normal reading flow. */}
      <div className={s.flow}>
        <section id="work" className={s.band} aria-labelledby="w-title">
          <header className={s.bandHead}>
            <p className={s.marker}>06 · Work</p>
            <h2 id="w-title" className={s.h2}>{PROJECTS.length} systems we’ve built.</h2>
            <p className={s.body}>Every one is named with its real status. Nothing here is a concept shot.</p>
          </header>
          <ol className={s.rows}>
            {PROJECTS.map((p, i) => (
              <li key={p.slug} className={s.row}>
                <Link href={`/work/${p.slug}`}>
                  <span className={s.rowNum}>{pad(i + 1)}</span>
                  <span className={s.rowName}>{p.name}</span>
                  <span className={s.rowMeta}>{p.category}</span>
                  <span className={`status ${s.rowStatus}`} data-state={p.status === "In Progress" ? "progress" : p.status === "Production" || p.status === "Launched" ? "live" : undefined}>{p.status}</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link href="/work" className="link-arrow">All work, filterable</Link>
        </section>

        <section id="process" className={s.band} aria-labelledby="pr-title">
          <header className={s.bandHead}>
            <p className={s.marker}>07 · How we work</p>
            <h2 id="pr-title" className={s.h2}>Forty-five days, in the open.</h2>
            <p className={s.body}>{PROCESS_PROMISE}</p>
          </header>
          <ol className={s.steps}>
            {PROCESS.map((p) => (
              <li key={p.step} className={s.step} data-step={p.title.toLowerCase()}>
                <p className={s.stepNum}>{p.step}{p.title === "Launch" ? " · day 45" : ""}</p>
                <h3 className={s.h3}>{p.title}</h3>
                <p className={s.stepBody}>{p.description}</p>
                {p.title === "Build" && (
                  <p className={s.fridays} aria-label="A demo every Friday">
                    {Array.from({ length: 6 }, (_, i) => <span key={i}>Fri</span>)}
                  </p>
                )}
              </li>
            ))}
          </ol>
          <ul className={s.models}>
            {ENGAGEMENT_MODELS.map((m) => (
              <li key={m.name}>
                <p className={s.modelName}>{m.name}</p>
                <p className={s.modelMeta}>{m.duration} · {m.priceINR} · {m.priceUSD}</p>
              </li>
            ))}
          </ul>
          <Link href="/process" className="link-arrow">The full process and practices</Link>
        </section>

        <section id="trust" className={s.band} aria-labelledby="t-title">
          <header className={s.bandHead}>
            <p className={s.marker}>08 · Trust</p>
            <h2 id="t-title" className={s.h2}>Ten checkpoints on every build.</h2>
            <p className={s.body}>{PRACTICES_INTRO}</p>
          </header>
          <ol className={s.practices}>
            {PRACTICES.map((p) => (
              <li key={p.title} className={s.practice} data-gate={GATES.has(p.title) || undefined}>
                <h3 className={s.practiceTitle}>{p.title}</h3>
                <p>{p.description}</p>
              </li>
            ))}
          </ol>
          <p className={s.note}>{CERTIFICATION_NOTE}</p>
          <figure className={s.quote}>
            <blockquote>“{testimonial.quote}”</blockquote>
            <figcaption>{testimonial.name} · {testimonial.role} · {testimonial.project}</figcaption>
          </figure>
        </section>

        <section id="friction" className={`${s.band} ${s.contact}`} aria-labelledby="c-title">
          <header className={s.bandHead}>
            <p className={s.marker}>09 · Start a project</p>
            <h2 id="c-title" className={s.h2}>Every system here started as a tangle. Describe yours.</h2>
            <p className={s.body}>
              {COMPANY.responseTime}. Or write to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, or call{" "}
              <a href={`tel:${COMPANY.phone.tel}`}>{COMPANY.phone.display}</a>.
            </p>
          </header>
          <div data-field className={s.form}>
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
