"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { withBasePath } from "@/lib/site-path";

const PROJECTS = [
  {
    name: "Nova Flagship",
    tags: "Retail — Berlin",
    year: "2026",
    img: withBasePath("/img/project-1.jpg"),
  },
  {
    name: "Kiosk Fortyseven",
    tags: "Hospitality — München",
    year: "2025",
    img: withBasePath("/img/project-2.jpg"),
  },
  {
    name: "Atlas Campus",
    tags: "Workplace — Hamburg",
    year: "2024",
    img: withBasePath("/img/project-3.jpg"),
  },
  {
    name: "Feldlabor Pavilion",
    tags: "Exhibition — Köln",
    year: "2024",
    img: withBasePath("/img/project-4.jpg"),
  },
];

/**
 * Staggered editorial grid on warm paper. Every image parallaxes
 * inside its clipped frame; captions and the section head reveal
 * as they enter.
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

        // frame unclips upward
        gsap.from(media, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });

        // image drifts inside the clipped frame
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
      id="work"
      ref={root}
      aria-labelledby="work-heading"
    >
      <header className="work__head">
        <h2 className="display" id="work-heading" data-work-heading>
          Selected
          <br />
          work
        </h2>
        <p className="work__count">(2019 — 2026)</p>
      </header>

      <ul className="work__grid" role="list">
        {PROJECTS.map((project) => (
          <li className="work__item" data-work-item key={project.name}>
            <a href="#contact" aria-label={`${project.name} case study`}>
              <figure>
                <div className="work__media" data-work-media>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.img} alt="" loading="lazy" draggable={false} />
                </div>
                <figcaption>
                  <h3>{project.name}</h3>
                  <p className="work__tags">
                    {project.tags} · {project.year}
                  </p>
                </figcaption>
              </figure>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
