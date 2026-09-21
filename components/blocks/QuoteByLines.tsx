"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Line-mask scroll reveal for quote attribution (SplitText). */
export default function QuoteByLines({ children, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      const split = SplitText.create(el, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
      });

      gsap.set(split.lines, { yPercent: 110, force3D: true });

      const inView = el.getBoundingClientRect().top < window.innerHeight * 0.88;

      const play = () => {
        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1.05,
          stagger: 0.09,
          ease: "power4.out",
        });
      };

      let scrollTrigger: ScrollTrigger | undefined;
      if (inView) {
        play();
      } else {
        scrollTrigger = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: play,
        });
      }

      return () => {
        scrollTrigger?.kill();
        split.revert();
      };
    },
    { scope: ref }
  );

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
