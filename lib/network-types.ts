export type NetworkMember = {
  id: string;
  name: string;
  company: string;
  linkedin: string;
  bio: string;
  image: string;
};

export {
  CLOUDINARY_CLOUD_FALLBACK as CLOUDINARY_CLOUD,
  cloudinaryImageUrl,
} from "@/lib/cloudinary";
