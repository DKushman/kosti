/** Preloader word sequence — one source of truth for timing + content. */
export const PRELOADER_WORDS = [
  { label: "Berlin", emoji: "🐻" },
  { label: "Stadtentwicklung", emoji: "🏗️" },
  { label: "Nachhaltigkeit", emoji: "🌿" },
  { label: "Technologie", emoji: "⚡" },
  { label: "Sport", emoji: "⚽" },
  { label: "Konstantin", emoji: "👋" },
] as const;

/** Smooth cubic-bezier easings via GSAP's built-in parser. */
export const INTRO_EASE = {
  wordEnter: "power3.out",
  wordExit: "power3.in",
  curtain: "power3.inOut",
  heroLine: "power3.out",
  heroMedia: "power2.out",
} as const;

export const INTRO_SEQUENCE = {
  preloader: {
    wordEnter: { duration: 0.55 },
    wordExit: { duration: 0.5 },
    wordHold: 0.2,
    lastWordHold: 0.18,
    curtain: { duration: 0.8 },
  },
  hero: {
    media: { fromScale: 1.08, duration: 1.05 },
    line: { duration: 0.75, stagger: 0.12 },
    ui: { delay: 0.32, duration: 0.55, stagger: 0.08 },
  },
} as const;

import { withBasePath } from "@/lib/site-path";

export const HERO_IMAGE = withBasePath("/img/kosti.jpg");
