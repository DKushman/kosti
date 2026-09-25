import { withBasePath } from "@/lib/site-path";

/** Preloader word sequence — text only. */
export const PRELOADER_STEPS = [
  { label: "Berlin" },
  { label: "Stadtentwicklung" },
  { label: "Nachhaltigkeit" },
  { label: "Technologie" },
  { label: "Sport" },
  { label: "Konstantin Patsalides" },
] as const;

export type PreloaderStep = (typeof PRELOADER_STEPS)[number];

export const PRELOADER_NAME = PRELOADER_STEPS[PRELOADER_STEPS.length - 1].label;
export const PRELOADER_NAME_INDEX = PRELOADER_STEPS.length - 1;

/** Must match `.preloader__word` animation duration in globals.css */
export const PRELOADER_SWAP_MS = 520;
/** Visible hold while each word sits in the slot (between swaps). */
export const PRELOADER_HOLD_MS = 360;
/** Extra pause after „Sport“, before the name animates in. */
export const PRELOADER_BEFORE_NAME_MS = 200;

export const PRELOADER_STEP_MS = PRELOADER_HOLD_MS + PRELOADER_SWAP_MS;

export const HERO_IMAGE = withBasePath("/img/konstantin-portrait.webp");

/** Must match `.preloader` `transition-duration` in globals.css */
export const PRELOADER_CURTAIN_MS = 940;
