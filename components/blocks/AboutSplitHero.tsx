"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "@/lib/intro-context";
import { peekPending } from "@/lib/curtain";
import { onPageEnter } from "@/lib/page-enter";
import Pic from "@/components/Pic";

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
 * Über-mich opener: „Kosti“ groß, darunter „Wer ist“ — icon peek on hover.
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
  const pendingIconY = useRef<number | null>(null);

  const ICON_Y_MIN = 0;
  const ICON_Y_MAX = 62;
  const ICON_Y_DEFAULT = 35;
  const ICON_Y_MOBILE_REST = 62;
  const ICON_MOBILE_VISIBLE_Y = 10;

  const isMobileLayout = useCallback(
    () => window.matchMedia("(max-width: 900px)").matches,
    []
  );

  const setIconOffset = useCallback(
    (yPercent: number) => {
      const icon = iconRef.current;
      if (!icon) return;
      icon.style.transform = `translate3d(0, ${yPercent}%, 0)`;
      if (isMobileLayout()) {
        const opacity =
          yPercent <= ICON_MOBILE_VISIBLE_Y
            ? 1
            : Math.max(0, 1 - (yPercent - ICON_MOBILE_VISIBLE_Y) / 22);
        icon.style.opacity = String(opacity);
        icon.style.visibility = opacity > 0.04 ? "visible" : "hidden";
      }
    },
    [isMobileLayout]
  );

  const updateIconFromPointer = useCallback(
    (clientY: number) => {
      const hero = root.current;
      if (!hero) return;

      const track =
        (isMobileLayout()
          ? hero.querySelector<HTMLElement>(".about-hero__kosti-wrap")
          : null) ?? hero;
      const r = track.getBoundingClientRect();
      if (r.height <= 0) return;
      const t = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
      const y = ICON_Y_MIN + t * (ICON_Y_MAX - ICON_Y_MIN);
      setIconOffset(y);
    },
    [isMobileLayout, setIconOffset]
  );

  const scheduleIconFromPointer = useCallback(
    (clientY: number) => {
      pendingIconY.current = clientY;
      if (iconRaf.current != null) return;
      iconRaf.current = requestAnimationFrame(() => {
        iconRaf.current = null;
        if (pendingIconY.current != null) {
          updateIconFromPointer(pendingIconY.current);
        }
      });
    },
    [updateIconFromPointer]
  );

  const resetEyes = useCallback(() => {
    const t = `translate(${LOOK.x} ${LOOK.y})`;
    leftPupil.current?.setAttribute("transform", t);
    rightPupil.current?.setAttribute("transform", t);
  }, []);

  const moveEyes = useCallback((clientX: number, clientY: number) => {
    const svg = faceSvg.current;
    if (!svg || !leftPupil.current || !rightPupil.current) return;
    const l = pupilOffset(svg, clientX, clientY, EYE.left.x, EYE.left.y);
    const r = pupilOffset(svg, clientX, clientY, EYE.right.x, EYE.right.y);
    leftPupil.current.setAttribute("transform", `translate(${l.x} ${l.y})`);
    rightPupil.current.setAttribute("transform", `translate(${r.x} ${r.y})`);
  }, []);

  const onHeroPointer = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch" && e.buttons === 0) return;
    const hero = root.current;
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    moveEyes(e.clientX, e.clientY);
    scheduleIconFromPointer(e.clientY);
  };

  const onHeroLeave = () => {
    resetEyes();
    setIconOffset(
      isMobileLayout() ? ICON_Y_MOBILE_REST : ICON_Y_DEFAULT
    );
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
            tl.add(() => {
              gsap.set(iconEnter, { yPercent: 0, clearProps: "transform" });
              gsap.set(iconEl, { autoAlpha: 0, clearProps: "visibility" });
              setIconOffset(ICON_Y_MOBILE_REST);
            }, 0.82);
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
        gsap.set([kosti, sub], { clearProps: "all" });
        gsap.set(mediaEl, { clearProps: "all" });
        if (iconEnter) gsap.set(iconEnter, { clearProps: "all" });
        if (iconEl) gsap.set(iconEl, { clearProps: "all" });
        enterPlayed.current = true;
        return;
      }

      gsap.set([kosti, sub], { yPercent: 108 });
      if (iconEnter) gsap.set(iconEnter, { yPercent: 115 });
      if (iconEl) {
        gsap.set(iconEl, { autoAlpha: 0 });
        if (mobileHero) {
          iconEl.style.opacity = "0";
          iconEl.style.visibility = "hidden";
          iconEl.style.transform = `translate3d(0, ${ICON_Y_MOBILE_REST}%, 0)`;
        }
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
                  <svg
                    ref={faceSvg}
                    id="about-hero-kosti-face"
                    className="about-hero__kosti-face"
                    viewBox="0 0 80 80"
                    fill="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <clipPath id="about-kosti-head-clip">
                        <circle cx="40" cy="32" r="25.5" />
                      </clipPath>
                      <clipPath id="about-kosti-eye-left">
                        <ellipse cx={EYE.left.x} cy={EYE.left.y} rx="5.6" ry="5.8" />
                      </clipPath>
                      <clipPath id="about-kosti-eye-right">
                        <ellipse cx={EYE.right.x} cy={EYE.right.y} rx="5.6" ry="5.8" />
                      </clipPath>
                      <linearGradient
                        id="about-kosti-skin"
                        x1="40"
                        y1="6"
                        x2="40"
                        y2="52"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0" stopColor="#B26538" />
                        <stop offset="0.38" stopColor="#D08955" />
                        <stop offset="1" stopColor="#D9A06A" />
                      </linearGradient>
                    </defs>
                    <path
                      className="about-hero__kosti-neck"
                      d="M31 54 Q40 59 49 54 L51 63 Q40 68 29 63 Z"
                    />
                    <path
                      className="about-hero__kosti-shirt"
                      d="M6 80 V67 C8 59 18 57.5 26 62 C34 56 46 56 54 62 C62 57.5 72 59 74 67 V80 Z"
                    />
                    <ellipse
                      cx="14.5"
                      cy="34"
                      rx="6.1"
                      ry="7.4"
                      fill="#d08955"
                    />
                    <ellipse
                      cx="65.5"
                      cy="34"
                      rx="6.1"
                      ry="7.4"
                      fill="#d08955"
                    />
                    <ellipse
                      cx="14.2"
                      cy="35"
                      rx="2.4"
                      ry="3.4"
                      className="about-hero__kosti-ear-inner"
                    />
                    <ellipse
                      cx="65.8"
                      cy="35"
                      rx="2.4"
                      ry="3.4"
                      className="about-hero__kosti-ear-inner"
                    />
                    <circle
                      cx="40"
                      cy="32"
                      r="25.5"
                      fill="url(#about-kosti-skin)"
                    />
                    <g clipPath="url(#about-kosti-head-clip)">
                      <path
                        className="about-hero__kosti-beard"
                        d="M15.2 31.5 C18 28 24 34 30 42 C34 47 37 43.8 40 43.8 C43 43.8 46 47 50 42 C56 34 62 28 64.8 31.5 C67.2 39 67.6 49 63 56.5 C57.5 65.5 48.5 68 40 68 C31.5 68 22.5 65.5 17 56.5 C12.4 49 12.8 39 15.2 31.5 Z"
                      />
                    </g>
                    <ellipse
                      className="about-hero__kosti-nose"
                      cx="40"
                      cy="37.4"
                      rx="6.6"
                      ry="5.4"
                    />
                    <ellipse
                      className="about-hero__kosti-nose-shine"
                      cx="37.2"
                      cy="35.6"
                      rx="2.2"
                      ry="1.55"
                    />
                    <path
                      className="about-hero__kosti-brow"
                      d="M21.8 24.2 Q28.4 20.6 36.4 24.6"
                    />
                    <path
                      className="about-hero__kosti-brow"
                      d="M43.6 24.6 Q51.6 20.6 58.2 24.2"
                    />
                    <ellipse
                      cx={EYE.left.x}
                      cy={EYE.left.y}
                      rx="5.6"
                      ry="5.8"
                      className="about-hero__kosti-eye"
                    />
                    <ellipse
                      cx={EYE.right.x}
                      cy={EYE.right.y}
                      rx="5.6"
                      ry="5.8"
                      className="about-hero__kosti-eye"
                    />
                    <g clipPath="url(#about-kosti-eye-left)">
                      <circle
                        ref={leftPupil}
                        cx={EYE.left.x}
                        cy={EYE.left.y}
                        r="3.05"
                        className="about-hero__kosti-pupil"
                      />
                    </g>
                    <g clipPath="url(#about-kosti-eye-right)">
                      <circle
                        ref={rightPupil}
                        cx={EYE.right.x}
                        cy={EYE.right.y}
                        r="3.05"
                        className="about-hero__kosti-pupil"
                      />
                    </g>
                    <path
                      className="about-hero__kosti-shirt-front"
                      d="M33 59.2 L38.6 80 L41.4 80 L47 59.2 Z"
                    />
                    <path
                      className="about-hero__kosti-lapel"
                      d="M18 61.2 L35.8 59.8 L38.6 80 L20 80 L8.5 72.5 Z"
                    />
                    <path
                      className="about-hero__kosti-lapel"
                      d="M62 61.2 L44.2 59.8 L41.4 80 L60 80 L71.5 72.5 Z"
                    />
                    <path
                      className="about-hero__kosti-collar"
                      d="M36.6 55 L29.4 55.3 L27.2 60.2 L35.8 59.6 Z"
                    />
                    <path
                      className="about-hero__kosti-collar"
                      d="M43.4 55 L50.6 55.3 L52.8 60.2 L44.2 59.6 Z"
                    />
                  </svg>
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
