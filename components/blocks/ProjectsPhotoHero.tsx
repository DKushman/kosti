import PhotoPageHero from "@/components/blocks/PhotoPageHero";

/** Projekte photo hero — thin wrapper around shared PhotoPageHero. */
export default function ProjectsPhotoHero() {
  return (
    <PhotoPageHero
      imageSrc="/pexels-truephotography-7185092.webp"
      titleLineA="Projek"
      titleLineB="te"
      scrollHref="#projekte-list"
      scrollLabel="Zu den Projekten ↓"
    />
  );
}
