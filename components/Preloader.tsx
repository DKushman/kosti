"use client";

import { useEffect, useState } from "react";
import { useIntro } from "@/lib/intro-context";
import { dispatchPageEnter } from "@/lib/page-enter";
import { PRELOADER_CURTAIN_MS, PRELOADER_WORDS } from "@/lib/intro-sequence";

/** Visible pause while a word sits in the slot */
const HOLD_MS = 320;
/** Must match CSS keyframe duration */
const SWAP_MS = 480;
const CURTAIN_MS = PRELOADER_CURTAIN_MS;
/**
 * Repeat full loads within the same tab session (reload, back from an
 * external site, deep link) jump straight to the last word instead of
 * replaying all six. First impression stays untouched. Set to false to
 * always play the full sequence.
 */
const SHORT_ON_REPEAT_VISIT = true;
const SESSION_KEY = "kp-preloader-seen";
let repeatVisitDecision: boolean | null = null;

function isRepeatVisit() {
  if (repeatVisitDecision === null) {
    try {
      repeatVisitDecision = window.sessionStorage.getItem(SESSION_KEY) === "1";
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      repeatVisitDecision = false;
    }
  }
  return repeatVisitDecision;
}

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      dispatchPageEnter(window.location.pathname);
      setGone(true);
      return;
    }

    const first =
      SHORT_ON_REPEAT_VISIT && isRepeatVisit() ? PRELOADER_WORDS.length - 1 : 0;

    const run = async () => {
      await wait(80);
      if (cancelled) return;

      setIndex(first);
      await wait(HOLD_MS + SWAP_MS);
      if (cancelled) return;

      for (let i = first + 1; i < PRELOADER_WORDS.length; i++) {
        setIndex(i);
        await wait(HOLD_MS + SWAP_MS);
        if (cancelled) return;
      }

      setCurtain(true);
      finish();
      dispatchPageEnter(window.location.pathname);
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
