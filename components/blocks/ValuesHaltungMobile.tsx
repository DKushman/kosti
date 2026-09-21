import { withBasePath } from "@/lib/site-path";

type ValueItem = { title: string; text: string; image: string };

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
  items: readonly ValueItem[];
};

/** Mobile haltung: section head + CSS scroll-snap swipe carousel. */
export default function ValuesHaltungMobile({ title, lede, items }: Props) {
  return (
    <div className="values-haltung-mobile">
      <header className="values-haltung-mobile__head">
        <h2 className="values-haltung-mobile__title">{title}</h2>
        <p className="values-haltung-mobile__lede">{lede}</p>
      </header>

      <div
        className="values-haltung-mobile__rail"
        tabIndex={0}
        role="region"
        aria-roledescription="Karussell"
        aria-label="Haltung und Werte"
      >
        <ul className="values-haltung-mobile__track" role="list">
          {items.map((item, i) => (
            <li key={item.title} className="values-haltung-mobile__slide" role="listitem">
              <article className="values-haltung-mobile__card">
                <div className="values-haltung-mobile__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBasePath(item.image)}
                    alt=""
                    width={960}
                    height={640}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <div className="values-haltung-mobile__copy">
                  <h2 className="values-haltung-mobile__card-title">{item.title}</h2>
                  <p className="values-haltung-mobile__card-text">{item.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
