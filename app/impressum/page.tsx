import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import PageHero from "@/components/blocks/PageHero";
import RevealScope from "@/components/RevealScope";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

/** TODO: Angaben mit Konstantin abstimmen (Anschrift, Vertretung, USt-ID). */
export default function ImpressumPage() {
  return (
    <main id="main" className="page page--light">
      <PageHero eyebrow="Rechtliches" title="Impressum" />
      <RevealScope as="section" className="block block--paper legal">
        <div className="prose" data-reveal="stagger">
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            {SITE.name}
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ] Berlin
          </p>
          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>{SITE.name}, Anschrift wie oben.</p>
          <h2>Haftung für Inhalte</h2>
          <p>
            Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die
            Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch
            keine Gewähr übernommen werden.
          </p>
          <h2>Haftung für Links</h2>
          <p>
            Diese Seite enthält Links zu externen Websites Dritter, auf deren
            Inhalte kein Einfluss besteht. Für diese fremden Inhalte ist stets der
            jeweilige Anbieter oder Betreiber verantwortlich.
          </p>
        </div>
      </RevealScope>
    </main>
  );
}
