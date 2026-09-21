"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Article } from "@/lib/content/positionen";
import type { ImageName } from "@/lib/images";
import Pic from "@/components/Pic";
import TransitionLink from "@/components/TransitionLink";

type Props = {
  articles: readonly Article[];
};

function postImage(article: Article): ImageName {
  return article.img ?? "project-1";
}

function stepSize() {
  if (typeof window === "undefined") return 3;
  return window.matchMedia("(min-width: 901px)").matches ? 3 : 1;
}

export default function PostsCarousel({ articles }: Props) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [page, setPage] = useState(0);
  const [steps, setSteps] = useState(3);

  const pageCount = Math.max(1, Math.ceil(articles.length / steps));

  const syncPage = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const size = stepSize();
    setSteps(size);
    const rect = track.getBoundingClientRect();
    const anchor = rect.left + 24;
    let firstVisible = 0;
    for (let i = 0; i < track.children.length; i++) {
      const item = track.children[i] as HTMLElement;
      if (item.getBoundingClientRect().left >= anchor - 8) {
        firstVisible = i;
        break;
      }
    }
    const nextPage = Math.min(
      Math.floor(firstVisible / size),
      Math.ceil(articles.length / size) - 1
    );
    setPage(Math.max(0, nextPage));
  }, [articles.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncPage();
    track.addEventListener("scroll", syncPage, { passive: true });
    window.addEventListener("resize", syncPage);
    return () => {
      track.removeEventListener("scroll", syncPage);
      window.removeEventListener("resize", syncPage);
    };
  }, [syncPage]);

  const scrollToPage = (nextPage: number) => {
    const track = trackRef.current;
    if (!track) return;
    const size = stepSize();
    const clamped = Math.max(0, Math.min(nextPage, pageCount - 1));
    const index = clamped * size;
    const item = track.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
    setPage(clamped);
  };

  return (
    <div className="posts__carousel">
      <ol className="posts__list" role="list" ref={trackRef}>
        {articles.map((article) => (
          <li className="posts__item" key={article.slug}>
            <TransitionLink
              href={`/positionen/${article.slug}`}
              className="posts__link"
            >
              <span className="visually-hidden">{article.title}</span>
              <span className="posts__media">
                <Pic
                  name={postImage(article)}
                  sizes="(max-width: 900px) 82vw, 42vw"
                  alt=""
                />
              </span>
              <span className="posts__overlay" aria-hidden="true" />
              <span className="posts__card-eyebrow">{article.category}</span>
              <span className="posts__card-copy">
                <span className="posts__card-title">{article.excerpt}</span>
              </span>
              <span className="posts__card-action" aria-hidden="true">
                +
              </span>
            </TransitionLink>
          </li>
        ))}
      </ol>

      <div className="posts__controls">
        <div className="posts__arrows">
          <button
            type="button"
            className="posts__arrow"
            aria-label="Vorherige Beiträge"
            disabled={page === 0}
            onClick={() => scrollToPage(page - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="posts__arrow"
            aria-label="Nächste Beiträge"
            disabled={page >= pageCount - 1}
            onClick={() => scrollToPage(page + 1)}
          >
            →
          </button>
        </div>
        <div className="posts__dots" aria-hidden="true">
          {Array.from({ length: pageCount }, (_, i) => (
            <span key={i} className={`posts__dot${i === page ? " is-active" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
