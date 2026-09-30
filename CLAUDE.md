# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # dev server (localhost:3000)
npm run build      # production build (also typechecks)
npm run start      # serve the production build
npm run lint       # eslint (flat config)
npm run typecheck  # tsc --noEmit
npm run media      # rebuild every served image from /assets-src masters
```

No unit test suite. Verification is done by driving the production build with Playwright (screenshots, frame timing, request audits); review captures go in `review/` (gitignored).

## What this site is

Marketing site for **Tech Cogniverse**. Concept: **One Line**. Every system starts as a tangle; one vermilion line is pulled through it until it works. Facts live only in `src/content/` (carried over from the company's previous website; `source` fields keep the page path). Never add a fact, metric, client or status that isn't in `src/content/`.

## Architecture

- **Content** (`src/content/`): `projects.ts` (15 builds: status, depth `full|snapshot`, region), `services.ts` (6), `regions.ts` (Voice, Knowledge, Operations, Products), `company.ts`, `legal.ts`, `transformations.ts` (the input → output sequence per service/project page, plus which full case studies show a real screenshot). Pages render from these; add a project or service by editing data, not markup.
- **The Line engine** (`src/lib/line/engine.ts`): pure functions that return the line's shape as points (`tangle`, `taut`, `wave`, `knowledgeAnchors`, `routeAnchors`, `framePath`, `busPath`, `railPath`), `resample` to a fixed point count, and `morph` (point-for-point, with a travelling front). Every shape runs edge to edge, so any two can be morphed without the line breaking. Landscape runs left → right, portrait (< 900px wide) top → bottom.
- **Homepage** (`src/components/line/OneLine.tsx` + `.module.css`): one fixed `<canvas>` draws the line for the whole page. Pinned chapters (`data-sec`: hero, voice, knowledge, ops, products, map) are tall sections with a sticky `data-stage`; each gets a `--p` (0..1) that drives its CSS entrances. After the map the line becomes a rail down the left edge (`--rail` in CSS must match `railX()` in the engine) for normal-flow Work, Process, Trust, and bends under the contact textarea (`#friction`), where typing ripples it. Products and map shapes are measured from the DOM (`[data-frame]`, `[data-card]`), so change the CSS and the line follows.
- **Motion rules**: one rAF loop that lerps toward `scrollY` and rests when settled; delta-gated `--p` writes; no free-running animation. Reduced motion switches to `data-mode="still"` (static drawings per chapter, `--p: 1`). Without JS, `html:not([data-js])` (set by the inline script in `layout.tsx`) shows the same resolved state.
- **Inner pages** (`src/app/`): `/services/[slug]`, `/work/[slug]` open with `RegionBanner` (the region's line shape as a server-rendered SVG via `LineStrip`), then a quiet editorial layout with one `Transformation`. Index pages use `MapStrip` (`tangle` or `taut`). GSAP (`src/lib/motion.ts`, `useScene`) is used only by `Transformation` and `Process` on inner pages.
- **Contact** (`src/lib/contact.ts`, `src/app/api/contact/route.ts`): provider adapter chosen by env (`CONTACT_PROVIDER=resend|webhook`, see `.env.example`). Unconfigured returns 503 and the form says it can't deliver; it must never show success without a real 2xx.
- **Media**: only real product screenshots (`public/media/work/`, built by `npm run media` from gitignored masters in `assets-src/screens/`). `tools/gen/` holds Gemini generation scripts; they read no keys (auth is injected by the environment). No generated imagery is used on the site.

## Design rules

Tokens are in `src/app/globals.css`: vellum canvas `#e6e9ea`, graphite ink `#16191d`, one vermilion signal `#f2461e` (`--signal-ink #b8300f` for text). Vermilion is for the Line and emphasis only, never status or errors; human gates and fallbacks are drawn as dashed graphite. Older token names (`--cobalt`, `--teal`, `--amber`, `--limestone`…) are aliases onto this palette, kept so page CSS stays small. Type: Bricolage Grotesque (display, 700, tight tracking), Instrument Sans (body), Martian Mono (labels, uppercase). Anything drawn to explain a real product is captioned as an illustration.

## Configuration still pending

`NEXT_PUBLIC_SITE_URL` (canonical, sitemap), contact provider env, and the booking/social links (`COMPANY.calendly`, `COMPANY.x` are empty until Tech Cogniverse accounts exist; UI hides them when empty).
