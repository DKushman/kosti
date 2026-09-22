"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { REVEAL_START, observeRevealOnce } from "@/lib/reveal-io";

const SEGMENTS = 12;
const R = 150;
const CX = 200;
const CY = 200;

function arc(i: number) {
  const gap = 0.06;
  const a0 = (i / SEGMENTS) * Math.PI * 2 - Math.PI / 2 + gap;
  const a1 = ((i + 1) / SEGMENTS) * Math.PI * 2 - Math.PI / 2 - gap;
  const x0 = CX + R * Math.cos(a0);
  const y0 = CY + R * Math.sin(a0);
  const x1 = CX + R * Math.cos(a1);
  const y1 = CY + R * Math.sin(a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function supportsScrollTimeline() {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline", "view()")
  );
}

type Props = { label?: string; sub?: string };

/**
 * Twelve arcs for the twelve Berlin districts. Arcs draw in on entry
 * and the ring slowly rotates with scroll (scrubbed) — transform only.
 */
export default function BezirkeRing({ label = "12", sub = "Bezirke" }: Props) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const arcs = gsap.utils.toArray<SVGPathElement>("[data-arc]", svg);
    arcs.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    let played = false;
    const draw = () => {
      if (played) return;
      played = true;
      gsap.to(arcs, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: "power3.out",
      });
    };

    const cleanups: (() => void)[] = [
      observeRevealOnce(svg, {
        startTop: REVEAL_START.bezirkeArc,
        onEnter: draw,
      }),
    ];

    if (!supportsScrollTimeline()) {
      const tween = gsap.to("[data-ring]", {
        rotate: 120,
        transformOrigin: "center",
        ease: "none",
        scrollTrigger: {
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <svg
      ref={root}
      className="ring"
      viewBox="0 0 400 400"
      role="img"
      aria-label={`${label} ${sub}`}
      data-scroll-rotate=""
    >
      <g data-ring>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <path key={i} data-arc d={arc(i)} className={i % 4 === 0 ? "is-accent" : undefined} />
        ))}
      </g>
      <circle cx={CX} cy={CY} r={104} className="ring__inner" />
      <text x={CX} y={CY - 4} textAnchor="middle" className="ring__label">
        {label}
      </text>
      <text x={CX} y={CY + 30} textAnchor="middle" className="ring__sub">
        {sub}
      </text>
    </svg>
  );
}
