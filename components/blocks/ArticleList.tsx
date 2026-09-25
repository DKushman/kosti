"use client";

import { useState } from "react";
import {
  ARTICLE_CATEGORIES,
  type Article,
  type ArticleCategory,
} from "@/lib/content/positionen";
import ArticleCover from "@/components/ArticleCover";
import TransitionLink from "@/components/TransitionLink";

type Props = { articles: readonly Article[] };

function readingMinutes(article: Article) {
  const words = article.body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

type ArticleFilter = ArticleCategory | "alle";

/** Category-filterable article index for „Gedanken für Berlin“. */
export default function ArticleList({ articles }: Props) {
  const [category, setCategory] = useState<ArticleFilter>("alle");
  const list = articles.filter((a) => category === "alle" || a.category === category);

  return (
    <div className="articles">
      <header className="articles__head">
        <h2 className="articles__title serif-lede">
          Hier ein paar ausgewählte Artikel
        </h2>

        <label className="articles__filter-select">
          <span className="visually-hidden">Kategorie wählen</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ArticleFilter)}
          >
            <option value="alle">Alle</option>
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}
              </option>
            ))}
          </select>
        </label>

        <div
          className="articles__filters articles__filters--chips"
          role="group"
          aria-label="Kategorie wählen"
        >
          <button
            type="button"
            className={`chip chip--btn${category === "alle" ? " is-active" : ""}`}
            aria-pressed={category === "alle"}
            onClick={() => setCategory("alle")}
          >
            Alle
          </button>
          {ARTICLE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip chip--btn${category === c.id ? " is-active" : ""}`}
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.id}
            </button>
          ))}
        </div>
      </header>

      <ul className="articles__grid" role="list">
        {list.map((article) => (
          <li key={article.slug}>
            <TransitionLink
              href={`/positionen/${article.slug}`}
              className="article-card"
            >
              <span className="article-card__media">
                <ArticleCover
                  article={article}
                  sizes="(max-width: 700px) 100vw, 33vw"
                  alt=""
                />
              </span>
              <span className="article-card__glass">
                <span className="article-card__pill">
                  <span className="article-card__pill-dot" aria-hidden="true" />
                  {article.category}
                </span>
                <span className="article-card__title">{article.title}</span>
                <span className="article-card__meta">
                  <time dateTime={article.date}>{formatDateShort(article.date)}</time>
                  <span className="article-card__meta-sep" aria-hidden="true">
                    {" "}
                    ·{" "}
                  </span>
                  {readingMinutes(article)} Min.
                </span>
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
