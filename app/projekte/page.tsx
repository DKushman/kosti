import type { Metadata } from "next";
import { PROJECTS } from "@/lib/content/projekte";
import ProjectsPhotoHero from "@/components/blocks/ProjectsPhotoHero";
import RevealScope from "@/components/RevealScope";
import Pic from "@/components/Pic";
import TransitionLink from "@/components/TransitionLink";

const PROJECT_PLACEHOLDER =
  "Platzhaltertext für die Projektbeschreibung. Hier folgt später der finale Text zu Kontext, Rolle und Ergebnis.";

export const metadata: Metadata = {
  title: "Projekte",
  description:
    "Projekte für Berlin: MyBLN, AG City, HYGH, Zukunftsorte Berlin und EXPO 2035 – visuell, konkret und nah an echten Umsetzungen.",
};

export default function ProjektePage() {
  return (
    <main id="main" className="page page--photo-hero">
      <div className="photo-hero-handoff">
        <ProjectsPhotoHero />

        <RevealScope
          as="section"
          id="projekte-list"
          className="block block--paper block--wide photo-hero-reveal"
        >
          <ul className="proj-showcase" role="list">
            {PROJECTS.map((p) => (
              <li className="proj-showcase__item" key={p.slug} data-reveal="up">
                <TransitionLink href={`/projekte/${p.slug}`} className="proj-showcase__link">
                  <div className="proj-showcase__media">
                    <Pic
                      name={p.img}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      alt=""
                    />
                  </div>
                  <h2 className="proj-showcase__title">{p.name}</h2>
                  <p className="proj-showcase__text">{PROJECT_PLACEHOLDER}</p>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </RevealScope>
      </div>
    </main>
  );
}
