import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ARTICLES,
  ARTICLES_SORTED,
  formatDate,
  getArticle,
} from "@/lib/content/positionen";
import { SITE } from "@/lib/site";
import RevealScope from "@/components/RevealScope";
import ShareButton from "@/components/blocks/ShareButton";
import ArticleNextReads from "@/components/blocks/ArticleNextReads";
import Pic from "@/components/Pic";
type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", publishedTime: article.date, title: article.title, description: article.excerpt },
  };
}

export default async function ArtikelPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const idx = ARTICLES_SORTED.findIndex((a) => a.slug === slug);
  const n = ARTICLES_SORTED.length;
  const nextReads = [
    ARTICLES_SORTED[(idx + 1) % n],
    ARTICLES_SORTED[(idx + 2) % n],
  ];
  const url = `${SITE.url}/positionen/${article.slug}`;

  return (
    <main id="main" className="page page--light">
      <RevealScope as="article" className="article">
        <header className="article__head">
          <div className="article__meta" data-reveal="up">
            <span className="article__meta-cat">{article.category}</span>
            <span className="article__meta-sep" aria-hidden="true" />
            <time className="article__meta-date" dateTime={article.date}>
              {formatDate(article.date)}
            </time>
            <ShareButton title={article.title} url={url} variant="icon" />
          </div>
          <h1 className="article__title display" data-reveal="lines">
            {article.title}
          </h1>
          <p className="article__excerpt serif-lede" data-reveal="up" data-reveal-delay="0.15">
            {article.excerpt}
          </p>
        </header>

        {article.img ? (
          <div className="article__media" data-reveal="clip">
            <Pic name={article.img} sizes="(max-width: 1100px) 100vw, 1100px" alt="" priority />
          </div>
        ) : null}

        <div className="article__body prose prose--lg" data-reveal="stagger">
          {article.body.map((p) => (
            <p key={p}>{p.startsWith("> ") ? p.slice(2) : p}</p>
          ))}
        </div>
      </RevealScope>

      <ArticleNextReads articles={nextReads} />
    </main>
  );
}
