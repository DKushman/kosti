"use client";

import { useEffect, useState } from "react";
import { useIntro } from "@/lib/intro-context";
import { dispatchPageEnter } from "@/lib/page-enter";
import {
  PRELOADER_BEFORE_NAME_MS,
  PRELOADER_CURTAIN_MS,
  PRELOADER_NAME,
  PRELOADER_NAME_INDEX,
  PRELOADER_STEP_MS,
  PRELOADER_STEPS,
  type PreloaderStep,
} from "@/lib/intro-sequence";

const CURTAIN_MS = PRELOADER_CURTAIN_MS;
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

function isNameStep(step: PreloaderStep) {
  return step.label === PRELOADER_NAME;
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
      SHORT_ON_REPEAT_VISIT && isRepeatVisit() ? PRELOADER_STEPS.length - 1 : 0;

    const run = async () => {
      await wait(80);
      if (cancelled) return;

      setIndex(first);
      await wait(PRELOADER_STEP_MS);
      if (cancelled) return;

      for (let i = first + 1; i < PRELOADER_STEPS.length; i++) {
        if (i === PRELOADER_NAME_INDEX) {
          await wait(PRELOADER_BEFORE_NAME_MS);
          if (cancelled) return;
        }
        setIndex(i);
        await wait(PRELOADER_STEP_MS);
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

  const incoming = !curtain && index >= 0 ? PRELOADER_STEPS[index] : null;
  const outgoing = curtain
    ? index >= 0
      ? PRELOADER_STEPS[index]
      : null
    : index > 0
      ? PRELOADER_STEPS[index - 1]
      : null;

  const nameOnStage =
    (incoming && isNameStep(incoming)) || (outgoing && isNameStep(outgoing));

  return (
    <div
      className={`preloader${curtain ? " is-curtain" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Konstantin Patsalides"
    >
      <div
        className={`preloader__stage${nameOnStage ? " is-name" : ""}`}
        aria-hidden="true"
      >
        {outgoing ? (
          <p
            className={`preloader__word is-out${isNameStep(outgoing) ? " preloader__word--name" : ""}`}
            key={`out-${outgoing.label}-${index}-${curtain ? "c" : "s"}`}
          >
            {outgoing.label}
          </p>
        ) : null}
        {incoming ? (
          <p
            className={`preloader__word is-in${isNameStep(incoming) ? " preloader__word--name" : ""}`}
            key={`in-${incoming.label}-${index}`}
          >
            {incoming.label}
          </p>
        ) : null}
      </div>
    </div>
  );
}
