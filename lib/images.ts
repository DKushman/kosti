import manifest from "@/lib/image-manifest.json";
import { withBasePath } from "@/lib/site-path";

type Entry = {
  /** Fallback src (original JPEG, or the largest WebP variant for WebP sources) */
  src: string;
  width: number;
  height: number;
  widths: number[];
  lqip: string;
};
type Manifest = Record<string, Entry>;

const IMAGES = manifest as Manifest;

export type ImageName = keyof typeof manifest;

export type ImageSet = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  lqip: string;
};

/** Responsive sources for an optimized image (see scripts/optimize-images.mjs). */
export function imageSet(name: ImageName): ImageSet {
  const entry = IMAGES[name];
  if (!entry) {
    return { src: withBasePath(`/img/${name}.jpg`), srcSet: "", width: 0, height: 0, lqip: "" };
  }
  return {
    src: withBasePath(entry.src),
    srcSet: entry.widths
      .map((w) => `${withBasePath(`/img/w/${name}-${w}.webp`)} ${w}w`)
      .join(", "),
    width: entry.width,
    height: entry.height,
    lqip: entry.lqip,
  };
}

/**
 * Responsive set for a content path such as "/img/foo.webp". Falls back to
 * the plain file when no optimized variants exist for it.
 */
export function imageSetForPath(path: string): ImageSet {
  const match = path.match(/^\/img\/([^/]+)\.(?:jpe?g|webp|png)$/i);
  const name = match?.[1];
  if (name && name in IMAGES) return imageSet(name as ImageName);
  return { src: withBasePath(path), srcSet: "", width: 0, height: 0, lqip: "" };
}
