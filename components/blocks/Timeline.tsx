"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  REVEAL_START,
  markRevealed,
  observeRevealOnce,
} from "@/lib/reveal-io";

type Station = { title: string; meta: string; text: string };

type Props = { items: readonly Station[] };

function supportsScrollTimeline() {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline", "view()")
  );
}

/**
 * Vertical station list. A gold progress line draws down with scroll
 * (scrubbed), each station rises in as it passes the viewport.
 */
export default function Timeline({ items }: Props) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cleanups: (() => void)[] = [];

    if (!supportsScrollTimeline()) {
      const tween = gsap.fromTo(
        "[data-timeline-progress]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        }
      );
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    }

    el.querySelectorAll<HTMLElement>("[data-station]").forEach((item) => {
      cleanups.push(
        observeRevealOnce(item, {
          startTop: REVEAL_START.timelineItem,
          onEnter: () => markRevealed(item),
        })
      );
      const dot = item.querySelector<HTMLElement>("[data-dot]");
      if (dot) {
        cleanups.push(
          observeRevealOnce(dot, {
            startTop: REVEAL_START.timelineDot,
            onEnter: () => markRevealed(dot),
          })
        );
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <ol className="timeline" ref={root} role="list">
      <span className="timeline__track" aria-hidden="true">
        <span className="timeline__progress" data-timeline-progress />
      </span>
      {items.map((item, i) => (
        <li className="timeline__item" data-station key={item.title}>
          <span className="timeline__dot" data-dot aria-hidden="true" />
          <span className="timeline__index">{String(i + 1).padStart(2, "0")}</span>
          <div className="timeline__body">
            <p className="timeline__meta">{item.meta}</p>
            <h3 className="timeline__title">{item.title}</h3>
            <p className="timeline__text">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
