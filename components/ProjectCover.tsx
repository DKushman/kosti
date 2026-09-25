import type { ImgHTMLAttributes } from "react";
import Pic from "@/components/Pic";
import type { Project } from "@/lib/content/projekte";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  project: Pick<Project, "img" | "image">;
  sizes: string;
  priority?: boolean;
};

/** Lokales Pic oder direkte Cloudinary-URL (z. B. HYGH). */
export default function ProjectCover({
  project,
  sizes,
  priority = false,
  alt = "",
  ...rest
}: Props) {
  if (project.image) {
    const eager = priority || Boolean(project.image);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        draggable={false}
        {...rest}
      />
    );
  }

  return (
    <Pic
      name={project.img}
      sizes={sizes}
      alt={alt}
      priority={priority}
      {...rest}
    />
  );
}
