"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { preload } from "react-dom";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "@/lib/intro-context";
import { onPageEnter } from "@/lib/page-enter";
import { imageSet } from "@/lib/images";
import TransitionLink from "@/components/TransitionLink";
import { PRELOADER_CURTAIN_MS } from "@/lib/intro-sequence";
import { EASE_PRELOADER_HANDOFF } from "@/lib/motion";

const PORTRAIT = imageSet("konstantin-portrait");
const PORTRAIT_SIZES = "(max-width: 900px) 88vw, 28vmin";
const NAME_LOOP = "Konstantin Patsalides — ";
const NAME_COPIES = 6;
const INTRO_MS = PRELOADER_CURTAIN_MS;
const INTRO_MARQUEE_FROM = 148;
const BASE_DRIFT = 148;
const INTRO_DRIFT_MULT = 1.44;
const SCROLL_MARQUEE = -1120;
const SCROLL_SCRUB = 0.28;
const PARALLAX_Y = 16;
const PARALLAX_SCALE = 0.055;
const MOBILE_MQ = "(max-width: 900px)";

const HERO_BUILDS = [
  { label: "AG City", href: "/projekte/ag-city" },
  { label: "HYGH", href: "/projekte/hygh" },
  { label: "MyBLN", href: "/projekte/mybln" },
] as const;

const HERO_LEDE =
  "Diese Metropole zu gestalten ist mein Ziel – und meine Aufgabe. Ich bin Unternehmer aus Überzeugung und Netzwerker aus Leidenschaft.";

function isMobileHero() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function measureMarqueeUnit(track: HTMLElement) {
  const items = track.querySelectorAll<HTMLElement>(".hero__marquee-item");
  if (items.length >= 2) {
    const step = items[1]!.offsetLeft - items[0]!.offsetLeft;
    if (step > 1) return step;
  }
  const first = items[0];
  if (first) return first.getBoundingClientRect().width;
  return track.scrollWidth / NAME_COPIES;
}

/** Keep translateX in (-unit, 0] for seamless loop */
function wrapMarqueeTranslate(x: number, unit: number) {
  if (unit <= 0) return 0;
  let m = x % unit;
  if (m > 0) m -= unit;
  return m;
}

function MarqueeItems() {
  return (
    <>
      {Array.from({ length: NAME_COPIES }, (_, index) => (
        <span className="hero__marquee-item" key={index}>
          {NAME_LOOP}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const introStarted = useRef(false);
  const pathname = usePathname();
  const { done } = useIntro();

  preload(PORTRAIT.src, {
    as: "image",
    fetchPriority: "high",
    imageSrcSet: PORTRAIT.srcSet,
    imageSizes: PORTRAIT_SIZES,
  });

  useLayoutEffect(() => {
    if (!done) return;
    const portrait = portraitRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!portrait || !track || introStarted.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    if (isMobileHero()) {
      gsap.set(portrait, { yPercent: 0, scale: 1 });
      stage?.style.removeProperty("--hero-marquee-x");
      return;
    }

    gsap.set(portrait, { yPercent: 4.8, scale: 1.058 });
    stage?.style.setProperty("--hero-marquee-x", `${INTRO_MARQUEE_FROM}px`);
  }, [done, pathname]);

  useEffect(() => {
    if (!done) return;

    let teardown: (() => void) | undefined;

    const startIntro = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      const portrait = portraitRef.current;
      const root = rootRef.current;
      if (!track || !portrait || !root || introStarted.current) return;
      introStarted.current = true;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const setMarqueeX = (px: number) => {
        stage?.style.setProperty("--hero-marquee-x", `${px}px`);
      };

      if (prefersReduced) {
        setMarqueeX(0);
        return;
      }

      const mobile = isMobileHero();
      let unit = 0;
      let portraitIntroDone = mobile;
      let raf = 0;
      let last = performance.now();
      const introDriftUntil = performance.now() + INTRO_MS;

      const motion = {
        drift: 0,
        scrollX: 0,
        introOffset: mobile ? 0 : INTRO_MARQUEE_FROM,
      };

      const measure = () => {
        unit = measureMarqueeUnit(track);
      };

      const renderMarquee = () => {
        if (unit <= 0) return;
        const total = wrapMarqueeTranslate(
          motion.drift + motion.scrollX + motion.introOffset,
          unit
        );
        setMarqueeX(total);
      };

      measure();
      requestAnimationFrame(() => {
        measure();
        renderMarquee();
      });

      if (mobile) {
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
      } else {
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
      }

      let scrollFx: ScrollTrigger | undefined;
      if (!mobile) {
        scrollFx = ScrollTrigger.create({
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
      }

      renderMarquee();

      let running = false;
      const tick = (now: number) => {
        if (!running) return;
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

      const startLoop = () => {
        if (running) return;
        running = true;
        last = performance.now();
        raf = window.requestAnimationFrame(tick);
      };
      const stopLoop = () => {
        running = false;
        window.cancelAnimationFrame(raf);
      };
      const visibility = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? startLoop() : stopLoop()),
      });
      if (visibility.isActive) startLoop();

      const onResize = () => {
        measure();
        renderMarquee();
        scrollFx?.refresh();
      };
      window.addEventListener("resize", onResize);

      teardown = () => {
        stopLoop();
        visibility.kill();
        window.removeEventListener("resize", onResize);
        scrollFx?.kill();
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
      className="hero hero--paper"
      id="hero"
      ref={rootRef}
      aria-labelledby="hero-title"
    >
      <div className="hero__viewport">
        <p className="hero__lede hero__lede--stage">{HERO_LEDE}</p>

        <div className="hero__stage" ref={stageRef}>
        <div className="hero__marquee-band hero__marquee-band--base" aria-hidden="true">
          <div className="hero__marquee hero__marquee--base">
            <span className="hero__marquee-track" ref={trackRef}>
              <MarqueeItems />
            </span>
          </div>
        </div>

        <figure className="hero__portrait" id="hero-portrait">
          <picture>
            <source type="image/webp" srcSet={PORTRAIT.srcSet} sizes={PORTRAIT_SIZES} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={portraitRef}
              src={PORTRAIT.src}
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

        <h1 className="hero__title" id="hero-title">
          <span className="visually-hidden">Konstantin Patsalides</span>
          <div className="hero__marquee-band hero__marquee-band--over" aria-hidden="true">
            <div className="hero__marquee hero__marquee--on-photo">
              <span className="hero__marquee-track">
                <MarqueeItems />
              </span>
            </div>
          </div>
        </h1>
        </div>

        <div className="hero__foot" id="hero-bottom">
        <p className="hero__loc">
          <LocationPin />
          <span>Berlin, Germany</span>
        </p>

        <p className="hero__lede hero__lede--foot">{HERO_LEDE}</p>

        <div className="hero__builds">
          <p className="hero__builds-label">Meine Baustellen</p>
          <p className="hero__builds-list">
            {HERO_BUILDS.map((item, i) => (
              <span key={item.href}>
                {i > 0 ? ", " : null}
                <TransitionLink href={item.href}>{item.label}</TransitionLink>
              </span>
            ))}
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}

function LocationPin() {
  return (
    <svg
      className="hero__loc-pin"
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
      />
    </svg>
  );
}
