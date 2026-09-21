import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import PageHero from "@/components/blocks/PageHero";
import RevealScope from "@/components/RevealScope";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false },
};

/** TODO: Rechtlich prüfen lassen; Hosting-Anbieter und ggf. Kontaktformular ergänzen. */
export default function DatenschutzPage() {
  return (
    <main id="main" className="page page--light">
      <PageHero eyebrow="Rechtliches" title="Datenschutz" />
      <RevealScope as="section" className="block block--paper legal">
        <div className="prose" data-reveal="stagger">
          <h2>Verantwortlicher</h2>
          <p>
            {SITE.name}, [Anschrift], E-Mail:{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
          <h2>Hosting</h2>
          <p>
            Diese Website wird bei [Hosting-Anbieter] gehostet. Beim Aufruf der
            Seite verarbeitet der Anbieter technisch notwendige Daten
            (Server-Logfiles: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite,
            Browsertyp). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
          <h2>Bilder von Cloudinary</h2>
          <p>
            Profilbilder im Bereich Netzwerk werden über den Dienst Cloudinary
            (Cloudinary Ltd.) ausgeliefert. Dabei wird Ihre IP-Adresse an
            Cloudinary übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
            DSGVO.
          </p>
          <h2>Schriftarten</h2>
          <p>
            Die verwendeten Schriften werden lokal von diesem Server geladen.
            Es findet keine Verbindung zu Google-Servern statt.
          </p>
          <h2>Cookies und Tracking</h2>
          <p>Diese Website setzt keine Tracking-Cookies ein und nutzt keine Analyse-Dienste.</p>
          <h2>Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
            Widerspruch. Außerdem steht Ihnen ein Beschwerderecht bei einer
            Aufsichtsbehörde zu.
          </p>
        </div>
      </RevealScope>
    </main>
  );
}
