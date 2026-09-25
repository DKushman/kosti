/** Cloudinary delivery helpers (cloud: dqcdbdt4v, Media Library folder „KOSTI“). */

export const CLOUDINARY_CLOUD_FALLBACK = "dqcdbdt4v";

export function cloudinaryCloudName(): string {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    CLOUDINARY_CLOUD_FALLBACK
  );
}

export type CloudinaryTransform = {
  width?: number;
  height?: number;
  crop?: "fill" | "limit" | "scale" | "fit";
  gravity?: "auto" | "center" | "face";
  quality?: "auto" | "auto:good" | "auto:best";
  format?: "auto" | "webp" | "jpg";
};

function transformSegment(t: CloudinaryTransform): string {
  const parts: string[] = [];
  parts.push(`f_${t.format ?? "auto"}`);
  parts.push(`q_${t.quality ?? "auto:good"}`);
  if (t.width) parts.push(`w_${t.width}`);
  if (t.height) parts.push(`h_${t.height}`);
  if (t.crop) parts.push(`c_${t.crop}`);
  if (t.gravity) parts.push(`g_${t.gravity}`);
  return parts.join(",");
}

/**
 * Build a delivery URL from a public_id (or pass through an existing Cloudinary URL).
 */
export function cloudinaryUrl(
  publicIdOrUrl: string,
  transform: CloudinaryTransform = {}
): string {
  if (publicIdOrUrl.includes("cloudinary.com")) {
    return cloudinaryImageUrlFromFullUrl(publicIdOrUrl, transform);
  }

  const cloud = cloudinaryCloudName();
  const segment = transformSegment(transform);
  const id = publicIdOrUrl.replace(/^\//, "");
  return `https://res.cloudinary.com/${cloud}/image/upload/${segment}/${id}`;
}

function cloudinaryImageUrlFromFullUrl(
  url: string,
  transform: CloudinaryTransform
): string {
  const segment = transformSegment(transform);
  return url.replace(
    /\/upload\/(?:v\d+\/)?(?:[^/]+\/)*?/,
    `/upload/${segment}/`
  );
}

/** Resize an existing Cloudinary URL (Netzwerk-Portraits). */
export function cloudinaryImageUrl(
  publicIdOrUrl: string,
  width = 800,
  height = width
): string {
  if (!publicIdOrUrl.includes("cloudinary.com")) {
    return publicIdOrUrl;
  }
  return cloudinaryImageUrlFromFullUrl(publicIdOrUrl, {
    width,
    height,
    crop: "fill",
    gravity: "auto",
  });
}

const DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920] as const;

export function cloudinarySrcSet(
  publicId: string,
  widths: readonly number[] = DEFAULT_WIDTHS,
  base: Omit<CloudinaryTransform, "width"> = { crop: "limit" }
): string {
  return widths
    .map((w) => `${cloudinaryUrl(publicId, { ...base, width: w })} ${w}w`)
    .join(", ");
}
