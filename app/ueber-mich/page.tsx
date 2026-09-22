import type { Metadata } from "next";
import { ABOUT } from "@/lib/content/about";
import AboutSplitHero from "@/components/blocks/AboutSplitHero";
import BioCinematic from "@/components/blocks/BioCinematic";
import Section from "@/components/blocks/Section";
import ValuesHaltungSection from "@/components/blocks/ValuesHaltungSection";
import AboutMainStations from "@/components/blocks/AboutMainStations";
import QuoteByLines from "@/components/blocks/QuoteByLines";
export const metadata: Metadata = {
  title: "Über mich",
  description:
    "Berliner aus Überzeugung, Europäer aus Leidenschaft: Biografie, Stationen, Haltung und Werte von Konstantin Patsalides.",
};

export default function UeberMichPage() {
  return (
    <main id="main" className="page page--light">
      <AboutSplitHero />

      <BioCinematic />

      <AboutMainStations />

      <ValuesHaltungSection
        eyebrow={ABOUT.values.eyebrow}
        title={ABOUT.values.title}
        lede={ABOUT.values.lede}
        heroImage={ABOUT.values.heroImage}
        items={ABOUT.values.items}
      />

      <Section id="antrieb" tone="navy" className="quote-block">
        <blockquote className="quote" data-reveal="lines">
          <p className="quote__text">{ABOUT.drive.quote}</p>
        </blockquote>
        <QuoteByLines className="quote__by serif-lede">
          Internationale Beziehungen, Städtepartnerschaften, Tourismus,
          internationale Unternehmen und der Austausch zwischen Metropolen können
          Berlin wirtschaftlich und gesellschaftlich stärken. Berlin sollte
          seine internationale Rolle noch selbstbewusster wahrnehmen.
        </QuoteByLines>
      </Section>
    </main>
  );
}
