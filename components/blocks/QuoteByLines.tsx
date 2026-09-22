"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { SplitText } from "@/lib/gsap";
import {
  REVEAL_START,
  isInInitialView,
  markRevealed,
  observeRevealOnce,
} from "@/lib/reveal-io";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Line-mask scroll reveal for quote attribution (SplitText). */
export default function QuoteByLines({ children, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
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
      aria: "none",
      autoSplit: true,
      onSplit: (self: { lines: Element[] }) => {
        self.lines.forEach((line, i) => {
          (line as HTMLElement).style.setProperty("--line-i", String(i));
        });
      },
    });

    el.dataset.reveal = "lines";

    const play = () => markRevealed(el);

    let cleanup = () => {};

    if (isInInitialView(el)) {
      play();
    } else {
      cleanup = observeRevealOnce(el, {
        startTop: REVEAL_START.quote,
        onEnter: play,
      });
    }

    return () => {
      cleanup();
      split.revert();
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}
