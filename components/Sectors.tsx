"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { fitSectorNames } from "@/lib/fit-display-text";
import { withBasePath } from "@/lib/site-path";

const SECTORS = [
  { name: "Retail", img: withBasePath("/img/sector-retail.jpg") },
  { name: "Hospitality", img: withBasePath("/img/sector-hospitality.jpg") },
  { name: "Workplace", img: withBasePath("/img/sector-workplace.jpg") },
  { name: "Exhibition", img: withBasePath("/img/sector-exhibition.jpg") },
];

/**
 * Cobalt-blue sector index. Giant list items reveal line by line on
 * scroll; hovering (or focusing) an item highlights it and swaps the
 * sticky image column.
 */
export default function Sectors() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const fit = () => {
      if (cancelled || !root.current) return;
      const names = [
        ...root.current.querySelectorAll<HTMLElement>("[data-sector-name]"),
      ];
      fitSectorNames(names);
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
  }, []);

  useGSAP(
    () => {
      if (!root.current) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      // serif intro: line-mask reveal (autoSplit re-splits when the
      // webfont finishes loading so line breaks stay correct)
      const lede = SplitText.create("[data-sectors-lede]", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
        onSplit: (self: { lines: Element[] }) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: {
              trigger: "[data-sectors-lede]",
              start: "top 82%",
            },
          }),
      });

      gsap.from("[data-sectors-cta]", {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        clearProps: "all",
        scrollTrigger: {
          trigger: "[data-sectors-cta]",
          start: "top 88%",
        },
      });

      // giant items: rise out of their own overflow-clipped rows,
      // separator lines draw in from the left
      gsap.utils.toArray<HTMLElement>("[data-sector-item]").forEach((item) => {
        const link = item.querySelector("[data-sector-name]");
        gsap.from(link, {
          yPercent: 100,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
          },
        });
        const rules = item.querySelectorAll("[data-sector-rule]");
        gsap.from(rules, {
          scaleX: 0,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
          },
        });
      });

      // image column drifts gently while the list scrolls
      gsap.fromTo(
        "[data-sectors-media]",
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-sectors-body]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      return () => lede.revert();
    },
    { scope: root }
  );

  return (
    <section
      className="sectors"
      id="sectors"
      ref={root}
      aria-labelledby="sectors-heading"
    >
      <div className="sectors__intro">
        <h2 className="visually-hidden" id="sectors-heading">
          Sectors we work in
        </h2>
        <p className="serif-lede" data-sectors-lede>
          We have deep experience across a range of commercial sectors,
          offering a complete end-to-end service — from brand strategy to
          interior design and build.
        </p>
        <a className="link-underline" href="#contact" data-sectors-cta>
          Our services
        </a>
      </div>

      <div className="sectors__body" data-sectors-body>
        <ul className="sectors__list" role="list">
          {SECTORS.map((sector, i) => (
            <li
              className={`sectors__item${active === i ? " is-active" : ""}`}
              data-sector-item
              key={sector.name}
            >
              <span className="sectors__rule" data-sector-rule aria-hidden="true" />
              {i === SECTORS.length - 1 && (
                <span
                  className="sectors__rule sectors__rule--bottom"
                  data-sector-rule
                  aria-hidden="true"
                />
              )}
              <a
                className="sectors__link display"
                href="#work"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="split-line">
                  <span data-sector-name>{sector.name}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="sectors__media" data-sectors-media aria-hidden="true">
          {SECTORS.map((sector, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={sector.name}
              src={sector.img}
              alt=""
              className={active === i ? "is-active" : ""}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
