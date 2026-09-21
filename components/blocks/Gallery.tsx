import Pic from "@/components/Pic";
import type { ImageName } from "@/lib/images";

const PLACEHOLDERS: ImageName[] = [
  "project-1", "sector-retail", "project-2", "sector-hospitality",
  "project-3", "sector-workplace", "project-4", "sector-exhibition", "hero",
];

type Props = { motifs: readonly string[] };

/**
 * Editorial image wall. TODO: replace placeholder art with photography;
 * captions are the motif list from the concept.
 */
export default function Gallery({ motifs }: Props) {
  return (
    <ul className="gallery" role="list" data-reveal="stagger">
      {motifs.map((motif, i) => (
        <li className={`gallery__item gallery__item--${(i % 5) + 1}`} key={motif}>
          <figure>
            <div className="gallery__media" >
              <Pic
                name={PLACEHOLDERS[i % PLACEHOLDERS.length]}
                sizes="(max-width: 700px) 50vw, 30vw"
                alt=""
              />
            </div>
            <figcaption className="gallery__caption">
              <span>{String(i + 1).padStart(2, "0")}</span>
              {motif}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
