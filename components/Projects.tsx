"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/lib/content/projekte";
import ProjectCover from "@/components/ProjectCover";
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

const WORK_CLIP_FROM = "inset(100% 0% 0% 0%)";
const WORK_CLIP_TO = "inset(0% 0% 0% 0%)";

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
        gsap.set(media, { clipPath: WORK_CLIP_FROM });

        cleanups.push(
          observeRevealOnce(item, {
            startTop: REVEAL_START.workMediaUnfold,
            onEnter: () => {
              gsap.fromTo(
                media,
                { clipPath: WORK_CLIP_FROM },
                {
                  clipPath: WORK_CLIP_TO,
                  duration: 1.2,
                  ease: "power4.inOut",
                  overwrite: "auto",
                }
              );

              if (caption) {
                gsap.fromTo(
                  caption,
                  { autoAlpha: 0, y: 28 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.12,
                    onComplete: () => {
                      markRevealed(caption);
                      gsap.set(caption, {
                        clearProps: "opacity,visibility,transform",
                      });
                    },
                  }
                );
              }
            },
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
                  <ProjectCover
                    project={project}
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
