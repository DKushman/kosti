"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import FillButton from "@/components/FillButton";
import StudioRadialGraphic from "@/components/graphics/StudioRadialGraphic";

/**
 * Studio / Netzwerk – fester dunkler Block.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) return;

      gsap.from("[data-studio-intro]", {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          once: true,
        },
      });

      const countEl = section.querySelector<HTMLElement>("[data-count]");
      if (countEl) {
        const target = Number(countEl.dataset.count ?? "2035");
        const counter = { value: 2000 };
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: countEl,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            countEl.textContent = String(Math.round(counter.value));
          },
        });
      }

      gsap.from("[data-studio-stats]", {
        y: 32,
        autoAlpha: 0,
        duration: 0.85,
        clearProps: "all",
        scrollTrigger: {
          trigger: "[data-studio-stats]",
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: root }
  );

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

          <dl className="studio__stats" data-studio-stats>
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
