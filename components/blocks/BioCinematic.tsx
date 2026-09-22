"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SplitText } from "@/lib/gsap";
import { ABOUT } from "@/lib/content/about";
import { withBasePath } from "@/lib/site-path";
import {
  REVEAL_START,
  isInInitialView,
  markRevealed,
  observeRevealOnce,
} from "@/lib/reveal-io";

const IMG_ZYPERN = withBasePath("/img/pexels-mikhail-nilov-8332863.webp");
const IMG_BERLIN = withBasePath(
  "/img/pexels-marcel-condurachi-765466373-35828097.webp"
);

type HoverWordProps = {
  id: string;
  children: string;
  imageSrc: string;
  imageAlt: string;
};

function BioInlineWord({ id, children, imageSrc, imageAlt }: HoverWordProps) {
  return (
    <span className="bio-word bio-word--inline" id={id}>
      <span className="bio-word__text">{children}</span>
      <span className="bio-word__thumb" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          width={440}
          height={330}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </span>
    </span>
  );
}

function BioHoverWord({ id, children, imageSrc, imageAlt }: HoverWordProps) {
  const [showPreview, setShowPreview] = useState(false);

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            width={440}
            height={330}
            loading="lazy"
            decoding="async"
          />
        </span>
      ) : null}
    </span>
  );
}

function BioLine({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <span className="bio-display__line-slot">
      <span className="bio-display__line-clip">
        <span
          className="bio-display__line"
          style={{ ["--line-i" as string]: String(index) }}
        >
          {children}
        </span>
      </span>
    </span>
  );
}

/**
 * Biografie: 2×2-Grid (oben links h2, unten rechts Fließtext), Hover-Bilder über Wörtern.
 */
export default function BioCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const main = mainRef.current;
    if (!section || !main) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const headLines = section.querySelectorAll<HTMLElement>(".bio-display__line");
    headLines.forEach((line, i) => {
      line.style.setProperty("--line-i", String(i));
    });

    let mainSplit: ReturnType<typeof SplitText.create> | undefined;

    const arm = () => {
      mainSplit = SplitText.create(main, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "none",
        onSplit: (self: { lines: Element[] }) => {
          self.lines.forEach((line, i) => {
            (line as HTMLElement).style.setProperty("--line-i", String(i));
          });
        },
      });
      requestAnimationFrame(() => markRevealed(section));
    };

    let cleanup = () => {};

    if (isInInitialView(section)) {
      arm();
    } else {
      cleanup = observeRevealOnce(section, {
        startTop: REVEAL_START.bio,
        onEnter: arm,
      });
    }

    return () => {
      cleanup();
      mainSplit?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="biografie" className="bio-display">
      <div className="bio-display__grid" id="bio-display-grid">
        <div className="bio-display__lead" id="bio-display-lead">
          <h2 id="bio-display-heading" className="bio-display__headline">
            <BioLine index={0}>
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
            <BioLine index={1}>prägen meine</BioLine>
            <BioLine index={2}>persönliche</BioLine>
            <BioLine index={3}>Geschichte.</BioLine>
          </h2>
        </div>

        <p ref={mainRef} id="bio-display-main" className="bio-display__main">
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
