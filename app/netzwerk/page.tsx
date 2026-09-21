import type { Metadata } from "next";
import NetworkDirectory from "@/components/NetworkDirectory";
import membersData from "@/lib/network-members.json";
import type { NetworkMember } from "@/lib/network-types";
import { NETZWERK } from "@/lib/content/netzwerk";
import PhotoPageHero from "@/components/blocks/PhotoPageHero";
import NetworkPartnerDuo from "@/components/blocks/NetworkPartnerDuo";
import RevealScope from "@/components/RevealScope";
import Section from "@/components/blocks/Section";
import Pic from "@/components/Pic";
import KiezMap from "@/components/graphics/KiezMap";

const PANGEA_MAPS =
  "https://www.google.com/maps/search/?api=1&query=Pangea%20Haus%20Bundesallee%2056%2010715%20Berlin";

const networkMembers = membersData as NetworkMember[];

export const metadata: Metadata = {
  title: "Netzwerk",
  description:
    "Netzwerke, die etwas bewegen: MyBLN, AG City, Wirtschaft × Politik × Stadtgesellschaft – und die Menschen, die Berlin prägen.",
};

export default function NetzwerkPage() {
  return (
    <main id="main" className="page page--photo-hero network-page">
      <div className="photo-hero-handoff">
        <PhotoPageHero
          imageSrc="/img/pexels-henri-mathieu-8349432.webp"
          titleLineA="Mein"
          titleLineB="Netzwerk"
          titleWordGap
          scrollHref="#network-intro"
          scrollLabel="Zum Netzwerk ↓"
        />

        <RevealScope
          as="section"
          id="netzwerke"
          className="block block--paper block--wide photo-hero-reveal network-hub"
        >
          <div id="network-intro" className="network-intro__inner">
            <h2 className="network-intro__title display" data-reveal="lines">
              Die besten Projekte entstehen selten allein.
            </h2>
            <p className="network-intro__lede sectors__lede" data-reveal="lines">
              Berlin verfügt über außergewöhnlich viele kluge, kreative und engagierte Menschen.
              Häufig kennen sie sich nur noch nicht. Deshalb ist Vernetzung für mich kein
              Selbstzweck. Ein gutes Netzwerk schafft konkrete Projekte.
            </p>
          </div>

          <div className="network-hub__tiles">
            <NetworkPartnerDuo />
          </div>
        </RevealScope>

        <Section
          id="kiez"
          tone="paper"
          className="kiez-section"
          eyebrow={NETZWERK.kiez.eyebrow}
          title={NETZWERK.kiez.title}
        >
          <div className="kiez-place">
            <div className="kiez-place__map">
              <div className="kiez-place__map-frame" data-reveal="clip">
                <KiezMap />
              </div>
              <a
                className="kiez-place__map-cap"
                href={PANGEA_MAPS}
                target="_blank"
                rel="noreferrer"
              >
                <span className="kiez-place__pin" aria-hidden="true" />
                <span>
                  <strong>Pangea Haus</strong>
                  Bundesallee 56 · Berlin-Wilmersdorf
                </span>
              </a>
              <ol className="principle kiez-place__principle" role="list" data-reveal="stagger">
                {NETZWERK.kiez.principle.map((line) => (
                  <li className="principle__line display" key={line}>
                    {line}
                  </li>
                ))}
              </ol>
            </div>

            <figure className="kiez-place__shot">
              <div className="kiez-place__media" data-reveal="clip">
                <Pic
                  name="sector-hospitality"
                  sizes="(max-width: 900px) 100vw, 52vw"
                  alt="Kiezcafé im Pangea-Haus, Berlin-Wilmersdorf"
                />
              </div>
              <figcaption className="kiez-place__copy">
                <div className="prose" data-reveal="stagger">
                  <p>
                    Große Stadtentwicklung und lokale Gemeinschaft sind keine Gegensätze.{" "}
                    <a href={PANGEA_MAPS} target="_blank" rel="noreferrer">
                      <strong>Mein Kiezcafé im Pangea-Haus</strong>
                    </a>{" "}
                    in Berlin-Wilmersdorf verbindet Gastronomie mit Begegnung, Kultur,
                    Familienangeboten und gesellschaftlichem Austausch.
                  </p>
                </div>
                <p className="prose" data-reveal="up">
                  {NETZWERK.kiez.closing}
                </p>
              </figcaption>
            </figure>
          </div>
        </Section>

        <div className="network-koepfe-scroll">
          <RevealScope
            as="section"
            id="koepfe"
            className="network-koepfe"
            aria-labelledby="koepfe-heading"
          >
            <div className="network-koepfe__panel">
              <h2 className="network-koepfe__title display" id="koepfe-heading" data-reveal="lines">
                Ein paar der klugen Köpfe
              </h2>
            </div>
          </RevealScope>

          <section id="mitglieder" className="network-mitglieder">
            <div className="network-mitglieder__body block block--white block--wide">
              <h2 id="network-heading" className="visually-hidden">
                Mitglieder
              </h2>
              <NetworkDirectory members={networkMembers} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
