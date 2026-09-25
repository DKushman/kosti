/** Maps GSAP-style `start: "top X%"` to IntersectionObserver rootMargin (bottom inset). */
export function rootMarginForTopStart(percent: number) {
  const cut = Math.max(0, Math.min(100, 100 - percent));
  return `0px 0px -${cut}% 0px`;
}

export function isInInitialView(el: HTMLElement, ratio = 0.92) {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const r = el.getBoundingClientRect();
  return r.top < vh * ratio && r.bottom > 0;
}

type ObserveOnceOpts = {
  /** GSAP-style: trigger when element top crosses this % of viewport height */
  startTop?: number;
  root?: Element | null;
  threshold?: number | number[];
  onEnter: () => void;
};

/**
 * Fire once when the element enters the viewport band (GPU-friendly alternative
 * to ScrollTrigger `once: true`).
 */
export function observeRevealOnce(
  el: Element,
  { startTop = 88, root = null, threshold = 0, onEnter }: ObserveOnceOpts
) {
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {};
  }

  let done = false;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (done || !entry.isIntersecting) continue;
        done = true;
        onEnter();
        io.disconnect();
      }
    },
    {
      root,
      rootMargin: rootMarginForTopStart(startTop),
      threshold,
    }
  );

  io.observe(el);
  return () => io.disconnect();
}

export function revealWithDelay(el: HTMLElement, delaySec: number, play: () => void) {
  if (delaySec <= 0) {
    play();
    return;
  }
  window.setTimeout(play, delaySec * 1000);
}

export function markRevealed(el: HTMLElement) {
  el.classList.add("is-revealed");
}

export function setRevealDelay(el: HTMLElement, delaySec: number) {
  el.style.setProperty("--reveal-delay", `${delaySec}s`);
}

/** Default start positions matching former ScrollTrigger configs */
export const REVEAL_START = {
  default: 88,
  lines: 85,
  clip: 85,
  rule: 94,
  studioIntro: 55,
  studioStats: 88,
  bio: 88,
  quote: 85,
  sectorsLede: 82,
  sectorsCta: 88,
  sectorItem: 72,
  sectorRule: 92,
  workHead: 85,
  /** Projekt-Karte: Fenster-Aufklappen wenn Karte im unteren Drittel sichtbar wird */
  workMediaUnfold: 68,
  workCaption: 70,
  networkSvg: 80,
  studioRadial: 85,
  bezirkeArc: 82,
  timelineItem: 88,
  timelineDot: 80,
} as const;
