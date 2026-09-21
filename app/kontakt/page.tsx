import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import PageHero from "@/components/blocks/PageHero";
import RevealScope from "@/components/RevealScope";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Sie haben eine Idee für Berlin? Sie möchten ein Projekt vorstellen oder sich vernetzen? Konstantin Patsalides freut sich auf den Austausch.",
};

const WAYS = [
  { label: "LinkedIn", value: "Konstantin Patsalides", href: SITE.linkedin, hint: "Beruflich vernetzen", external: true },
  { label: "E-Mail", value: SITE.email, href: `mailto:${SITE.email}`, hint: "Direkt schreiben", external: false },
  { label: "Instagram", value: "@konstantin.patsalides", href: SITE.instagram, hint: "Berlin im Bild", external: true },
];

export default function KontaktPage() {
  return (
    <main id="main" className="page page--light">
      <PageHero
        index="06"
        eyebrow="Kontakt"
        title="Berlin entsteht im Austausch."
        lede="Sie haben eine Idee für Berlin? Sie möchten ein Projekt vorstellen? Sie möchten sich vernetzen? Oder Sie möchten einfach miteinander ins Gespräch kommen?"
      />

      <RevealScope as="section" className="block block--paper contact">
        <ul className="ways" role="list" data-reveal="stagger">
          {WAYS.map((w, i) => (
            <li className="ways__item" key={w.label}>
              <a
                className="ways__link"
                href={w.href}
                target={w.external ? "_blank" : undefined}
                rel={w.external ? "noreferrer" : undefined}
              >
                <span className="ways__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ways__label display">{w.label}</span>
                <span className="ways__value">{w.value}</span>
                <span className="ways__hint">{w.hint}</span>
                <span className="ways__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="contact__closing serif-lede" data-reveal="up">
          Ich freue mich auf den Austausch.
        </p>
        <p className="contact__sig display" data-reveal="lines">
          Konstantin
        </p>
      </RevealScope>
    </main>
  );
}
