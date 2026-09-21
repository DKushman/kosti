"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { preload } from "react-dom";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/lib/intro-context";
import { onPageEnter } from "@/lib/page-enter";
import { withBasePath } from "@/lib/site-path";
import TransitionLink from "@/components/TransitionLink";
import { HERO_PARTNER_LOGOS } from "@/lib/partner-logos";
import { PRELOADER_CURTAIN_MS } from "@/lib/intro-sequence";
import { EASE_PRELOADER_HANDOFF } from "@/lib/motion";

const PORTRAIT_WEBP = withBasePath("/img/konstantin-portrait.webp");
const PORTRAIT_JPG = withBasePath("/img/konstantin-portrait.jpg");
const NAME_LOOP = "Patsalides — Konstantin";
const NAME_COPIES = 4;
const INTRO_MS = PRELOADER_CURTAIN_MS;
const INTRO_MARQUEE_FROM = 148;
const BASE_DRIFT = 76;
const INTRO_DRIFT_MULT = 1.44;
const SCROLL_MARQUEE = -720;
const SCROLL_SCRUB = 0.42;
const PARALLAX_Y = 26;
const PARALLAX_SCALE = 0.092;
const MOBILE_MQ = "(max-width: 900px)";

function isMobileHero() {
  return window.matchMedia(MOBILE_MQ).matches;
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const introStarted = useRef(false);
  const pathname = usePathname();
  const { done } = useIntro();

  preload(PORTRAIT_WEBP, { as: "image", fetchPriority: "high" });

  useLayoutEffect(() => {
    if (!done) return;
    const portrait = portraitRef.current;
    const track = trackRef.current;
    if (!portrait || !track || introStarted.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    if (isMobileHero()) {
      gsap.set(portrait, { yPercent: 0, scale: 1 });
      track.style.removeProperty("transform");
      return;
    }

    gsap.set(portrait, { yPercent: 4.8, scale: 1.058 });
    track.style.transform = `translate3d(${INTRO_MARQUEE_FROM}px, 0, 0)`;
  }, [done, pathname]);

  useEffect(() => {
    if (!done) return;

    let teardown: (() => void) | undefined;

    const startIntro = () => {
      const track = trackRef.current;
      const portrait = portraitRef.current;
      const root = rootRef.current;
      if (!track || !portrait || !root || introStarted.current) return;
      introStarted.current = true;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        track.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      if (isMobileHero()) {
        track.style.removeProperty("transform");
        track.classList.add("hero__marquee-track--css-marquee");
        gsap.fromTo(
          portrait,
          { yPercent: 5, scale: 1.04 },
          {
            yPercent: 0,
            scale: 1,
            duration: INTRO_MS / 1000,
            ease: EASE_PRELOADER_HANDOFF,
          }
        );
        teardown = () => {
          track.classList.remove("hero__marquee-track--css-marquee");
          gsap.killTweensOf(portrait);
        };
        return;
      }

    let unit = 0;
    let portraitIntroDone = false;
    let raf = 0;
    let last = performance.now();
    const introDriftUntil = performance.now() + INTRO_MS;

    /** drift = endless left; introOffset eases in from preloader (no pause) */
    const motion = {
      drift: 0,
      scrollX: 0,
      introOffset: INTRO_MARQUEE_FROM,
    };

    const measure = () => {
      unit = track.scrollWidth / NAME_COPIES;
    };

    measure();

    const renderMarquee = () => {
      if (unit <= 0) return;
      let total = motion.drift + motion.scrollX + motion.introOffset;
      while (total <= -unit) total += unit;
      while (total > 0) total -= unit;
      track.style.transform = `translate3d(${total}px, 0, 0)`;
    };

    gsap.set(portrait, { yPercent: 4.8, scale: 1.058 });

    gsap.to(portrait, {
      yPercent: 0,
      scale: 1,
      duration: INTRO_MS / 1000,
      ease: EASE_PRELOADER_HANDOFF,
      onComplete: () => {
        portraitIntroDone = true;
      },
    });

    gsap.to(motion, {
      introOffset: 0,
      duration: INTRO_MS / 1000,
      ease: EASE_PRELOADER_HANDOFF,
      onUpdate: renderMarquee,
    });

    const scrollFx = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom top",
      scrub: SCROLL_SCRUB,
      onUpdate: (self) => {
        const p = self.progress;
        motion.scrollX = p * SCROLL_MARQUEE;
        renderMarquee();

        if (portraitIntroDone) {
          gsap.set(portrait, {
            yPercent: p * PARALLAX_Y,
            scale: 1 + p * PARALLAX_SCALE,
          });
        }
      },
    });

    renderMarquee();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.064);
      last = now;
      if (unit > 0) {
        const driftSpeed =
          now < introDriftUntil ? BASE_DRIFT * INTRO_DRIFT_MULT : BASE_DRIFT;
        motion.drift -= driftSpeed * dt;
        renderMarquee();
      }
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    const onResize = () => {
      measure();
      renderMarquee();
      scrollFx.refresh();
    };
    window.addEventListener("resize", onResize);

      teardown = () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        scrollFx.kill();
        gsap.killTweensOf(motion);
        gsap.killTweensOf(portrait);
      };
    };

    const offPageEnter = onPageEnter(() => {
      requestAnimationFrame(() => {
        if (!introStarted.current) startIntro();
      });
    }, pathname);

    return () => {
      offPageEnter();
      teardown?.();
      introStarted.current = false;
    };
  }, [done, pathname]);

  return (
    <section
      className="hero"
      id="hero"
      ref={rootRef}
      aria-labelledby="hero-title"
    >
      <figure className="hero__portrait" id="hero-portrait">
        <picture>
          <source type="image/webp" srcSet={PORTRAIT_WEBP} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={portraitRef}
            src={PORTRAIT_JPG}
            alt="Konstantin Patsalides, Portrait"
            width={1600}
            height={1600}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            draggable={false}
            data-hero-portrait
          />
        </picture>
      </figure>

      <div className="hero__bottom" id="hero-bottom">
        <div className="hero__meta">
          <div className="hero__role-box hero__meta-box" id="hero-role">
            <p className="hero__role">
              <span className="hero__role-arrow" aria-hidden="true">
                <RoleArrow />
              </span>
              Unternehmer
              <br />
              Netzwerker &amp; Stadtgestalter
            </p>
          </div>

          <aside
            className="hero__logos hero__meta-box"
            id="hero-logos"
            aria-label="Projekte"
          >
            <ul className="hero__logos-list" role="list">
              {HERO_PARTNER_LOGOS.map((logo) => (
                <li key={logo.alt}>
                  <TransitionLink href={logo.href} className="hero__logo-link">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className={
                        logo.variant === "partner-wide"
                          ? "hero__logo hero__logo--footer"
                          : "hero__logo"
                      }
                      draggable={false}
                    />
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <h1 className="hero__title" id="hero-title">
          <span className="visually-hidden">Konstantin Patsalides</span>
          <span className="hero__marquee" aria-hidden="true">
            <span className="hero__marquee-track" ref={trackRef}>
              {Array.from({ length: NAME_COPIES }, (_, index) => (
                <span className="hero__marquee-item" key={index}>
                  {NAME_LOOP}
                </span>
              ))}
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}

function RoleArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h10v10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
