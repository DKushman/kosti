"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { REVEAL_START, observeRevealOnce } from "@/lib/reveal-io";

/* deterministic node layout (viewBox 400×400) */
const NODES = [
  [200, 200, 9], [92, 120, 6], [300, 96, 5], [330, 230, 7], [110, 300, 5],
  [250, 330, 6], [160, 70, 4], [356, 150, 4], [60, 210, 4], [200, 372, 4],
  [290, 290, 3], [140, 180, 3], [270, 170, 4], [40, 60, 3],
] as const;

const LINKS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 7], [3, 7], [4, 8],
  [1, 8], [5, 9], [4, 9], [3, 10], [5, 10], [1, 11], [0, 11], [2, 12],
  [0, 12], [6, 13], [1, 13], [12, 3],
];

/**
 * "Menschen verbinden": nodes pop in, edges draw themselves, then the
 * whole constellation breathes gently while in view. Pure SVG, ~35
 * elements, transforms only.
 */
export default function NetworkGraphic() {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lines = gsap.utils.toArray<SVGLineElement>("[data-edge]", svg);
    const nodes = gsap.utils.toArray<SVGCircleElement>("[data-node]", svg);

    lines.forEach((line) => {
      const len = Math.hypot(
        Number(line.getAttribute("x2")) - Number(line.getAttribute("x1")),
        Number(line.getAttribute("y2")) - Number(line.getAttribute("y1"))
      );
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    });

    let played = false;
    const tl = gsap.timeline({ paused: true });
    tl.from(nodes, {
      scale: 0,
      transformOrigin: "center",
      duration: 0.7,
      stagger: 0.05,
      ease: "back.out(2)",
    }).to(
      lines,
      { strokeDashoffset: 0, duration: 1.1, stagger: 0.04, ease: "power2.inOut" },
      "-=0.5"
    );

    const playEnter = () => {
      if (played) return;
      played = true;
      tl.play();
    };

    const breathe = gsap.to("[data-float]", {
      y: (i) => (i % 2 ? 6 : -6),
      x: (i) => (i % 3 ? -4 : 4),
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.25, from: "random" },
      paused: true,
    });

    const cleanups: (() => void)[] = [
      observeRevealOnce(svg, {
        startTop: REVEAL_START.networkSvg,
        onEnter: playEnter,
      }),
    ];

    const vis =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) breathe.play();
              else breathe.pause();
            },
            { threshold: 0 }
          )
        : null;
    vis?.observe(svg);
    if (vis) cleanups.push(() => vis.disconnect());

    return () => {
      cleanups.forEach((fn) => fn());
      breathe.kill();
      tl.kill();
    };
  }, []);

  return (
    <svg
      ref={root}
      className="net"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Netzwerkgrafik: verbundene Punkte"
    >
      <g className="net__edges">
        {LINKS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            data-edge
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
          />
        ))}
      </g>
      <g className="net__nodes">
        {NODES.map(([x, y, r], i) => (
          <g key={i} data-float>
            <circle
              data-node
              cx={x}
              cy={y}
              r={r}
              className={i === 0 ? "is-core" : undefined}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
