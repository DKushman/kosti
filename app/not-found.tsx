import PageHero from "@/components/blocks/PageHero";
import CtaBand from "@/components/blocks/CtaBand";

export default function NotFound() {
  return (
    <main id="main" className="page page--light">
      <PageHero
        eyebrow="404"
        title="Diese Seite gibt es nicht."
        lede="Vielleicht ist der Link veraltet – oder die Seite entsteht gerade erst."
      />
      <CtaBand title="Zurück zum Anfang." href="/" label="Zur Startseite" tone="navy" />
    </main>
  );
}
