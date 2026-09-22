"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { REVEAL_START, observeRevealOnce } from "@/lib/reveal-io";
import { ValuesHaltungCard } from "@/components/blocks/ValuesHaltungCard";
import { imageSetForPath } from "@/lib/images";

type ValueItem = { title: string; text: string; image: string };

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  heroImage: string;
  items: readonly ValueItem[];
};

type SlotMetrics = { top: number; left: number; width: number; height: number };

const CARD_SIDE: Record<number, "left" | "right" | "center"> = {
  0: "left",
  1: "left",
  2: "center",
  3: "right",
  4: "right",
};

const MASK_SIZES = "100vw";
const MASK_ASPECT_FALLBACK = 1600 / 1067;

function readSlotMetrics(pin: HTMLElement, slot: HTMLElement): SlotMetrics {
  const pinR = pin.getBoundingClientRect();
  const slotR = slot.getBoundingClientRect();
  return {
    top: slotR.top - pinR.top,
    left: slotR.left - pinR.left,
    width: slotR.width,
    height: slotR.height,
  };
}

function readHeroOpenMetrics(pin: HTMLElement): SlotMetrics {
  const gap =
    parseFloat(getComputedStyle(pin).getPropertyValue("--values-hero-gap").trim()) ||
    10;
  return {
    top: gap,
    left: gap,
    width: Math.max(pin.clientWidth - gap * 2, 0),
    height: Math.max(pin.clientHeight - gap * 2, 0),
  };
}

/** Rendered width of an image with aspect `a` when it cover-fits a w×h box. */
function coverWidth(w: number, h: number, a: number) {
  return Math.max(w, h * a);
}

/**
 * Desktop: sticky pin — the hero window morphs into the centre mosaic card.
 *
 * Performance note: the mask is laid out ONCE at its open size. The scroll
 * morph writes transforms only (mask translate + non-uniform scale, photo
 * counter-scaled so it stays cover-fitted and undistorted, corner radius
 * compensated per axis). No frame triggers layout or re-rasterises the
 * photo. The caption text cannot live inside a non-uniformly scaled box, so
 * it sits in its own frame that follows the mask rect.
 */
export default function ValuesHaltungScene({
  eyebrow,
  title,
  lede,
  heroImage,
  items,
}: Props) {
  const center = items[2];
  const centerImage = imageSetForPath(center.image);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const maskImgRef = useRef<HTMLImageElement>(null);
  const captionFrameRef = useRef<HTMLDivElement>(null);
  const maskCaptionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const eyebrowWrapRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const centerSlotRef = useRef<HTMLLIElement>(null);
  const mosaicRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(max-width: 900px)").matches) return;

      const track = trackRef.current;
      const pin = pinRef.current;
      const mask = maskRef.current;
      const maskImg = maskImgRef.current;
      const captionFrame = captionFrameRef.current;
      const maskCaption = maskCaptionRef.current;
      const head = headRef.current;
      const eyebrowWrap = eyebrowWrapRef.current;
      const eyebrowEl = eyebrowRef.current;
      const titleEl = titleRef.current;
      const ledeEl = ledeRef.current;
      const centerSlot = centerSlotRef.current;
      const mosaic = mosaicRef.current;

      if (
        !track ||
        !pin ||
        !mask ||
        !maskImg ||
        !captionFrame ||
        !maskCaption ||
        !head ||
        !eyebrowWrap ||
        !eyebrowEl ||
        !titleEl ||
        !ledeEl ||
        !centerSlot ||
        !mosaic
      ) {
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const sideCards = mosaic.querySelectorAll<HTMLElement>(
        '.values-sticky__card[data-side="left"], .values-sticky__card[data-side="right"]'
      );
      const centerCaption = maskCaption;

      const pinStyles = getComputedStyle(pin);
      const radiusEnd =
        parseFloat(pinStyles.getPropertyValue("--values-hero-radius").trim()) ||
        14;
      const radiusStart =
        parseFloat(
          pinStyles.getPropertyValue("--values-hero-radius-open").trim()
        ) || radiusEnd * 1.65;

      let slotMetrics: SlotMetrics = readSlotMetrics(pin, centerSlot);
      let openMetrics: SlotMetrics = readHeroOpenMetrics(pin);
      const syncMetrics = () => {
        slotMetrics = readSlotMetrics(pin, centerSlot);
        openMetrics = readHeroOpenMetrics(pin);
      };

      if (reduced) {
        gsap.set([mask, head, ...sideCards], { clearProps: "all" });
        gsap.set([mask, captionFrame], { autoAlpha: 0 });
        gsap.set(head, { autoAlpha: 1 });
        gsap.set(centerCaption, { autoAlpha: 1, yPercent: 0 });
        gsap.set(sideCards, { x: 0, autoAlpha: 1 });
        return;
      }

      const aspect =
        centerImage.width && centerImage.height
          ? centerImage.width / centerImage.height
          : MASK_ASPECT_FALLBACK;

      /*
       * One-time layout: mask at its open size, photo sized to its
       * cover-fit dimensions and centred (instead of object-fit, whose box
       * would clip the photo once the box is counter-scaled).
       */
      const layoutMask = () => {
        const o = openMetrics;
        gsap.set(mask, {
          position: "absolute",
          top: o.top,
          left: o.left,
          width: o.width,
          height: o.height,
          autoAlpha: 1,
        });
        const cw = coverWidth(o.width, o.height, aspect);
        const ch = cw / aspect;
        gsap.set(maskImg, {
          position: "absolute",
          left: (o.width - cw) / 2,
          top: (o.height - ch) / 2,
          width: cw,
          height: ch,
          objectFit: "fill",
        });
      };

      /* transform-only morph, p = 0 (open) … 1 (centre slot) */
      const applyMorph = (p: number) => {
        const o = openMetrics;
        const s = slotMetrics;
        if (!o.width || !o.height) return;

        const w = o.width + (s.width - o.width) * p;
        const h = o.height + (s.height - o.height) * p;
        const x = o.left + (s.left - o.left) * p;
        const y = o.top + (s.top - o.top) * p;
        const sx = w / o.width;
        const sy = h / o.height;
        const tx = x + w / 2 - (o.left + o.width / 2);
        const ty = y + h / 2 - (o.top + o.height / 2);
        const r = radiusStart + (radiusEnd - radiusStart) * p;

        mask.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sx}, ${sy})`;
        mask.style.borderRadius = `${r / sx}px / ${r / sy}px`;

        const k =
          coverWidth(w, h, aspect) / coverWidth(o.width, o.height, aspect);
        maskImg.style.transform = `translate3d(0, 0, 0) scale(${k / sx}, ${k / sy})`;

        captionFrame.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        captionFrame.style.width = `${w}px`;
        captionFrame.style.height = `${h}px`;
        captionFrame.style.borderRadius = `${r}px`;
      };

      layoutMask();
      applyMorph(0);
      gsap.set(head, { autoAlpha: 1, force3D: true });
      gsap.set(centerCaption, { autoAlpha: 0, yPercent: 18, force3D: true });

      sideCards.forEach((card) => {
        const fromRight = card.dataset.side === "right";
        gsap.set(card, {
          xPercent: fromRight ? 92 : -92,
          autoAlpha: 0,
          force3D: true,
        });
      });

      const titleSplit = SplitText.create(titleEl, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
      });

      const ledeSplit = SplitText.create(ledeEl, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
      });

      gsap.set(titleSplit.lines, { yPercent: 110, force3D: true });
      gsap.set(ledeSplit.lines, { yPercent: 110, force3D: true });
      gsap.set(eyebrowEl, { yPercent: 110, force3D: true });

      const inView =
        track.getBoundingClientRect().top < window.innerHeight * 0.82;

      const playIntro = () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(eyebrowEl, { yPercent: 0, duration: 0.85 }, 0)
          .to(
            titleSplit.lines,
            { yPercent: 0, duration: 1.05, stagger: 0.09 },
            0.08
          )
          .to(
            ledeSplit.lines,
            { yPercent: 0, duration: 0.95, stagger: 0.07 },
            0.2
          );
      };

      if (inView) {
        playIntro();
      } else {
        observeRevealOnce(track, {
          startTop: REVEAL_START.sectorsLede,
          onEnter: playIntro,
        });
      }

      syncMetrics();

      const morph = { p: 0 };

      const scrollTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.35,
          invalidateOnRefresh: true,
        },
      });

      const morphStart = 0.06;
      const morphDur = 0.82;

      scrollTl.fromTo(
        morph,
        { p: 0 },
        {
          p: 1,
          duration: morphDur,
          ease: "power1.inOut",
          onUpdate: () => applyMorph(morph.p),
        },
        morphStart
      );

      scrollTl.to(
        head,
        { autoAlpha: 0, duration: morphDur * 0.88, ease: "power1.inOut", force3D: true },
        morphStart
      );

      /* Side cards after mask is mostly settled — longer, softer slide-in */
      const cardsIn = morphStart + morphDur * 0.78;

      scrollTl.fromTo(
        centerCaption,
        { yPercent: 18, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.55,
          ease: "power1.out",
          force3D: true,
        },
        morphStart + morphDur * 0.72
      );

      scrollTl.to(
        sideCards,
        {
          xPercent: 0,
          autoAlpha: 1,
          duration: 0.78,
          stagger: { each: 0.11, from: "center" },
          ease: "power1.out",
          force3D: true,
        },
        cardsIn
      );

      const onRefreshInit = () => {
        syncMetrics();
        layoutMask();
        applyMorph(morph.p);
        scrollTl.invalidate();
      };
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
        scrollTl.scrollTrigger?.kill();
        scrollTl.kill();
        titleSplit.revert();
        ledeSplit.revert();
      };
    },
    { scope: trackRef, dependencies: [heroImage, title, lede, eyebrow, items] }
  );

  return (
    <div className="values-sticky__track" ref={trackRef}>
      <div className="values-sticky__pin" ref={pinRef}>
        <div className="values-sticky__mask" ref={maskRef}>
          <picture>
            {centerImage.srcSet ? (
              <source
                type="image/webp"
                srcSet={centerImage.srcSet}
                sizes={MASK_SIZES}
              />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={maskImgRef}
              className="values-sticky__mask-img"
              src={centerImage.src}
              alt=""
              width={centerImage.width || 1600}
              height={centerImage.height || 1067}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>

        <div className="values-sticky__mask-caption-frame" ref={captionFrameRef}>
          <div
            className="values-haltung-card__body values-sticky__mask-caption"
            ref={maskCaptionRef}
          >
            <h3 className="values-haltung-card__title">{center.title}</h3>
            <p className="values-haltung-card__text">{center.text}</p>
          </div>
        </div>

        <div className="values-sticky__head" ref={headRef}>
          <div className="values-sticky__line-mask" ref={eyebrowWrapRef}>
            <p className="eyebrow values-sticky__eyebrow" ref={eyebrowRef}>
              {eyebrow}
            </p>
          </div>
          <h2 className="values-sticky__title display" ref={titleRef}>
            {title}
          </h2>
          <p className="values-sticky__lede serif-lede" ref={ledeRef}>
            {lede}
          </p>
        </div>

        <ul className="values-sticky__mosaic" role="list" ref={mosaicRef}>
          {items.map((item, i) => (
            <li
              key={item.title}
              ref={i === 2 ? centerSlotRef : undefined}
              className={`values-sticky__card values-sticky__card--${i}`}
              data-side={CARD_SIDE[i]}
            >
              <ValuesHaltungCard
                item={item}
                hideMedia={i === 2}
                hideCaption={i === 2}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
