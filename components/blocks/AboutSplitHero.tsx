"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro-context";
import { peekPending } from "@/lib/curtain";
import { onPageEnter } from "@/lib/page-enter";
import Pic from "@/components/Pic";
import KostiFace from "@/components/graphics/KostiFace";

const FACE_W = 80;
const FACE_H = 80;

const EYE = {
  left: { x: 30.6, y: 31.2 },
  right: { x: 49.4, y: 31.2 },
} as const;

const LOOK = { x: 0, y: 0 };
const PUPIL_MAX = 2.2;

function pupilOffset(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  eyeX: number,
  eyeY: number
) {
  const rect = svg.getBoundingClientRect();
  const scaleX = FACE_W / rect.width;
  const scaleY = FACE_H / rect.height;
  const ex = rect.left + (eyeX / FACE_W) * rect.width;
  const ey = rect.top + (eyeY / FACE_H) * rect.height;
  const dx = (clientX - ex) * scaleX * 0.28;
  const dy = (clientY - ey) * scaleY * 0.28;
  const len = Math.hypot(dx, dy) || 1;
  const clamped = Math.min(PUPIL_MAX, len);
  return {
    x: (dx / len) * clamped,
    y: (dy / len) * clamped,
  };
}

/**
 * Über-mich opener: Desktop — Gesicht folgt Cursor; Mobile — Reveal nach „Kosti“.
 */
export default function AboutSplitHero() {
  const root = useRef<HTMLElement>(null);
  const kostiPart = useRef<HTMLSpanElement>(null);
  const subPart = useRef<HTMLSpanElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const faceSvg = useRef<SVGSVGElement>(null);
  const leftPupil = useRef<SVGCircleElement>(null);
  const rightPupil = useRef<SVGCircleElement>(null);
  const pathname = usePathname();
  const { done: introDone } = useIntro();
  const enterPlayed = useRef(false);
  const iconRef = useRef<HTMLSpanElement>(null);
  const iconEnterRef = useRef<HTMLSpanElement>(null);
  const iconRaf = useRef<number | null>(null);
  const pendingPointer = useRef<{ x: number; y: number } | null>(null);

  const ICON_Y_MIN = 0;
  const ICON_Y_MAX = 62;
  const ICON_Y_DEFAULT = 35;

  const isMobileLayout = useCallback(
    () => window.matchMedia("(max-width: 900px)").matches,
    []
  );

  const setIconOffset = useCallback((yPercent: number) => {
    const icon = iconRef.current;
    if (!icon || isMobileLayout()) return;
    icon.style.transform = `translate3d(0, ${yPercent}%, 0)`;
  }, [isMobileLayout]);

  const updateIconFromPointer = useCallback(
    (clientY: number) => {
      if (isMobileLayout()) return;
      const hero = root.current;
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      if (r.height <= 0) return;
      const t = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      const y = ICON_Y_MIN + t * (ICON_Y_MAX - ICON_Y_MIN);
      setIconOffset(y);
    },
    [isMobileLayout, setIconOffset]
  );

  const resetEyes = useCallback(() => {
    const t = `translate(${LOOK.x} ${LOOK.y})`;
    leftPupil.current?.setAttribute("transform", t);
    rightPupil.current?.setAttribute("transform", t);
  }, []);

  const moveEyes = useCallback((clientX: number, clientY: number) => {
    if (isMobileLayout()) return;
    const svg = faceSvg.current;
    if (!svg || !leftPupil.current || !rightPupil.current) return;
    const l = pupilOffset(svg, clientX, clientY, EYE.left.x, EYE.left.y);
    const r = pupilOffset(svg, clientX, clientY, EYE.right.x, EYE.right.y);
    leftPupil.current.setAttribute("transform", `translate(${l.x} ${l.y})`);
    rightPupil.current.setAttribute("transform", `translate(${r.x} ${r.y})`);
  }, [isMobileLayout]);

  const schedulePointer = useCallback(
    (clientX: number, clientY: number) => {
      if (isMobileLayout()) return;
      pendingPointer.current = { x: clientX, y: clientY };
      if (iconRaf.current != null) return;
      iconRaf.current = requestAnimationFrame(() => {
        iconRaf.current = null;
        const p = pendingPointer.current;
        const hero = root.current;
        if (!p || !hero) return;
        const r = hero.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        moveEyes(p.x, p.y);
        updateIconFromPointer(p.y);
      });
    },
    [isMobileLayout, moveEyes, updateIconFromPointer]
  );

  const onHeroPointer = (e: PointerEvent<HTMLElement>) => {
    if (isMobileLayout()) return;
    if (e.pointerType === "touch" && e.buttons === 0) return;
    schedulePointer(e.clientX, e.clientY);
  };

  const onHeroLeave = () => {
    if (isMobileLayout()) return;
    resetEyes();
    setIconOffset(ICON_Y_DEFAULT);
  };

  useGSAP(
    () => {
      enterPlayed.current = false;

      const kosti = kostiPart.current;
      const sub = subPart.current;
      const mediaEl = media.current;
      const iconEnter = iconEnterRef.current;
      const iconEl = iconRef.current;
      if (!kosti || !sub || !mediaEl) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const mobileHero = window.matchMedia("(max-width: 900px)").matches;

      const playEnter = () => {
        if (enterPlayed.current) return;
        enterPlayed.current = true;

        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.06,
        });
        tl.to(kosti, { yPercent: 0, duration: 0.88 }, 0);
        if (iconEnter && iconEl) {
          if (mobileHero) {
            tl.fromTo(
              iconEnter,
              { yPercent: 110 },
              { yPercent: 0, duration: 0.82, ease: "power4.out" },
              0.82
            );
          } else {
            tl.to(
              iconEnter,
              { yPercent: 0, duration: 0.82, ease: "power4.out" },
              0.82
            );
            tl.to(
              iconEl,
              { autoAlpha: 1, duration: 0.82, ease: "power4.out" },
              0.82
            );
          }
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
        gsap.set([kosti, sub, iconEnter, iconEl], { clearProps: "all" });
        gsap.set(mediaEl, { clearProps: "all" });
        enterPlayed.current = true;
        return;
      }

      gsap.set([kosti, sub], { yPercent: 108 });
      if (iconEnter) {
        gsap.set(iconEnter, { yPercent: mobileHero ? 110 : 115 });
      }
      if (iconEl && !mobileHero) {
        gsap.set(iconEl, { autoAlpha: 0 });
        setIconOffset(ICON_Y_DEFAULT);
      }
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
    { scope: root, dependencies: [introDone, pathname, setIconOffset] }
  );

  return (
    <header
      ref={root}
      className="about-hero"
      onPointerMove={onHeroPointer}
      onPointerLeave={onHeroLeave}
    >
      <div className="about-hero__copy">
        <h1 className="about-hero__title display">
          <span className="about-hero__kosti-zone">
            <span className="about-hero__kosti-wrap">
              <span className="about-hero__kosti-slot" aria-hidden="true">
                <span ref={iconRef} className="about-hero__kosti-icon">
                  <span ref={iconEnterRef} className="about-hero__kosti-icon-motion">
                    <KostiFace
                      className="about-hero__kosti-face"
                      svgRef={faceSvg}
                      leftPupilRef={leftPupil}
                      rightPupilRef={rightPupil}
                    />
                  </span>
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
