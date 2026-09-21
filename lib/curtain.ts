"use client";

import { gsap } from "@/lib/gsap";

/**
 * Curtain = three full-screen colour panels (gold · slate · navy) that
 * cover and reveal the viewport. Panels are ordered by z-index:
 * index 0 sits lowest, the last index on top. The same primitive drives
 * the menu (drops from the top) and page transitions (rises from the
 * bottom), so both share one visual language.
 */
export type Panels = HTMLElement[];

export const CURTAIN = {
  cover: { duration: 0.82, stagger: 0.1, ease: "power4.inOut" },
  reveal: { duration: 0.88, stagger: 0.11, ease: "power4.inOut" },
} as const;

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resetPanels(panels: Panels, from: "top" | "bottom") {
  gsap.killTweensOf(panels);
  gsap.set(panels, {
    x: 0,
    y: 0,
    yPercent: from === "top" ? -100 : 100,
    visibility: "hidden",
    force3D: true,
  });
}

/**
 * Slide every panel to cover the viewport, lowest z first so the
 * following colours visibly overtake the previous one.
 * `covered` resolves once the first panel fully hides the page,
 * `done` when the last panel has settled.
 */
export function coverWith(panels: Panels, from: "top" | "bottom") {
  if (reduced()) {
    gsap.set(panels, { yPercent: 0, visibility: "visible" });
    return { covered: Promise.resolve(), done: Promise.resolve() };
  }

  gsap.killTweensOf(panels);
  gsap.set(panels, {
    x: 0,
    y: 0,
    yPercent: from === "top" ? -100 : 100,
    visibility: "visible",
    force3D: true,
  });

  let resolveCovered: () => void = () => {};
  const covered = new Promise<void>((r) => (resolveCovered = r));
  const tl = gsap.timeline();

  panels.forEach((panel, i) => {
    tl.to(
      panel,
      {
        yPercent: 0,
        duration: CURTAIN.cover.duration,
        ease: CURTAIN.cover.ease,
        force3D: true,
        onComplete: i === 0 ? resolveCovered : undefined,
      },
      i * CURTAIN.cover.stagger
    );
  });

  const done = new Promise<void>((r) => tl.eventCallback("onComplete", r));
  return { covered, done };
}

/**
 * Lift every panel upwards, top-most first, so each colour is exposed
 * for a beat before the page underneath appears.
 */
export function revealFrom(panels: Panels, opts?: { onHalf?: () => void }) {
  if (reduced()) {
    gsap.set(panels, { yPercent: -100, visibility: "hidden" });
    opts?.onHalf?.();
    return Promise.resolve();
  }

  gsap.killTweensOf(panels);
  const tl = gsap.timeline();
  const ordered = [...panels].reverse();

  ordered.forEach((panel, i) => {
    tl.to(
      panel,
      {
        yPercent: -100,
        duration: CURTAIN.reveal.duration,
        ease: CURTAIN.reveal.ease,
        force3D: true,
      },
      i * CURTAIN.reveal.stagger
    );
  });

  if (opts?.onHalf) tl.call(opts.onHalf, undefined, CURTAIN.reveal.duration * 0.45);

  return new Promise<void>((resolve) => {
    tl.eventCallback("onComplete", () => {
      gsap.set(panels, { visibility: "hidden" });
      resolve();
    });
  });
}

/* ----------------------------------------------------------- registry */

type Source = "page" | "menu";

type Pending = { source: Source; hash: string; path: string; startedAt: number };

let pending: Pending | null = null;
let pagePanels: Panels = [];
let menuHandlers: {
  exit: () => Promise<void>;
} | null = null;

export function registerPagePanels(panels: Panels) {
  pagePanels = panels;
  return () => {
    if (pagePanels === panels) pagePanels = [];
  };
}

export function registerMenu(handlers: typeof menuHandlers) {
  menuHandlers = handlers;
  return () => {
    if (menuHandlers === handlers) menuHandlers = null;
  };
}

export function getMenuHandlers() {
  return menuHandlers;
}

export function setPending(p: Omit<Pending, "startedAt">) {
  pending = { ...p, startedAt: Date.now() };
}

export function peekPending() {
  return pending;
}

export function clearPending() {
  pending = null;
}

export function coverPage() {
  if (!pagePanels.length) {
    return { covered: Promise.resolve(), done: Promise.resolve() };
  }
  return coverWith(pagePanels, "bottom");
}

export function revealPage(opts?: { onRevealMid?: () => void }) {
  if (!pagePanels.length) {
    opts?.onRevealMid?.();
    return Promise.resolve();
  }
  return revealFrom(pagePanels, { onHalf: opts?.onRevealMid });
}
