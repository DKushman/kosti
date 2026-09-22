"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Quadratisches Koordinatensystem – skaliert per CSS in den Viz-Frame. */
const VIEW = 1000;
const CX = VIEW / 2;
const CY = VIEW / 2;
const POLE_RADIUS = 368;
const LERP = 0.11;
const PULL = 0.18;

/** Server and browser stringify floats differently in the 17th digit — round so SSR markup hydrates cleanly. */
const r3 = (v: number) => Math.round(v * 1000) / 1000;

type SpokeDef = {
  id: string;
  angle: number;
  label: string;
  labelDx: number;
  labelDy: number;
  textAnchor: "start" | "end" | "middle";
};

const SPOKES: SpokeDef[] = [
  {
    id: "wirtschaft",
    angle: (240 * Math.PI) / 180,
    label: "Wirtschaft",
    labelDx: -14,
    labelDy: -6,
    textAnchor: "end",
  },
  {
    id: "kultur",
    angle: (120 * Math.PI) / 180,
    label: "Kultur & Politik",
    labelDx: -14,
    labelDy: 10,
    textAnchor: "end",
  },
  {
    id: "vernetzung",
    angle: 0,
    label: "Vernetzung",
    labelDx: 14,
    labelDy: 4,
    textAnchor: "start",
  },
];

const SPOKE_POINTS = SPOKES.map((s) => ({
  ...s,
  x: r3(CX + Math.cos(s.angle) * POLE_RADIUS),
  y: r3(CY + Math.sin(s.angle) * POLE_RADIUS),
}));

const RADIALS = Array.from({ length: 56 }, (_, i) => {
  const angle = (i / 56) * Math.PI * 2 - Math.PI / 2;
  const len = 72 + (i % 8) * 18 + (i % 4) * 12;
  return {
    angle,
    len: Math.min(len, POLE_RADIUS - 48),
    opacity: 0.1 + (i % 6) * 0.035,
    width: i % 11 === 0 ? 1 : 0.45,
  };
});

function svgPoint(el: HTMLElement, clientX: number, clientY: number) {
  const svg = el.querySelector("svg");
  if (!svg) return { x: CX, y: CY };
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: CX, y: CY };
  return pt.matrixTransform(ctm.inverse());
}

function pointOnCircle(
  cx: number,
  cy: number,
  baseX: number,
  baseY: number,
  radius: number,
  shiftX: number,
  shiftY: number
) {
  const angle = Math.atan2(baseY + shiftY - cy, baseX + shiftX - cx);
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

export default function StudioRadialGraphic() {
  const root = useRef<HTMLDivElement>(null);
  const loopId = useRef<number | null>(null);
  const sectionActive = useRef(false);
  const pointer = useRef({ x: CX, y: CY });
  const smooth = useRef({ x: CX, y: CY });

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      /* pointer-follow only makes sense with a hovering pointer */
      const hoverable = window.matchMedia("(hover: hover)").matches;

      const majorLines = gsap.utils.toArray<SVGLineElement>("[data-spoke]", el);
      const fineLines = gsap.utils.toArray<SVGLineElement>("[data-radial]", el);
      const nodeGroups = gsap.utils.toArray<SVGGElement>("[data-node-group]", el);

      const poleMeta = SPOKE_POINTS.map((s) => ({
        len: POLE_RADIUS,
        baseX: s.x,
        baseY: s.y,
      }));

      const fineMeta = RADIALS.map((r) => ({
        ...r,
        baseX: r3(CX + Math.cos(r.angle) * r.len),
        baseY: r3(CY + Math.sin(r.angle) * r.len),
      }));

      majorLines.forEach((line, i) => {
        gsap.set(line, {
          strokeDasharray: poleMeta[i].len,
          strokeDashoffset: poleMeta[i].len,
        });
      });

      const applyPole = (i: number, x: number, y: number) => {
        majorLines[i]?.setAttribute("x2", String(x));
        majorLines[i]?.setAttribute("y2", String(y));
        nodeGroups[i]?.setAttribute("transform", `translate(${x} ${y})`);
      };

      const resetAll = () => {
        SPOKE_POINTS.forEach((s, i) => applyPole(i, s.x, s.y));
        fineLines.forEach((line, i) => {
          const m = fineMeta[i];
          line.setAttribute("x2", String(m.baseX));
          line.setAttribute("y2", String(m.baseY));
          line.setAttribute("opacity", String(m.opacity));
        });
      };

      const render = (cursorX: number, cursorY: number) => {
        const dx = cursorX - CX;
        const dy = cursorY - CY;
        const influence = Math.min(1, Math.hypot(dx, dy) / 260);
        const shiftX = dx * PULL * influence;
        const shiftY = dy * PULL * influence;
        const fineBoost = 0.4 + influence * 0.5;

        SPOKE_POINTS.forEach((_, i) => {
          const meta = poleMeta[i];
          const { x, y } = pointOnCircle(
            CX,
            CY,
            meta.baseX,
            meta.baseY,
            meta.len,
            shiftX,
            shiftY
          );
          applyPole(i, x, y);
        });

        fineLines.forEach((line, i) => {
          const m = fineMeta[i];
          const { x, y } = pointOnCircle(
            CX,
            CY,
            m.baseX,
            m.baseY,
            m.len,
            shiftX * 0.82,
            shiftY * 0.82
          );
          line.setAttribute("x2", String(x));
          line.setAttribute("y2", String(y));
          line.setAttribute("opacity", String(Math.min(1, m.opacity * fineBoost)));
        });
      };

      const tick = () => {
        if (!sectionActive.current) {
          loopId.current = null;
          return;
        }
        const dx = pointer.current.x - smooth.current.x;
        const dy = pointer.current.y - smooth.current.y;
        if (Math.abs(dx) + Math.abs(dy) < 0.05) {
          /* settled: draw the final state once, then idle until the pointer moves */
          smooth.current.x = pointer.current.x;
          smooth.current.y = pointer.current.y;
          render(smooth.current.x, smooth.current.y);
          loopId.current = null;
          return;
        }
        smooth.current.x += dx * LERP;
        smooth.current.y += dy * LERP;
        render(smooth.current.x, smooth.current.y);
        loopId.current = requestAnimationFrame(tick);
      };

      const ensureLoop = () => {
        if (loopId.current === null) {
          loopId.current = requestAnimationFrame(tick);
        }
      };

      const stopLoop = () => {
        if (loopId.current !== null) {
          cancelAnimationFrame(loopId.current);
          loopId.current = null;
        }
      };

      if (!reduced) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        tl.to(majorLines, {
          strokeDashoffset: 0,
          duration: 0.95,
          stagger: 0.05,
          ease: "power2.out",
        })
          .from(
            fineLines,
            { attr: { x2: CX, y2: CY }, duration: 0.75, stagger: 0.005, ease: "power2.out" },
            0.1
          )
          .from(
            "[data-hub]",
            { scale: 0, transformOrigin: "center", duration: 0.4, ease: "back.out(2)" },
            0
          );

        ScrollTrigger.create({
          trigger: "#netzwerk",
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            sectionActive.current = self.isActive;
            if (self.isActive) {
              ensureLoop();
            } else {
              pointer.current.x = CX;
              pointer.current.y = CY;
              smooth.current.x = CX;
              smooth.current.y = CY;
              stopLoop();
              resetAll();
            }
          },
        });

        const onMove = (e: PointerEvent) => {
          if (!sectionActive.current) return;
          const pt = svgPoint(el, e.clientX, e.clientY);
          pointer.current.x = pt.x;
          pointer.current.y = pt.y;
          ensureLoop();
        };

        const onLeave = () => {
          pointer.current.x = CX;
          pointer.current.y = CY;
          ensureLoop();
        };

        if (hoverable) {
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
        }

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          stopLoop();
        };
      }

      gsap.set(majorLines, { strokeDashoffset: 0 });
    },
    { scope: root }
  );

  return (
    <div className="studio-radial" ref={root}>
      <svg
        className="studio-radial__svg"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Netzwerk: Wirtschaft, Kultur und Politik, Vernetzung"
      >
        <g className="studio-radial__fine">
          {RADIALS.map((r, i) => (
            <line
              key={i}
              data-radial
              x1={CX}
              y1={CY}
              x2={r3(CX + Math.cos(r.angle) * r.len)}
              y2={r3(CY + Math.sin(r.angle) * r.len)}
              strokeWidth={r.width}
              opacity={r.opacity}
            />
          ))}
        </g>
        <g className="studio-radial__major">
          {SPOKE_POINTS.map((s) => (
            <line
              key={s.id}
              data-spoke
              x1={CX}
              y1={CY}
              x2={s.x}
              y2={s.y}
              strokeWidth={2.25}
            />
          ))}
        </g>
        <rect
          data-hub
          x={CX - 5}
          y={CY - 5}
          width={10}
          height={10}
          className="studio-radial__hub"
        />
        {SPOKE_POINTS.map((s) => (
          <g
            key={s.id}
            data-node-group
            transform={`translate(${s.x} ${s.y})`}
          >
            <rect x={-4} y={-4} width={8} height={8} className="studio-radial__node" />
            <text
              className="studio-radial__label-text"
              x={s.labelDx}
              y={s.labelDy}
              textAnchor={s.textAnchor}
              dominantBaseline="middle"
            >
              <tspan className="studio-radial__label-mark" aria-hidden="true">
                ■{" "}
              </tspan>
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
