"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import FillButton from "@/components/FillButton";
import StudioRadialGraphic from "@/components/graphics/StudioRadialGraphic";
import {
  REVEAL_START,
  markRevealed,
  observeRevealOnce,
} from "@/lib/reveal-io";

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
    if (prefersReduced) return;

    const cleanups: (() => void)[] = [];

    const intro = section.querySelector<HTMLElement>("[data-studio-intro]");
    if (intro) {
      cleanups.push(
        observeRevealOnce(intro, {
          startTop: REVEAL_START.studioIntro,
          onEnter: () => markRevealed(intro),
        })
      );
    }

    section.querySelectorAll<HTMLElement>("[data-studio-stats]").forEach((el) => {
      cleanups.push(
        observeRevealOnce(el, {
          startTop: REVEAL_START.studioStats,
          onEnter: () => markRevealed(el),
        })
      );
    });

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
          <h2 className="studio__eyebrow" id="studio-heading">
            <span className="studio__mark" aria-hidden="true" />
            Netzwerk
          </h2>

          <div className="studio__intro" data-studio-intro>
            <p className="studio__statement">
              Wo Wirtschaft, Politik und Kultur zusammenkommen, entstehen die
              Projekte, die Berlin wirklich weiterbringen.
            </p>
            <dl className="studio__stats studio__stats--intro" data-studio-stats>
              <div>
                <dt>EXPO – die Vision</dt>
                <dd>
                  <span data-count={2035}>2035</span>
                </dd>
              </div>
            </dl>
            <FillButton
              href="/netzwerk"
              className="btn-fill btn-fill--studio-cta studio__cta"
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
            <div>
              <dt>EXPO – die Vision</dt>
              <dd>
                <span data-count={2035}>2035</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
