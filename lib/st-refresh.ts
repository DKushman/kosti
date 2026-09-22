"use client";

import { ScrollTrigger } from "@/lib/gsap";

let scheduled = 0;

/**
 * Coalesce refresh requests from many components into a single
 * ScrollTrigger.refresh() on the next frame. A refresh re-measures every
 * trigger (forced layout), so ten callers in one frame must not mean ten
 * full passes.
 */
export function scheduleRefresh() {
  if (scheduled) return;
  scheduled = window.requestAnimationFrame(() => {
    scheduled = 0;
    ScrollTrigger.refresh();
  });
}
