"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import NetworkBackdrop from "@/components/graphics/NetworkBackdrop";

const MISSION_LINES = [
  "Berlin verbinden.",
  "Wirtschaft stärken.",
  "Zukunft gestalten.",
] as const;

function supportsScrollTimeline() {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline", "view()")
  );
}

/**
 * Three lines: each fills left → right in sequence while scrolling.
 * Large network SVG sits centered behind the copy (transform-only motion).
 */
export default function MissionStatement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const fills = root.current.querySelectorAll<HTMLElement>(
      "[data-mission-line-fill]"
    );
    if (!fills.length) return;

    if (reduced) {
      fills.forEach((el) => {
        el.style.clipPath = "inset(0% 0% 0% 0%)";
      });
      return;
    }

    const cleanups: (() => void)[] = [];

    if (supportsScrollTimeline()) {
      return;
    }

    gsap.set(fills, { clipPath: "inset(0% 100% 0% 0%)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: "top 62%",
        end: "center 22%",
        scrub: true,
      },
    });

    fills.forEach((el) => {
      tl.to(el, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        duration: 1,
      });
    });

    const graphic = root.current.querySelector<HTMLElement>(
      "[data-mission-graphic]"
    );
    if (graphic) {
      const tween = gsap.fromTo(
        graphic,
        { yPercent: 10, rotate: -12, scale: 0.94 },
        {
          yPercent: -12,
          rotate: 10,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    }

    cleanups.push(() => {
      tl.scrollTrigger?.kill();
      tl.kill();
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      className="mission"
      id="mission"
      ref={root}
      aria-labelledby="mission-heading"
    >
      <div className="mission__inner">
        <div className="mission__graphic" aria-hidden="true">
          <div className="mission__graphic-motion" data-mission-graphic>
            <NetworkBackdrop />
          </div>
        </div>

        <div className="mission__stack">
          <h2 className="mission__headline display" id="mission-heading">
            {MISSION_LINES.map((line) => (
              <span className="mission__line-stack" key={line}>
                <span className="mission__line mission__line--base">{line}</span>
                <span
                  className="mission__line mission__line--fill"
                  data-mission-line-fill
                  aria-hidden="true"
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
