"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/lib/content/projekte";
import Pic from "@/components/Pic";
import FillButton from "@/components/FillButton";
import TransitionLink from "@/components/TransitionLink";
import BerlinWord from "@/components/BerlinWord";
import {
  REVEAL_START,
  markRevealed,
  observeRevealOnce,
} from "@/lib/reveal-io";

function supportsScrollTimeline() {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline", "view()")
  );
}

/**
 * Staggered editorial grid on warm paper (Startseite Block 4). Every
 * image parallaxes inside its clipped frame; captions and the section
 * head reveal as they enter.
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const cleanups: (() => void)[] = [];
    const scrollCleanups: (() => void)[] = [];

    const heading = root.current.querySelector<HTMLElement>("[data-work-heading]");
    if (heading) {
      heading.dataset.reveal = "lines";
      const split = SplitText.create(heading, {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
        onSplit: (self: { lines: Element[] }) => {
          self.lines.forEach((line, i) => {
            (line as HTMLElement).style.setProperty("--line-i", String(i));
          });
        },
      });
      cleanups.push(() => split.revert());

      cleanups.push(
        observeRevealOnce(heading, {
          startTop: REVEAL_START.workHead,
          onEnter: () => markRevealed(heading),
        })
      );
    }

    root.current.querySelectorAll<HTMLElement>("[data-work-item]").forEach((item) => {
      const img = item.querySelector<HTMLElement>("[data-work-parallax]");
      const media = item.querySelector<HTMLElement>("[data-work-media]");
      const caption = item.querySelector<HTMLElement>("[data-work-caption]");

      if (media) {
        cleanups.push(
          observeRevealOnce(media, {
            startTop: REVEAL_START.workItem,
            onEnter: () => markRevealed(media),
          })
        );
      }

      if (caption) {
        cleanups.push(
          observeRevealOnce(caption, {
            startTop: REVEAL_START.workCaption,
            onEnter: () => markRevealed(caption),
          })
        );
      }

      if (img && !supportsScrollTimeline()) {
        const tween = gsap.fromTo(
          img,
          { yPercent: -12 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              onToggle: (self) => {
                gsap.set(img, {
                  willChange: self.isActive ? "transform" : "auto",
                });
              },
            },
          }
        );
        scrollCleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      }
    });

    return () => {
      cleanups.forEach((fn) => fn());
      scrollCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      className="work"
      id="projekte"
      ref={root}
      aria-labelledby="work-heading"
    >
      <header className="work__head">
        <h2 className="display" id="work-heading" data-work-heading>
          Projekte
          <br />
          für <BerlinWord />
        </h2>
        <FillButton href="/projekte" className="btn-fill work__all">
          Alle Projekte
        </FillButton>
      </header>

      <ul className="work__grid" role="list">
        {PROJECTS.map((project) => (
          <li className="work__item" data-work-item key={project.slug}>
            <TransitionLink
              href={`/projekte/${project.slug}`}
              aria-label={`${project.name} – ${project.short}`}
            >
              <figure>
                <div className="work__media" data-work-media>
                  <Pic
                    name={project.img}
                    sizes="(max-width: 900px) 100vw, 58vw"
                    alt=""
                    data-work-parallax=""
                  />
                </div>
                <figcaption data-work-caption>
                  <h3>{project.name}</h3>
                  <p className="work__tags">
                    {project.category} · {project.year}
                  </p>
                </figcaption>
              </figure>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
