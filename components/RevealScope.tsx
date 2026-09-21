"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, SplitText, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { peekPending } from "@/lib/curtain";
import { onPageEnter } from "@/lib/page-enter";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
};

/** Above-the-fold on load — ScrollTrigger „top 88%“ would never fire. */
function isInInitialView(el: HTMLElement) {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const r = el.getBoundingClientRect();
  return r.top < vh * 0.92 && r.bottom > 0;
}

const PAGE_ENTER_REVEAL_DELAY = 0.04;
const PAGE_ENTER_STAGGER = 0.07;

/**
 * Declarative scroll reveals for server-rendered content. Any element
 * inside with `data-reveal="lines|up|stagger|rule|clip|fade"` animates
 * in as it enters the viewport. If a page transition is in flight the
 * animations are armed only when the curtain starts lifting, so
 * above-the-fold content animates in view instead of behind the curtain.
 */
export default function RevealScope({
  children,
  className,
  as: Tag = "div",
  id,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      const splits: { revert: () => void }[] = [];
      const ctx = gsap.context(() => {}, scope);

      const build = (afterPageEnter = false) => {
        const enterPad = afterPageEnter ? PAGE_ENTER_REVEAL_DELAY : 0;

        ctx.add(() => {
          let enterOrder = 0;
          scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
            const type = el.dataset.reveal;
            const inView = isInInitialView(el);
            const enterStagger =
              afterPageEnter && inView ? enterOrder++ * PAGE_ENTER_STAGGER : 0;
            const delay =
              Number(el.dataset.revealDelay ?? 0) + enterPad + enterStagger;
            const scrollTrigger = inView
              ? undefined
              : { trigger: el, start: "top 88%", once: true };

            switch (type) {
              case "lines": {
                const split = SplitText.create(el, {
                  type: "lines",
                  linesClass: "split-line",
                  mask: "lines",
                  aria: "auto",
                  autoSplit: true,
                  onSplit: (self: { lines: Element[] }) =>
                    gsap.from(self.lines, {
                      yPercent: 110,
                      duration: 1.05,
                      stagger: 0.09,
                      ease: "power4.out",
                      delay,
                      scrollTrigger: inView
                        ? undefined
                        : { trigger: el, start: "top 85%", once: true },
                    }),
                });
                splits.push(split);
                break;
              }
              case "stagger":
                gsap.from(el.children, {
                  y: 36,
                  autoAlpha: 0,
                  duration: 0.9,
                  stagger: 0.08,
                  ease: "power3.out",
                  delay,
                  clearProps: "all",
                  scrollTrigger,
                });
                break;
              case "rule":
                gsap.from(el, {
                  scaleX: 0,
                  transformOrigin: "left center",
                  duration: 1.2,
                  ease: "power3.inOut",
                  delay,
                  scrollTrigger: inView
                    ? undefined
                    : { trigger: el, start: "top 94%", once: true },
                });
                break;
              case "clip":
                gsap.from(el, {
                  clipPath: "inset(100% 0% 0% 0%)",
                  duration: 1.2,
                  ease: "power4.inOut",
                  delay,
                  scrollTrigger: inView
                    ? undefined
                    : { trigger: el, start: "top 85%", once: true },
                });
                break;
              case "fade":
                gsap.from(el, {
                  autoAlpha: 0,
                  duration: 1,
                  delay,
                  clearProps: "all",
                  scrollTrigger,
                });
                break;
              case "scale":
                gsap.from(el, {
                  scale: 0.92,
                  autoAlpha: 0,
                  duration: 1.1,
                  ease: "power3.out",
                  delay,
                  clearProps: "all",
                  scrollTrigger,
                });
                break;
              case "from-left":
                gsap.from(el, {
                  x: -56,
                  autoAlpha: 0,
                  duration: 1,
                  ease: "power3.out",
                  delay,
                  clearProps: "all",
                  scrollTrigger,
                });
                break;
              case "from-right":
                gsap.from(el, {
                  x: 56,
                  autoAlpha: 0,
                  duration: 1,
                  ease: "power3.out",
                  delay,
                  clearProps: "all",
                  scrollTrigger,
                });
                break;
              default:
                gsap.from(el, {
                  y: 32,
                  autoAlpha: 0,
                  duration: 0.9,
                  ease: "power3.out",
                  delay,
                  clearProps: "all",
                  scrollTrigger,
                });
            }
          });

          if (afterPageEnter) {
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }
        });
      };

      let off: (() => void) | undefined;
      let started = false;

      const run = (afterPageEnter: boolean) => {
        if (started) return;
        started = true;
        off?.();
        off = undefined;
        build(afterPageEnter);
      };

      off = onPageEnter(() => run(true), pathname);

      if (!peekPending()) {
        requestAnimationFrame(() => {
          if (!started) run(false);
        });
      }

      return () => {
        off?.();
        splits.forEach((s) => s.revert());
        ctx.revert();
      };
    },
    { scope: root, dependencies: [pathname] }
  );

  return (
    <Tag ref={root} className={className} id={id}>
      {children}
    </Tag>
  );
}
