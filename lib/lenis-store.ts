"use client";

import type Lenis from "lenis";

/**
 * Tiny module-level store so any component can trigger smooth or
 * instant programmatic scrolling through the active Lenis instance,
 * with a native fallback when Lenis isn't running.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function lockScroll() {
  instance?.stop();
}

export function unlockScroll() {
  instance?.start();
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

/** Jump without animation (used under the page-transition curtain). */
export function jumpToTarget(target: string | number) {
  const headerOffset = -64;
  if (typeof target === "string") {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) {
      jumpToTarget(0);
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY + headerOffset;
    if (instance) {
      instance.scrollTo(top, { immediate: true, force: true });
    }
    window.scrollTo(0, Math.max(0, top));
    return;
  }
  if (instance) {
    instance.scrollTo(target, { immediate: true, force: true });
  }
  window.scrollTo(0, target);
}
