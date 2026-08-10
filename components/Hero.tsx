"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { fitHeroTitle } from "@/lib/fit-display-text";
import {
  hasHeroIntroCssPlayed,
  markHeroIntroCssPlayed,
} from "@/lib/hero-intro";
import { useIntro } from "@/lib/intro-context";
import { HERO_IMAGE } from "@/lib/intro-sequence";
import { scrollToTarget } from "@/lib/lenis-store";
import { withBasePath } from "@/lib/site-path";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const primaryRef = useRef<HTMLSpanElement>(null);
  const secondaryRef = useRef<HTMLSpanElement>(null);
  const { done } = useIntro();
  const [cssIntro, setCssIntro] = useState(false);

  const introPlayed = hasHeroIntroCssPlayed();
  const showVisible = done && introPlayed && !cssIntro;

  useEffect(() => {
    if (done && !hasHeroIntroCssPlayed()) {
      markHeroIntroCssPlayed();
      setCssIntro(true);
    }
  }, [done]);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const fit = () => {
      if (cancelled || !primaryRef.current || !secondaryRef.current) return;
      fitHeroTitle(primaryRef.current, secondaryRef.current);
    };

    const run = async () => {
      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }
      fit();
      raf = window.requestAnimationFrame(fit);
    };

    void run();

    const onResize = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(fit);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [done]);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl || !done) return;

    const img = rootEl.querySelector<HTMLElement>("[data-hero-img]");
    if (!img) return;

    const tween = gsap.fromTo(
      img,
      { yPercent: 0 },
      {
        yPercent: 4,
        ease: "none",
        force3D: true,
        immediateRender: false,
        scrollTrigger: {
          trigger: rootEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [done]);

  const scrollDown = () => {
    scrollToTarget("#sectors");
  };

  return (
    <section
      className={`hero${cssIntro ? " is-intro" : ""}${showVisible ? " is-visible" : ""}`}
      ref={root}
      aria-labelledby="hero-title"
    >
      <div className="hero__media" data-hero-media aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt=""
          data-hero-img
          fetchPriority="high"
          draggable={false}
        />
        <div className="hero__shade" />
      </div>

      <h1 className="hero__title" id="hero-title" data-hero-title>
        <span className="hero__title-mask">
          <span
            className="hero__title-line hero__title-line--primary display"
            data-hero-line-inner
            ref={primaryRef}
          >
            Konstantin
          </span>
        </span>
        <span className="hero__title-mask hero__title-mask--secondary">
          <span
            className="hero__title-line hero__title-line--secondary display"
            data-hero-line-inner
            ref={secondaryRef}
          >
            Patsalides
          </span>
        </span>
      </h1>

      <a
        className="hero__reel"
        href="#work"
        data-hero-ui
        aria-label="Watch the studio reel"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath("/img/reel.jpg")} alt="" draggable={false} loading="lazy" />
        <span className="hero__reel-label">Reel ’26</span>
      </a>

      <button
        type="button"
        className="hero__scroll"
        data-hero-ui
        onClick={scrollDown}
      >
        Scroll
      </button>
    </section>
  );
}
