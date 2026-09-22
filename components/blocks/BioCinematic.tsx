"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { ABOUT } from "@/lib/content/about";
import { imageSetForPath } from "@/lib/images";

const IMG_ZYPERN = "/img/pexels-mikhail-nilov-8332863.webp";
const IMG_BERLIN = "/img/pexels-marcel-condurachi-765466373-35828097.webp";
/** Thumbnails render at 440px: never decode the full-size photo for them. */
const THUMB_SIZES = "440px";

type HoverWordProps = {
  id: string;
  children: string;
  imageSrc: string;
  imageAlt: string;
};

function BioInlineWord({ id, children, imageSrc, imageAlt }: HoverWordProps) {
  const img = imageSetForPath(imageSrc);
  return (
    <span className="bio-word bio-word--inline" id={id}>
      <span className="bio-word__text">{children}</span>
      <span className="bio-word__thumb" aria-hidden="true">
        <picture>
          {img.srcSet ? (
            <source type="image/webp" srcSet={img.srcSet} sizes={THUMB_SIZES} />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={imageAlt}
            width={440}
            height={330}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </picture>
      </span>
    </span>
  );
}

function BioHoverWord({ id, children, imageSrc, imageAlt }: HoverWordProps) {
  const [showPreview, setShowPreview] = useState(false);
  const img = imageSetForPath(imageSrc);

  return (
    <span
      className="bio-word"
      id={id}
      tabIndex={0}
      onMouseEnter={() => setShowPreview(true)}
      onFocus={() => setShowPreview(true)}
    >
      <span className="bio-word__text">{children}</span>
      {showPreview ? (
        <span className="bio-word__preview" aria-hidden="true">
          <picture>
            {img.srcSet ? (
              <source type="image/webp" srcSet={img.srcSet} sizes={THUMB_SIZES} />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={imageAlt}
              width={440}
              height={330}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </span>
      ) : null}
    </span>
  );
}

function BioLine({ children }: { children: ReactNode }) {
  return (
    <span className="bio-display__line-slot">
      <span className="bio-display__line-clip">
        <span className="bio-display__line">{children}</span>
      </span>
    </span>
  );
}

/**
 * Biografie: 2×2-Grid (oben links h2, unten rechts Fließtext), Hover-Bilder über Wörtern.
 */
export default function BioCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = headlineRef.current;
      const main = mainRef.current;
      if (!section || !heading || !main) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      const headLines = heading.querySelectorAll<HTMLElement>(
        ".bio-display__line"
      );
      if (!headLines.length) return;

      let scrollTrigger: ScrollTrigger | undefined;
      let mainSplit: ReturnType<typeof SplitText.create> | undefined;

      const setupAndPlay = () => {
        mainSplit = SplitText.create(main, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
          aria: "auto",
        });

        gsap.set(headLines, { yPercent: 110, force3D: true });
        gsap.set(mainSplit.lines, { yPercent: 110, force3D: true });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(
          headLines,
          { yPercent: 0, duration: 1.05, stagger: 0.09 },
          0
        );
        tl.to(
          mainSplit.lines,
          { yPercent: 0, duration: 0.95, stagger: 0.07 },
          0.2
        );
      };

      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 88%",
        once: true,
        onEnter: setupAndPlay,
      });

      return () => {
        scrollTrigger?.kill();
        mainSplit?.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="biografie" className="bio-display">
      <div className="bio-display__grid" id="bio-display-grid">
        <div className="bio-display__lead" id="bio-display-lead">
          <h2
            ref={headlineRef}
            id="bio-display-heading"
            className="bio-display__headline"
          >
            <BioLine>
              <BioInlineWord
                id="bio-word-berlin-head"
                imageSrc={IMG_BERLIN}
                imageAlt="Berlin"
              >
                Berlin
              </BioInlineWord>{" "}
              und{" "}
              <BioInlineWord
                id="bio-word-zypern-head"
                imageSrc={IMG_ZYPERN}
                imageAlt="Zypern"
              >
                Zypern
              </BioInlineWord>
            </BioLine>
            <BioLine>prägen meine</BioLine>
            <BioLine>persönliche</BioLine>
            <BioLine>Geschichte.</BioLine>
          </h2>
        </div>

        <p
          ref={mainRef}
          id="bio-display-main"
          className="bio-display__main"
        >
          Meine zypriotischen Wurzeln haben mir früh gezeigt, wie wertvoll
          unterschiedliche Perspektiven, Kulturen und internationale Beziehungen
          sind.{" "}
          <BioHoverWord
            id="bio-word-berlin-p2"
            imageSrc={IMG_BERLIN}
            imageAlt="Berlin"
          >
            Berlin
          </BioHoverWord>{" "}
          ist der Ort, an dem ich Ideen ausprobieren, Unternehmen kennenlernen,
          eigene Projekte aufbauen und außergewöhnliche Menschen zusammenbringen
          konnte. {ABOUT.bio[2]}
        </p>
      </div>
    </section>
  );
}
