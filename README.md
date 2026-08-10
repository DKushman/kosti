# Halle. — Studio Site

Award-style one-pager built with **Next.js (App Router) + React + GSAP + Lenis**.
Placeholder brand, copy and generative artwork — swap freely.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Requires Node 18.18+ (Node 20+ recommended). Fonts (Archivo, Newsreader) are
pulled at build time via `next/font/google`.

## What's inside

| Piece | File | Notes |
| --- | --- | --- |
| Preloader | `components/Preloader.tsx` | Two-phase: counter runs to 92 while fonts + hero image decode, then completes and lifts. Hands off to the hero intro mid-curtain via `lib/intro-context.tsx` for a seamless overlap |
| Smooth scroll | `components/SmoothScroll.tsx` | Lenis driven by GSAP's ticker, locked until the preloader finishes |
| Header | `components/Header.tsx` | Fixed bar, serif brand, infinite ticker, turns solid after the hero |
| Menu | `components/MenuOverlay.tsx` | Fullscreen clip-path wipe, staggered links, Esc to close |
| Hero | `components/Hero.tsx` | SplitText char intro (split + initial states prepared at mount, behind the preloader), scrub parallax tweens attached only after the intro completes so nothing fights over the same properties |
| Sectors | `components/Sectors.tsx` | Giant list, hover/focus swaps the sticky image column, line-mask reveals |
| Work | `components/Projects.tsx` | Staggered grid, clip-path unmask, per-image parallax |
| Studio | `components/Studio.tsx` | Scroll-scrubbed word reveal, count-up stats |
| Footer | `components/Footer.tsx` | Ticker, giant mailto CTA, meta bar |

## Architecture notes

- **Semantics first.** Every piece of content is real, visible DOM (`h1`–`h3`,
  `ul[role=list]`, `figure`, `address`, skip-link). GSAP `.from()` tweens set
  initial states at runtime, so with JS disabled the full page renders
  normally — no CSS `opacity: 0` graveyards.
- **GSAP 3.13+**: ScrollTrigger + SplitText (now free) registered once in
  `lib/gsap.ts`; components use `useGSAP` with scoped selectors for automatic
  cleanup. Line-based splits use `autoSplit` + `onSplit` so re-splitting after
  webfont load keeps line breaks correct.
- **Reduced motion**: every animation block checks
  `prefers-reduced-motion` and bails out; Lenis falls back to native scroll.
- **Placeholder art** is generated as SVG (`scripts/gen_images.py`,
  Python 3, no deps) and then baked to JPEG (`scripts/rasterize.py`,
  needs `playwright`) — animating transforms over live vector dot-fields
  forces per-frame re-rasterization and stutters; raster images stay
  GPU-composited. Regenerate: `python3 scripts/gen_images.py &&
  python3 scripts/rasterize.py`.

## Static preview

`static-preview/index.html` mirrors the exact markup/CSS with a tiny vanilla
JS shim — open it directly in a browser for a quick look without installing
anything. It is not part of the Next.js build.

## Swap in real content

1. Replace `public/img/*.svg` with photography (keep filenames or update the
   imports in `Hero/Sectors/Projects`).
2. Copy lives inline in each component — search for the obvious strings.
3. Colors/typography: CSS custom properties at the top of `app/globals.css`.
