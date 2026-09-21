import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/content/projekte";
import { ARTICLES } from "@/lib/content/positionen";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/ueber-mich", "/themen", "/projekte", "/netzwerk", "/positionen", "/kontakt"];
  return [
    ...pages.map((p) => ({
      url: `${SITE.url}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    })),
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/projekte/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...ARTICLES.map((a) => ({
      url: `${SITE.url}/positionen/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
