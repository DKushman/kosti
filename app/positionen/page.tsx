import type { Metadata } from "next";
import { ARTICLES_SORTED } from "@/lib/content/positionen";
import PhotoPageHero from "@/components/blocks/PhotoPageHero";
import RevealScope from "@/components/RevealScope";
import ArticleList from "@/components/blocks/ArticleList";

export const metadata: Metadata = {
  title: "Positionen",
  description:
    "Gedanken für Berlin: Ideen, Gespräche und Positionen zu Wirtschaft, Stadtentwicklung, Innovation und Berlin international.",
};

export default function PositionenPage() {
  return (
    <main id="main" className="page page--photo-hero">
      <div className="photo-hero-handoff">
        <PhotoPageHero
          imageSrc="/img/pexels-wal_-172619-2156618639-39305238.webp"
          titleLineA="Meine Haltung für Berlin"
          scrollHref="#beitraege"
          scrollLabel="Zu den Beiträgen ↓"
        />

        <RevealScope
          as="section"
          id="beitraege"
          className="block block--paper block--wide photo-hero-reveal"
        >
          <ArticleList articles={ARTICLES_SORTED} />
        </RevealScope>
      </div>
    </main>
  );
}
