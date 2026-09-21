"use client";

import type { Article } from "@/lib/content/positionen";
import { useNetDuoTiles, type NetDuoTileEl } from "@/lib/net-duo-tile";
import Pic from "@/components/Pic";
import TransitionLink from "@/components/TransitionLink";
import RevealScope from "@/components/RevealScope";

type Props = {
  articles: readonly Article[];
};

/** Next article suggestions — same grid + cursor motion as `net-duo`. */
export default function ArticleNextReads({ articles }: Props) {
  const { bindTile, onMouseEnter, onMouseMove, onMouseLeave } = useNetDuoTiles();

  if (!articles.length) return null;

  return (
    <RevealScope as="section" className="article-next" aria-labelledby="article-next-heading">
      <h2
        id="article-next-heading"
        className="article-next__heading display"
        data-reveal="lines"
      >
        Weiterlesen
      </h2>
      <div className="net-duo article-next__duo">
        <div className="net-duo__grid" data-reveal="stagger">
          {articles.map((article) => (
            <TransitionLink
              key={article.slug}
              href={`/positionen/${article.slug}`}
              className="net-duo__tile"
              ref={(el) => bindTile(article.slug, el as NetDuoTileEl | null)}
              onMouseEnter={onMouseEnter}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              <div className="net-duo__media" aria-hidden="true">
                <Pic
                  name={article.img ?? "hero"}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  alt=""
                />
                <div className="net-duo__shade" />
              </div>
              <div className="net-duo__content">
                <p className="net-duo__handle">{article.category}</p>
                <h3 className="net-duo__title">
                  <span className="net-duo__title-inner display">{article.title}</span>
                </h3>
                <p className="net-duo__text">{article.excerpt}</p>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
    </RevealScope>
  );
}
