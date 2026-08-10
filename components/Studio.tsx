"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const STATS = [
  { label: "Years of craft", value: 22, suffix: "+" },
  { label: "Projects delivered", value: 340, suffix: "" },
  { label: "Design awards", value: 17, suffix: "" },
];

/**
 * Dark manifesto strip: big serif statement revealed word by word
 * (scrubbed to scroll), stat counters count up on entry.
 */
export default function Studio() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const statement = SplitText.create("[data-studio-statement]", {
        type: "words",
        aria: "auto",
      });

      gsap.from(statement.words, {
        opacity: 0.14,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-studio-statement]",
          start: "top 78%",
          end: "bottom 45%",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count ?? "0");
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });

      gsap.from("[data-studio-stats] > div", {
        y: 48,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        clearProps: "all",
        scrollTrigger: {
          trigger: "[data-studio-stats]",
          start: "top 85%",
        },
      });

      return () => statement.revert();
    },
    { scope: root }
  );

  return (
    <section
      className="studio"
      id="studio"
      ref={root}
      aria-labelledby="studio-heading"
    >
      <h2 className="visually-hidden" id="studio-heading">
        The studio
      </h2>
      <p className="studio__statement" data-studio-statement>
        We are a Berlin studio shaping brands people can walk into. Strategy,
        design and build under one roof — spaces that feel <em>inevitable</em>,
        not decorated.
      </p>

      <dl className="studio__stats" data-studio-stats>
        {STATS.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>
              <span data-count={stat.value}>{stat.value}</span>
              {stat.suffix && <sup>{stat.suffix}</sup>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
