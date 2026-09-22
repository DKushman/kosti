"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Pic from "@/components/Pic";
import FillButton from "@/components/FillButton";

/**
 * Full-bleed-ish image band before the footer: footer headline + contact CTA.
 */
export default function PreFooterContact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (prefersReduced || isMobile) return;

      const media = root.current.querySelector<HTMLElement>(
        ".prefooter-contact__media"
      );
      if (!media) return;

      gsap.fromTo(
        media,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
            /* GPU layer only while the band is on screen */
            onToggle: (self) =>
              gsap.set(media, { willChange: self.isActive ? "transform" : "auto" }),
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      className="prefooter-contact"
      id="kontakt"
      ref={root}
      aria-labelledby="prefooter-contact-heading"
    >
      <div className="prefooter-contact__frame">
        <div className="prefooter-contact__media" aria-hidden="true">
          <Pic
            name="hero"
            sizes="98vw"
            alt=""
          />
        </div>
        <div className="prefooter-contact__scrim" aria-hidden="true" />
        <div className="prefooter-contact__content">
          <p className="prefooter-contact__eyebrow eyebrow">Kontakt</p>
          <h2 className="prefooter-contact__title" id="prefooter-contact-heading">
            Berlin entsteht
            <br />
            im Austausch.
          </h2>
          <FillButton
            href="/kontakt"
            className="btn-fill btn-fill--on-dark prefooter-contact__cta"
          >
            Kontaktieren
          </FillButton>
        </div>
      </div>
    </section>
  );
}
