"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type MarqueeProps = {
  text: string;
  /** seconds for one full loop */
  speed?: number;
  className?: string;
};

/**
 * Infinite text ticker. The first copy is real content (readable by
 * screen readers / crawlers); the duplicates are aria-hidden.
 */
export default function Marquee({ text, speed = 22, className }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      gsap.to("[data-marquee-track]", {
        xPercent: -50,
        repeat: -1,
        duration: speed,
        ease: "none",
      });
    },
    { scope: root, dependencies: [speed] }
  );

  const item = (
    <>
      {text} <span className="dot">●</span>{" "}
    </>
  );

  return (
    <div className={`marquee ${className ?? ""}`} ref={root}>
      <div className="marquee__track" data-marquee-track>
        <p className="marquee__item">{item}</p>
        <p className="marquee__item" aria-hidden="true">
          {item}
        </p>
        <p className="marquee__item" aria-hidden="true">
          {item}
        </p>
        <p className="marquee__item" aria-hidden="true">
          {item}
        </p>
      </div>
    </div>
  );
}
