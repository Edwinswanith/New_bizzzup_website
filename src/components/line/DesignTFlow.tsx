"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import s from "./OneLine.module.css";
import f from "./DesignTFlow.module.css";

/* The DesignT order flow inside the products chapter. One shirt persists through all four steps: each step moves and
   scales the same element, and every choice made in Customize is carried by it into Details and Payment.
   This is an illustration (see the chapter caption): nothing is collected, priced or charged here. */

const STEPS = ["Design", "Customize", "Details", "Payment"];
const COLOURS = [
  { id: "light", label: "Light", shirt: "#f4f5f5", mark: "#f2461e", name: "#16191d" },
  { id: "graphite", label: "Graphite", shirt: "#2b3036", mark: "#f2461e", name: "#f4f5f5" },
  { id: "vermilion", label: "Vermilion", shirt: "#f2461e", mark: "#16191d", name: "#f4f5f5" },
] as const;
const PLACES = [{ id: "chest", label: "Chest" }, { id: "full", label: "Full front" }] as const;
const SIZES = ["S", "M", "L", "XL"] as const;
const DEFAULT = { colour: 0, place: 0, size: 1, qty: 1 };
const TEE = "M40 8 L16 20 L4 44 L22 52 L28 40 L28 104 L92 104 L92 40 L98 52 L116 44 L104 20 L80 8 C76 18 44 18 40 8 Z";
const PROMPT = "The Tech Cogniverse logo, chest print, two colours";
const pad = (n: number) => String(n).padStart(2, "0");

export function DesignTFlow() {
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState(DEFAULT);
  const body = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // The logo flight lands on the Design state: when the visitor scrolls back into it, the demo restarts.
  useEffect(() => {
    const el = body.current!;
    const reset = () => { setStep(0); setCfg(DEFAULT); };
    el.addEventListener("designt:reset", reset);
    return () => el.removeEventListener("designt:reset", reset);
  }, []);

  const go = (i: number, focus = false) => {
    const n = (i + STEPS.length) % STEPS.length;
    setStep(n);
    if (focus) tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const k = { ArrowRight: step + 1, ArrowLeft: step - 1, Home: 0, End: STEPS.length - 1 }[e.key];
    if (k === undefined) return;
    e.preventDefault();
    go(k, true);
  };

  const c = COLOURS[cfg.colour];
  const summary = [
    ["Design", "Tech Cogniverse logo"],
    ["Colour", c.label],
    ["Print", PLACES[cfg.place].label],
    ["Size", SIZES[cfg.size]],
    ["Quantity", String(cfg.qty)],
  ];
  const view = (i: number) => ({ "data-active": step === i || undefined, "aria-hidden": step !== i || undefined, inert: step !== i || undefined });

  return (
    <>
      <ol className={s.frameSteps} role="tablist" aria-label="DesignT order flow">
        {STEPS.map((t, i) => (
          <li key={t} role="presentation" style={{ ["--i" as string]: i }} data-active={step === i || undefined} data-done={i < step || undefined}>
            <button
              ref={(el) => { tabs.current[i] = el; }}
              type="button" role="tab" id={`dt-tab-${i}`} aria-selected={step === i} aria-controls="dt-panel"
              tabIndex={step === i ? 0 : -1} onClick={() => go(i)} onKeyDown={onKey}
            >
              <span aria-hidden="true">{i < step ? "✓" : pad(i + 1)}</span>{t}
            </button>
          </li>
        ))}
      </ol>

      <div ref={body} className={s.frameBody} data-body data-step={step}>
        <p className={`${s.framePrompt} ${f.prompt}`}>“{PROMPT}”</p>

        <div className={f.stage} data-step={step} id="dt-panel" role="tabpanel" aria-labelledby={`dt-tab-${step}`}>
          {/* The persistent product. */}
          <div className={`${s.frameTee} ${f.tee}`} data-tee aria-hidden="true"
            style={{ ["--shirt" as string]: c.shirt, ["--mark" as string]: c.mark, ["--name" as string]: c.name }}>
            <svg viewBox="0 0 120 110">
              <path className={f.ghost} data-on={cfg.qty > 2 || undefined} d={TEE} transform="translate(10 -6)" />
              <path className={f.ghost} data-on={cfg.qty > 1 || undefined} d={TEE} transform="translate(5 -3)" />
              <path className={f.shirt} d={TEE} strokeWidth="1.5" strokeLinejoin="round" />
              {/* The print: the site mark (same path as components/site/Mark) over the wordmark. */}
              <g data-print>
                <g className={f.place} data-place={PLACES[cfg.place].id}>
                  <rect data-print-anchor x="43.2" y="37.3" width="32" height="32" fill="none" />
                  <path className={f.mark} transform="translate(43.2 37.3)" d="M14.41 11.55A6.2 6.2 0 1 0 9.8 21.9H30" fill="none" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                  <text data-print-word className={s.teeName} x="60" y="75" textAnchor="middle">Tech Cogniverse</text>
                </g>
              </g>
            </svg>
            <span className={f.sizeTag}>{SIZES[cfg.size]}</span>
          </div>

          {/* 01 · Design: the generated artwork, as before. */}
          <div className={`${f.view} ${f.side}`} {...view(0)}>
            <span className={`${s.frameRows} ${f.rows}`} />
          </div>

          {/* 02 · Customize: a few strong controls, each reflected on the shirt at once. */}
          <div className={`${f.view} ${f.side} ${f.controls}`} {...view(1)}>
            <div role="group" aria-label="Colour" className={f.ctl} style={{ ["--k" as string]: 0 }}>
              <span className={f.lab}>Colour</span>
              <div className={f.opts}>
                {COLOURS.map((o, i) => (
                  <button key={o.id} type="button" className={f.swatch} aria-pressed={cfg.colour === i} aria-label={o.label}
                    style={{ ["--sw" as string]: o.shirt }} onClick={() => setCfg({ ...cfg, colour: i })} />
                ))}
              </div>
            </div>
            <div role="group" aria-label="Print" className={f.ctl} style={{ ["--k" as string]: 1 }}>
              <span className={f.lab}>Print</span>
              <div className={f.opts}>
                {PLACES.map((o, i) => (
                  <button key={o.id} type="button" className={f.chip} aria-pressed={cfg.place === i} onClick={() => setCfg({ ...cfg, place: i })}>{o.label}</button>
                ))}
              </div>
            </div>
            <div role="group" aria-label="Size" className={f.ctl} style={{ ["--k" as string]: 2 }}>
              <span className={f.lab}>Size</span>
              <div className={f.opts}>
                {SIZES.map((o, i) => (
                  <button key={o} type="button" className={`${f.chip} ${f.square}`} aria-pressed={cfg.size === i} onClick={() => setCfg({ ...cfg, size: i })}>{o}</button>
                ))}
              </div>
            </div>
            <div role="group" aria-label="Quantity" className={f.ctl} style={{ ["--k" as string]: 3 }}>
              <span className={f.lab}>Quantity</span>
              <div className={f.opts}>
                <button type="button" className={`${f.chip} ${f.square}`} aria-label="Fewer" disabled={cfg.qty <= 1} onClick={() => setCfg({ ...cfg, qty: cfg.qty - 1 })}>−</button>
                <output className={f.qty} aria-live="polite">{cfg.qty}</output>
                <button type="button" className={`${f.chip} ${f.square}`} aria-label="More" disabled={cfg.qty >= 9} onClick={() => setCfg({ ...cfg, qty: cfg.qty + 1 })}>+</button>
              </div>
            </div>
          </div>

          {/* 03 · Details: the shirt becomes a thumbnail; the choices assemble as rows; then who it goes to. */}
          <div className={`${f.view} ${f.details}`} {...view(2)}>
            <dl className={f.summary}>
              {summary.map(([k, v], i) => (
                <div key={k} style={{ ["--k" as string]: i }}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <div className={f.deliver}>
              <p className={f.head}>Deliver to</p>
              {["Name", "Phone", "Address"].map((k, i) => (
                <p key={k} className={f.field} style={{ ["--k" as string]: i + 2 }}><span>{k}</span></p>
              ))}
            </div>
          </div>

          {/* 04 · Payment: the product resolves into one order line. A demonstration: no prices exist here, none are taken. */}
          <div className={`${f.view} ${f.pay}`} {...view(3)}>
            <div className={f.line} style={{ ["--k" as string]: 0 }}>
              <p className={f.item}>Tech Cogniverse tee <span>× {cfg.qty}</span></p>
              <p className={f.meta}>{c.label} · {PLACES[cfg.place].label} · {SIZES[cfg.size]}</p>
            </div>
            <dl className={f.totals}>
              <div style={{ ["--k" as string]: 1 }}><dt>Subtotal</dt><dd>Shown at checkout</dd></div>
              <div style={{ ["--k" as string]: 2 }}><dt>Total</dt><dd>Shown at checkout</dd></div>
            </dl>
            <p className={f.confirm} style={{ ["--k" as string]: 3 }}>
              <span className={f.cta}>Continue to payment</span>
              <span className={f.note}>Illustration. DesignT’s real checkout uses Razorpay; no payment is taken here.</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
