"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SplitText } from "@/lib/gsap";
import { peekPending } from "@/lib/curtain";
import { onPageEnter } from "@/lib/page-enter";
import {
  REVEAL_START,
  isInInitialView,
  markRevealed,
  observeRevealOnce,
  revealWithDelay,
  setRevealDelay,
} from "@/lib/reveal-io";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
};

const PAGE_ENTER_REVEAL_DELAY = 0.04;
const PAGE_ENTER_STAGGER = 0.07;

function startForType(type: string | undefined) {
  switch (type) {
    case "lines":
      return REVEAL_START.lines;
    case "clip":
      return REVEAL_START.clip;
    case "rule":
      return REVEAL_START.rule;
    default:
      return REVEAL_START.default;
  }
}

function armElement(
  el: HTMLElement,
  afterPageEnter: boolean,
  enterOrder: { n: number }
) {
  const type = el.dataset.reveal;
  if (!type) return () => {};

  const inView = isInInitialView(el);
  const enterStagger =
    afterPageEnter && inView ? enterOrder.n++ * PAGE_ENTER_STAGGER : 0;
  const delay =
    Number(el.dataset.revealDelay ?? 0) + (afterPageEnter ? PAGE_ENTER_REVEAL_DELAY : 0) + enterStagger;

  setRevealDelay(el, delay);

  const play = () => revealWithDelay(el, 0, () => markRevealed(el));

  if (type === "stagger") {
    Array.from(el.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty("--stagger-i", String(i));
    });
  }

  if (inView) {
    revealWithDelay(el, delay, () => markRevealed(el));
    return () => {};
  }

  return observeRevealOnce(el, {
    startTop: startForType(type),
    onEnter: play,
  });
}

/**
 * Declarative scroll reveals for server-rendered content. Any element
 * inside with `data-reveal="lines|up|stagger|rule|clip|fade"` animates
 * in as it enters the viewport (Intersection Observer + CSS).
 */
export default function RevealScope({
  children,
  className,
  as: Tag = "div",
  id,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const splits: { revert: () => void }[] = [];
    const cleanups: (() => void)[] = [];
    let started = false;

    const build = (afterPageEnter: boolean) => {
      const enterOrder = { n: 0 };

      scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const type = el.dataset.reveal;

        if (type === "lines") {
          const split = SplitText.create(el, {
            type: "lines",
            linesClass: "split-line",
            mask: "lines",
            aria: "auto",
            autoSplit: true,
            onSplit: (self: { lines: Element[] }) => {
              self.lines.forEach((line, i) => {
                (line as HTMLElement).style.setProperty("--line-i", String(i));
              });
            },
          });
          splits.push(split);
        }

        cleanups.push(armElement(el, afterPageEnter, enterOrder));
      });
    };

    const run = (afterPageEnter: boolean) => {
      if (started) return;
      started = true;
      build(afterPageEnter);
    };

    const off = onPageEnter(() => run(true), pathname);

    if (!peekPending()) {
      requestAnimationFrame(() => {
        if (!started) run(false);
      });
    }

    return () => {
      off();
      cleanups.forEach((fn) => fn());
      splits.forEach((s) => s.revert());
    };
  }, [pathname]);

  return (
    <Tag ref={root} className={className} id={id}>
      {children}
    </Tag>
  );
}
