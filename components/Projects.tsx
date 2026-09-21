"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { PROJECTS } from "@/lib/content/projekte";
import Pic from "@/components/Pic";
import FillButton from "@/components/FillButton";
import TransitionLink from "@/components/TransitionLink";
import BerlinWord from "@/components/BerlinWord";

/**
 * Staggered editorial grid on warm paper (Startseite Block 4). Every
 * image parallaxes inside its clipped frame; captions and the section
 * head reveal as they enter.
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const head = SplitText.create("[data-work-heading]", {
        type: "lines",
        linesClass: "split-line",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
        onSplit: (self: { lines: Element[] }) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: "[data-work-heading]",
              start: "top 85%",
            },
          }),
      });

      gsap.utils.toArray<HTMLElement>("[data-work-item]").forEach((item) => {
        const img = item.querySelector("img");
        const media = item.querySelector("[data-work-media]");
        const caption = item.querySelector("figcaption");

        gsap.from(media, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });

        gsap.fromTo(
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
            },
          }
        );

        gsap.from(caption, {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          clearProps: "all",
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
          },
        });
      });

      return () => head.revert();
    },
    { scope: root }
  );

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
                  />
                </div>
                <figcaption>
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
