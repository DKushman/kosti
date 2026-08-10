"use client";

import type Lenis from "lenis";

/**
 * Tiny module-level store so any component can trigger smooth
 * programmatic scrolling through the active Lenis instance,
 * with a native fallback when Lenis isn't running.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToTarget(target: string | number) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    document
      .querySelector(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
