"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import FillButton from "@/components/FillButton";
import StudioRadialGraphic from "@/components/graphics/StudioRadialGraphic";
import {
  REVEAL_START,
  markRevealed,
  observeRevealOnce,
} from "@/lib/reveal-io";

function ExpoVision() {
  return (
    <div>
      <dt>
        <span className="studio__line-clip">
          <span className="studio__line-rise">EXPO – die Vision</span>
        </span>
      </dt>
      <dd>
        <span className="studio__line-clip studio__line-clip--count">
          <span className="studio__line-rise" data-count={2035}>
            2035
          </span>
        </span>
      </dd>
    </div>
  );
}

/**
 * Studio / Netzwerk – fester dunkler Block.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cleanups: (() => void)[] = [];

    const statement = section.querySelector<HTMLElement>(
      "[data-studio-statement]"
    );
    const eyebrow = section.querySelector<HTMLElement>("[data-studio-eyebrow]");
    const cta = section.querySelector<HTMLElement>("[data-studio-cta]");
    const stats = [
      ...section.querySelectorAll<HTMLElement>("[data-studio-stats]"),
    ];

    if (prefersReduced) {
      statement && markRevealed(statement);
      eyebrow && markRevealed(eyebrow);
      cta && markRevealed(cta);
      stats.forEach((el) => markRevealed(el));
      return;
    }

    if (statement) {
      statement.dataset.reveal = "lines";
      const split = SplitText.create(statement, {
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
      cleanups.push(() => split.revert());
      cleanups.push(
        observeRevealOnce(statement, {
          startTop: REVEAL_START.studioIntro,
          onEnter: () => markRevealed(statement),
        })
      );
    }

    if (eyebrow) {
      cleanups.push(
        observeRevealOnce(eyebrow, {
          startTop: REVEAL_START.studioIntro,
          onEnter: () => markRevealed(eyebrow),
        })
      );
    }

    stats.forEach((el) => {
      cleanups.push(
        observeRevealOnce(el, {
          startTop: REVEAL_START.studioStats,
          onEnter: () => markRevealed(el),
        })
      );
    });

    if (cta) {
      cleanups.push(
        observeRevealOnce(cta, {
          startTop: REVEAL_START.studioStats,
          onEnter: () => markRevealed(cta),
        })
      );
    }

    const countEls = section.querySelectorAll<HTMLElement>("[data-count]");
    if (countEls.length) {
      const target = Number(countEls[0].dataset.count ?? "2035");
      const counter = { value: 2000 };
      let counterPlayed = false;

      const runCounter = () => {
        if (counterPlayed) return;
        counterPlayed = true;
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => {
            const text = String(Math.round(counter.value));
            countEls.forEach((el) => {
              el.textContent = text;
            });
          },
        });
      };

      cleanups.push(
        observeRevealOnce(countEls[0], {
          startTop: REVEAL_START.studioStats,
          onEnter: runCounter,
        })
      );
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      className="studio"
      id="netzwerk"
      ref={root}
      aria-labelledby="studio-heading"
    >
      <div className="studio__inner">
        <div className="studio__top">
          <h2
            className="studio__eyebrow"
            id="studio-heading"
            data-studio-eyebrow
          >
            <span className="studio__line-clip">
              <span className="studio__line-rise">
                <span className="studio__mark" aria-hidden="true" />
                Netzwerk
              </span>
            </span>
          </h2>

          <div className="studio__intro">
            <p className="studio__statement" data-studio-statement>
              Wo Wirtschaft, Politik und Kultur zusammenkommen, entstehen die
              Projekte, die Berlin wirklich weiterbringen.
            </p>
            <dl
              className="studio__stats studio__stats--intro"
              data-studio-stats
            >
              <ExpoVision />
            </dl>
            <FillButton
              href="/netzwerk"
              className="btn-fill btn-fill--studio-cta studio__cta"
              data-studio-cta
            >
              Zum Netzwerk
            </FillButton>
          </div>
        </div>

        <div className="studio__body">
          <div className="studio__viz">
            <StudioRadialGraphic />
          </div>

          <dl className="studio__stats studio__stats--panel" data-studio-stats>
            <ExpoVision />
          </dl>
        </div>
      </div>
    </section>
  );
}
