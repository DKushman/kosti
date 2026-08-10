"use client";

import { useEffect, useState } from "react";
import { useIntro } from "@/lib/intro-context";
import { HERO_IMAGE, PRELOADER_WORDS } from "@/lib/intro-sequence";

/** Visible pause while a word sits in the slot */
const HOLD_MS = 280;
/** Must match CSS keyframe duration */
const SWAP_MS = 380;
const CURTAIN_MS = 420;

/**
 * Vertical slot swap: outgoing + incoming share one ease/duration
 * so they move as a locked pair. Mask height = one word.
 */
export default function Preloader() {
  const { finish } = useIntro();
  const [index, setIndex] = useState(-1);
  const [curtain, setCurtain] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const img = new Image();
    img.src = HERO_IMAGE;
    void img.decode?.().catch(() => undefined);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      setGone(true);
      return;
    }

    const run = async () => {
      await wait(80);
      if (cancelled) return;

      setIndex(0);
      await wait(HOLD_MS + SWAP_MS);
      if (cancelled) return;

      for (let i = 1; i < PRELOADER_WORDS.length; i++) {
        setIndex(i);
        await wait(HOLD_MS + SWAP_MS);
        if (cancelled) return;
      }

      setCurtain(true);
      finish();
      await wait(CURTAIN_MS);
      if (cancelled) return;
      setGone(true);
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [finish]);

  if (gone) return null;

  const incoming = !curtain && index >= 0 ? PRELOADER_WORDS[index] : null;
  const outgoing = curtain
    ? index >= 0
      ? PRELOADER_WORDS[index]
      : null
    : index > 0
      ? PRELOADER_WORDS[index - 1]
      : null;

  return (
    <div
      className={`preloader${curtain ? " is-curtain" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Konstantin Patsalides"
    >
      <div className="preloader__stage" aria-hidden="true">
        {outgoing ? (
          <p
            className="preloader__word is-out"
            key={`out-${outgoing.label}-${index}-${curtain ? "c" : "s"}`}
          >
            <span className="preloader__emoji">{outgoing.emoji}</span>
            <span className="preloader__label">{outgoing.label}</span>
          </p>
        ) : null}
        {incoming ? (
          <p
            className="preloader__word is-in"
            key={`in-${incoming.label}-${index}`}
          >
            <span className="preloader__emoji">{incoming.emoji}</span>
            <span className="preloader__label">{incoming.label}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
