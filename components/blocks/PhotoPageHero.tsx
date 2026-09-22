"use client";

import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro-context";
import { peekPending } from "@/lib/curtain";
import { onPageEnter } from "@/lib/page-enter";
import { SITE } from "@/lib/site";
import { imageSetForPath } from "@/lib/images";

const HERO_SIZES = "100vw";

export type PhotoPageHeroProps = {
  imageSrc: string;
  titleLineA: string;
  titleLineB?: string;
  /** Gap between split title parts (e.g. „Mein“ + „Netzwerk“). */
  titleWordGap?: boolean;
  /** Stack the two title lines (longer headlines). */
  titleStacked?: boolean;
  scrollHref: string;
  scrollLabel: string;
  tagline?: string;
};

/**
 * Full-bleed photo hero (Projekte / Netzwerk): slot title enter, sticky + parallax.
 */
export default function PhotoPageHero({
  imageSrc,
  titleLineA,
  titleLineB,
  titleWordGap = false,
  titleStacked = false,
  scrollHref,
  scrollLabel,
  tagline = SITE.claim,
}: PhotoPageHeroProps) {
  const hero = useRef<HTMLElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const titlePartA = useRef<HTMLSpanElement>(null);
  const titlePartB = useRef<HTMLSpanElement>(null);
  const foot = useRef<HTMLDivElement>(null);
  const rule = useRef<HTMLHRElement>(null);
  const pathname = usePathname();
  const { done: introDone } = useIntro();
  const enterPlayed = useRef(false);
  const image = imageSetForPath(imageSrc);

  preload(image.src, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: image.srcSet || undefined,
    imageSizes: image.srcSet ? HERO_SIZES : undefined,
  });

  useGSAP(
    () => {
      enterPlayed.current = false;

      const partA = titlePartA.current;
      const partB = titlePartB.current;
      const footEl = foot.current;
      const ruleEl = rule.current;
      if (!partA || !footEl) return;
      if (titleLineB && !partB) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const playEnter = () => {
        if (enterPlayed.current) return;
        enterPlayed.current = true;

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.05,
        });
        tl.to(partA, { yPercent: 0, duration: 0.88 }, 0);
        if (partB) tl.to(partB, { yPercent: 0, duration: 0.88 }, 0.12);
        tl.to(footEl, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.38);

        if (ruleEl) {
          tl.to(ruleEl, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0.44);
        }
      };

      if (reduced) {
        gsap.set([partA, partB, footEl, ruleEl].filter(Boolean), { clearProps: "all" });
        enterPlayed.current = true;
        return;
      }

      gsap.set(partB ? [partA, partB] : [partA], { yPercent: 100 });
      gsap.set(footEl, { autoAlpha: 0, y: 16 });
      if (ruleEl) {
        gsap.set(ruleEl, { scaleX: 0, transformOrigin: "left center" });
      }

      const scheduleEnter = () => {
        requestAnimationFrame(() => playEnter());
      };

      const offPageEnter = onPageEnter(scheduleEnter, pathname);

      if (!peekPending()) {
        requestAnimationFrame(() => {
          if (!enterPlayed.current) playEnter();
        });
      }

      return () => {
        offPageEnter();
      };
    },
    { dependencies: [introDone, pathname, titleLineB] }
  );

  useEffect(() => {
    const el = hero.current;
    const layerEl = layer.current;
    if (!el || !layerEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const supportsTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline", "view()");
    if (supportsTimeline) return;

    const tween = gsap.fromTo(
      layerEl,
      { scale: 1, y: 0, willChange: "transform" },
      {
        scale: 1.1,
        y: 0,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onToggle: (self) =>
            gsap.set(layerEl, {
              willChange: self.isActive ? "transform" : "auto",
            }),
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [introDone]);

  return (
    <header ref={hero} className="photo-hero photo-hero--sticky">
      <div ref={layer} className="photo-hero__layer">
        <div className="photo-hero__media" aria-hidden="true">
          <picture>
            {image.srcSet ? (
              <source type="image/webp" srcSet={image.srcSet} sizes={HERO_SIZES} />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt=""
              width={image.width || undefined}
              height={image.height || undefined}
              data-hero-img
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <div className="photo-hero__shade" aria-hidden="true" />

        <div className="photo-hero__foreground">
          <h1
            className={`photo-hero__title${titleWordGap ? " photo-hero__title--gap" : ""}${titleStacked ? " photo-hero__title--stack" : ""}${titleLineB ? "" : " photo-hero__title--single"}`}
          >
            <span className="photo-hero__title-line">
              <span ref={titlePartA} className="photo-hero__title-part">
                {titleLineA}
              </span>
            </span>
            {titleLineB ? (
              <span className="photo-hero__title-line">
                <span ref={titlePartB} className="photo-hero__title-part">
                  {titleLineB}
                </span>
              </span>
            ) : null}
          </h1>

          <div ref={foot} className="photo-hero__foot">
            <hr ref={rule} className="photo-hero__rule" />
            <div className="photo-hero__foot-row">
              <p className="photo-hero__tagline">{tagline}</p>
              <a className="photo-hero__scroll" href={scrollHref}>
                {scrollLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
