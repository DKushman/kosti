import manifest from "@/lib/image-manifest.json";
import { withBasePath } from "@/lib/site-path";

type Manifest = Record<
  string,
  { width: number; height: number; widths: number[]; lqip: string }
>;

const IMAGES = manifest as Manifest;

export type ImageName = keyof typeof manifest;

/** Responsive sources for an optimized image (see scripts/optimize-images.mjs). */
export function imageSet(name: ImageName) {
  const entry = IMAGES[name];
  const src = withBasePath(`/img/${name}.jpg`);
  if (!entry) return { src, srcSet: "", width: 0, height: 0, lqip: "" };
  return {
    src,
    srcSet: entry.widths
      .map((w) => `${withBasePath(`/img/w/${name}-${w}.webp`)} ${w}w`)
      .join(", "),
    width: entry.width,
    height: entry.height,
    lqip: entry.lqip,
  };
}
