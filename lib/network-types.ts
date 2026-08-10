export type NetworkMember = {
  id: string;
  name: string;
  company: string;
  linkedin: string;
  bio: string;
  image: string;
};

export const CLOUDINARY_CLOUD = "dqcdbdt4v";

export function cloudinaryImageUrl(
  publicIdOrUrl: string,
  width = 800,
  height = width
): string {
  if (!publicIdOrUrl.includes("cloudinary.com")) {
    return publicIdOrUrl;
  }

  const transform = `f_auto,q_auto:good,w_${width},h_${height},c_fill,g_auto`;
  return publicIdOrUrl.replace(
    /\/upload\/(?:v\d+\/)?(?:[^/]+\/)*?/,
    `/upload/${transform}/`
  );
}
