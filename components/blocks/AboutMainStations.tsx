import { ABOUT } from "@/lib/content/about";
import { withBasePath } from "@/lib/site-path";
import FillButton from "@/components/FillButton";

const STATIONS = ABOUT.mainStations;
const TOTAL = STATIONS.length;

/**
 * CSS sticky stack: intro sticks for full stack height; cards overlap below.
 */
export default function AboutMainStations() {
  return (
    <section id="stationen" className="about-stations">
      <div className="about-stations__stack">
        <div className="about-stations__intro-bar">
          <h2 id="about-stations-heading" className="about-stations__intro">
            <span className="about-stations__pulse" aria-hidden="true" />
            <span className="about-stations__intro-text">
              Meine derzeitigen
              <br className="about-stations__intro-br" aria-hidden="true" />
              Hauptprojekte
            </span>
          </h2>
          <FillButton href="/projekte">Alle anzeigen</FillButton>
        </div>

        {STATIONS.map((station, i) => (
          <article
            key={station.id}
            id={`station-${station.id}`}
            className="about-stations__slot about-stations__slot--card"
          >
            <div className="about-stations__sticky">
              <header className="about-stations__bar">
                <span className="about-stations__count">
                  ( {i + 1} / {TOTAL} )
                </span>
              </header>

              <div className="about-stations__rule" role="presentation" />

              <div className="about-stations__core">
                <div className="about-stations__rail">
                  <span className="about-stations__code">{station.code}</span>
                </div>

                <figure className="about-stations__figure">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBasePath(station.image)}
                    alt=""
                    width={960}
                    height={1200}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </figure>

                <h3 className="about-stations__title">{station.title}</h3>
                <p className="about-stations__text">{station.text}</p>
              </div>

              <div className="about-stations__rule" role="presentation" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
