import { ARTICLES_SORTED } from "@/lib/content/positionen";
import RevealScope from "@/components/RevealScope";
import FillButton from "@/components/FillButton";
import PostsCarousel from "@/components/PostsCarousel";

/**
 * Startseite Block 6 – neueste Beiträge aus „Gedanken für Berlin“.
 */
export default function Posts() {
  const latest = ARTICLES_SORTED.slice(0, 6);

  return (
    <RevealScope as="section" className="posts" id="positionen">
      <header className="posts__head">
        <h2 className="posts__title" data-reveal="lines">
          Ideen. Gespräche. Positionen.
        </h2>
        <p className="posts__chip" data-reveal="up">
          Gedanken für Berlin
        </p>
      </header>

      <div data-reveal="up">
        <PostsCarousel articles={latest} />
      </div>

      <FillButton href="/positionen" className="btn-fill posts__all" data-reveal="up">
        Alle Positionen
      </FillButton>
    </RevealScope>
  );
}
