"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { ValuesHaltungCard } from "@/components/blocks/ValuesHaltungCard";
import { withBasePath } from "@/lib/site-path";

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

/** Desktop: sticky pin — mask (hero window) moves; head fades via opacity only. */
export default function ValuesHaltungScene({
  eyebrow,
  title,
  lede,
  heroImage,
  items,
}: Props) {
  const center = items[2];
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
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
        gsap.set(mask, { autoAlpha: 0 });
        gsap.set(head, { autoAlpha: 1 });
        gsap.set(centerCaption, { autoAlpha: 1, yPercent: 0 });
        gsap.set(sideCards, { x: 0, autoAlpha: 1 });
        return;
      }

      gsap.set(mask, {
        position: "absolute",
        top: openMetrics.top,
        left: openMetrics.left,
        width: openMetrics.width,
        height: openMetrics.height,
        borderRadius: radiusStart,
        autoAlpha: 1,
        force3D: true,
      });
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
        ScrollTrigger.create({
          trigger: track,
          start: "top 82%",
          once: true,
          onEnter: playIntro,
        });
      }

      syncMetrics();

      const scrollTl = gsap.timeline({
        defaults: { ease: "none", force3D: true },
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

      scrollTl.to(
        mask,
        {
          top: () => slotMetrics.top,
          left: () => slotMetrics.left,
          width: () => slotMetrics.width,
          height: () => slotMetrics.height,
          borderRadius: radiusEnd,
          duration: morphDur,
          ease: "power1.inOut",
          overwrite: "auto",
        },
        morphStart
      );

      scrollTl.to(
        head,
        { autoAlpha: 0, duration: morphDur * 0.88, ease: "power1.inOut" },
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
        },
        cardsIn
      );

      const onRefreshInit = () => {
        syncMetrics();
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="values-sticky__mask-img"
            src={withBasePath(center.image)}
            alt=""
            width={1600}
            height={1067}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
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
