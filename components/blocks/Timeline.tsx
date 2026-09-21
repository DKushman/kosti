"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Station = { title: string; meta: string; text: string };

type Props = { items: readonly Station[] };

/**
 * Vertical station list. A gold progress line draws down with scroll
 * (scrubbed), each station rises in as it passes the viewport.
 */
export default function Timeline({ items }: Props) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
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

      gsap.utils.toArray<HTMLElement>("[data-station]", el).forEach((item) => {
        gsap.from(item, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: { trigger: item, start: "top 88%" },
        });
        gsap.from(item.querySelector("[data-dot]"), {
          scale: 0,
          duration: 0.6,
          ease: "back.out(3)",
          scrollTrigger: { trigger: item, start: "top 80%" },
        });
      });
    },
    { scope: root }
  );

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
