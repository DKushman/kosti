import { withBasePath } from "@/lib/site-path";

/** Preloader word sequence — one source of truth for timing + content. */
export const PRELOADER_WORDS = [
  { label: "Berlin", emoji: "🐻" },
  { label: "Stadtentwicklung", emoji: "🏙️" },
  { label: "Nachhaltigkeit", emoji: "🌱" },
  { label: "Technologie", emoji: "💡" },
  { label: "Sport", emoji: "⚽" },
  { label: "Konstantin Patsalides", emoji: "👋" },
] as const;

export const HERO_IMAGE = withBasePath("/img/konstantin-portrait.webp");

/** Must match `.preloader` `transition-duration` in globals.css */
export const PRELOADER_CURTAIN_MS = 940;
