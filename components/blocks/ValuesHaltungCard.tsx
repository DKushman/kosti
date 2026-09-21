import { withBasePath } from "@/lib/site-path";

type Item = { title: string; text: string; image: string };

type Props = {
  item: Item;
  className?: string;
  priority?: boolean;
  /** Center slot: mask shows the photo */
  hideMedia?: boolean;
  /** Center slot: caption lives on the mask overlay */
  hideCaption?: boolean;
};

/** Value card — image + caption on gray glass panel. */
export function ValuesHaltungCard({
  item,
  className,
  priority,
  hideMedia = false,
  hideCaption = false,
}: Props) {
  return (
    <article className={`values-haltung-card${className ? ` ${className}` : ""}`}>
      {hideMedia ? null : (
        <div className="values-haltung-card__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath(item.image)}
            alt=""
            width={960}
            height={640}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : undefined}
          />
        </div>
      )}
      {hideCaption ? null : (
        <div className="values-haltung-card__body">
          <h3 className="values-haltung-card__title">{item.title}</h3>
          <p className="values-haltung-card__text">{item.text}</p>
        </div>
      )}
    </article>
  );
}
