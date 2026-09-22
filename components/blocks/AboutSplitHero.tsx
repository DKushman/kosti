"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro-context";
import { peekPending } from "@/lib/curtain";
import { onPageEnter } from "@/lib/page-enter";
import Pic from "@/components/Pic";
import KostiFace from "@/components/graphics/KostiFace";

/**
 * Über-mich opener: statisches Gesicht über „Kosti“, darunter „Wer ist“.
 */
export default function AboutSplitHero() {
  const root = useRef<HTMLElement>(null);
  const kostiPart = useRef<HTMLSpanElement>(null);
  const faceRise = useRef<HTMLSpanElement>(null);
  const subPart = useRef<HTMLSpanElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { done: introDone } = useIntro();
  const enterPlayed = useRef(false);

  useGSAP(
    () => {
      enterPlayed.current = false;

      const kosti = kostiPart.current;
      const face = faceRise.current;
      const sub = subPart.current;
      const mediaEl = media.current;
      if (!kosti || !sub || !mediaEl) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const playEnter = () => {
        if (enterPlayed.current) return;
        enterPlayed.current = true;

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.06,
        });
        tl.to(kosti, { yPercent: 0, duration: 0.88 }, 0);
        if (face) {
          tl.fromTo(
            face,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.82, ease: "power4.out" },
            0.82
          );
        }
        tl.to(sub, { yPercent: 0, duration: 0.88 }, 0.14);
        tl.fromTo(
          mediaEl,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "power4.inOut" },
          0.12
        );
      };

      if (reduced) {
        gsap.set([kosti, sub, face], { clearProps: "all" });
        gsap.set(mediaEl, { clearProps: "all" });
        enterPlayed.current = true;
        return;
      }

      gsap.set([kosti, sub], { yPercent: 108 });
      if (face) gsap.set(face, { yPercent: 110 });
      gsap.set(mediaEl, { clipPath: "inset(100% 0% 0% 0%)" });

      const attemptEnter = () => {
        if (!introDone || enterPlayed.current) return;
        requestAnimationFrame(() => playEnter());
      };

      const offPageEnter = onPageEnter(attemptEnter, pathname);

      if (!peekPending() && introDone) {
        attemptEnter();
      }

      return () => {
        offPageEnter();
      };
    },
    { scope: root, dependencies: [introDone, pathname] }
  );

  return (
    <header ref={root} className="about-hero">
      <div className="about-hero__copy">
        <h1 className="about-hero__title display">
          <span className="about-hero__kosti-zone">
            <span className="about-hero__kosti-wrap">
              <span className="about-hero__kosti-slot" aria-hidden="true">
                <span ref={faceRise} className="about-hero__kosti-rise">
                  <KostiFace className="about-hero__kosti-face" />
                </span>
              </span>
              <span className="about-hero__title-line about-hero__title-line--kosti">
                <span ref={kostiPart} className="about-hero__title-kosti about-hero__title-part">
                  Kosti
                </span>
              </span>
            </span>
          </span>
          <span className="about-hero__title-line about-hero__title-line--sub">
            <span ref={subPart} className="about-hero__title-sub about-hero__title-part">
              Wer ist
            </span>
          </span>
        </h1>
      </div>
      <div ref={media} className="about-hero__media">
        <Pic
          name="kosti"
          sizes="(max-width: 900px) 100vw, 50vw"
          alt="Konstantin Patsalides"
          priority
        />
      </div>
    </header>
  );
}
