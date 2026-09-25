"use client";

import { useEffect, useRef, useState } from "react";
import { SplitText } from "@/lib/gsap";
import { fitSectorNames } from "@/lib/fit-display-text";
import { HOME_THEMES } from "@/lib/content/themen";
import FillButton from "@/components/FillButton";
import RevealScope from "@/components/RevealScope";
import {
  REVEAL_START,
  markRevealed,
  observeRevealOnce,
} from "@/lib/reveal-io";

/**
 * Navy theme index (Startseite Block 2 + 3). Giant list items reveal
 * line by line on scroll; hovering (or focusing) an item highlights it,
 * swaps the sticky image column and shows its one-line description.
 */
export default function Themes() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const fit = () => {
      if (cancelled || !root.current) return;
      if (window.matchMedia("(max-width: 900px)").matches) return;
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

  useEffect(() => {
    if (!root.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const cleanups: (() => void)[] = [];

    const ledeEl = root.current.querySelector<HTMLElement>("[data-sectors-lede]");
    if (ledeEl) {
      ledeEl.dataset.reveal = "lines";
      const split = SplitText.create(ledeEl, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "none",
        autoSplit: true,
        onSplit: (self: { lines: Element[] }) => {
          self.lines.forEach((line, i) => {
            (line as HTMLElement).style.setProperty("--line-i", String(i));
          });
        },
      });
      cleanups.push(() => split.revert());
      cleanups.push(
        observeRevealOnce(ledeEl, {
          startTop: REVEAL_START.sectorsLede,
          onEnter: () => markRevealed(ledeEl),
        })
      );
    }

    const cta = root.current.querySelector<HTMLElement>("[data-sectors-cta]");
    if (cta) {
      cleanups.push(
        observeRevealOnce(cta, {
          startTop: REVEAL_START.sectorsCta,
          onEnter: () => markRevealed(cta),
        })
      );
    }

    const mobileSectors = window.matchMedia("(max-width: 900px)").matches;

    if (!mobileSectors) {
      root.current.querySelectorAll<HTMLElement>("[data-sector-item]").forEach((item, i) => {
        const clip = item.querySelector<HTMLElement>("[data-sector-clip]");
        if (!clip) return;

        item.style.setProperty("--sector-i", String(i));

        cleanups.push(
          observeRevealOnce(item, {
            startTop: REVEAL_START.sectorItem,
            onEnter: () => {
              clip.classList.add("is-revealed");
              item.querySelectorAll<HTMLElement>("[data-sector-rule]").forEach((rule) => {
                rule.classList.add("is-revealed");
              });
            },
          })
        );
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      className="sectors"
      id="themen"
      ref={root}
      aria-labelledby="sectors-heading"
    >
      <div className="sectors__intro">
        <h2 className="visually-hidden" id="sectors-heading">
          Meine Themen für Berlin
        </h2>
        <p className="sectors__lede" data-sectors-lede>
          Ob in Unternehmen, Verbänden, Netzwerken oder eigenen Projekten –
          mich beschäftigt, wie aus Kontakten Kooperationen, aus Ideen Projekte
          und aus Projekten konkrete Veränderungen entstehen.
        </p>
        <FillButton href="/ueber-mich" data-sectors-cta>
          Über mich
        </FillButton>
      </div>

      <RevealScope>
        <p className="sectors__body-label" data-reveal="up">
          Themen, mit den ich mich befasse.
        </p>
        <div className="sectors__body sectors__carousel" data-sectors-body data-reveal="up">
          <ul className="sectors__list" role="list">
          {HOME_THEMES.map((theme, i) => (
            <li
              className={`sectors__item${active === i ? " is-active" : ""}`}
              data-sector-item
              key={theme.name}
            >
              <span className="sectors__rule" data-sector-rule aria-hidden="true" />
              <div className="sectors__item-clip" data-sector-clip>
                <div className="sectors__item-rise">
                  <span
                    className="sectors__link display"
                    role="group"
                    tabIndex={0}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className="sectors__card-media" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={theme.image}
                        alt=""
                        loading={i < 2 ? "eager" : "lazy"}
                        fetchPriority={i < 2 ? "high" : undefined}
                        decoding="async"
                        draggable={false}
                        style={
                          "imagePosition" in theme && theme.imagePosition
                            ? { objectPosition: theme.imagePosition }
                            : undefined
                        }
                      />
                    </span>
                    <span className="sectors__overlay" aria-hidden="true" />
                    <span className="sectors__link-title">
                      <span className="split-line">
                        <span data-sector-name>{theme.name}</span>
                      </span>
                    </span>
                    <span className="sectors__card-eyebrow">{theme.name}</span>
                    <span className="sectors__card-copy">
                      <span className="sectors__card-headline">{theme.text}</span>
                    </span>
                  </span>
                  <p className="sectors__desc">{theme.text}</p>
                </div>
              </div>
              {i === HOME_THEMES.length - 1 && (
                <span
                  className="sectors__rule sectors__rule--bottom"
                  data-sector-rule
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ul>

        <div className="sectors__media" data-sectors-media aria-hidden="true">
          {HOME_THEMES.map((theme, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={theme.name}
              src={theme.image}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className={active === i ? "is-active" : ""}
              style={
                "imagePosition" in theme && theme.imagePosition
                  ? { objectPosition: theme.imagePosition }
                  : undefined
              }
            />
          ))}
          <p className="sectors__media-caption">{HOME_THEMES[active].text}</p>
        </div>
        </div>
      </RevealScope>
    </section>
  );
}
