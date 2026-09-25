import type { ImgHTMLAttributes } from "react";
import Pic from "@/components/Pic";
import type { Article } from "@/lib/content/positionen";
import type { ImageName } from "@/lib/images";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  article: Article;
  sizes: string;
  priority?: boolean;
};

function fallbackName(article: Article): ImageName {
  return article.img ?? "project-1";
}

export default function ArticleCover({
  article,
  sizes,
  priority = false,
  alt = "",
  ...rest
}: Props) {
  if (article.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={article.image}
        alt={alt}
        loading={article.image || priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        draggable={false}
        {...rest}
      />
    );
  }

  return (
    <Pic
      name={fallbackName(article)}
      sizes={sizes}
      alt={alt}
      priority={priority}
      {...rest}
    />
  );
}
