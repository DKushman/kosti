import type { Metadata } from "next";
import { THEMEN } from "@/lib/content/themen";
import PageHero from "@/components/blocks/PageHero";
import Section from "@/components/blocks/Section";
import Tiles from "@/components/blocks/Tiles";
import CtaBand from "@/components/blocks/CtaBand";
import FillButton from "@/components/FillButton";
import Pic from "@/components/Pic";

export const metadata: Metadata = {
  title: "Themen",
  description:
    "Wirtschaft & Unternehmertum, IHK Berlin, Berlin gestalten, Innovation: die Themen von Konstantin Patsalides für Berlin.",
};

export default function ThemenPage() {
  const { wirtschaft, ihk, berlin, innovation } = THEMEN;

  return (
    <main id="main" className="page page--light">
      <PageHero
        index="02"
        eyebrow={THEMEN.hero.eyebrow}
        title={THEMEN.hero.title}
        lede={THEMEN.hero.lede}
      >
        <nav className="subnav" aria-label="Abschnitte">
          <a href="#wirtschaft">Wirtschaft</a>
          <a href="#ihk">IHK Berlin</a>
          <a href="#berlin">Berlin</a>
          <a href="#innovation">Innovation</a>
        </nav>
      </PageHero>

      <Section
        id={wirtschaft.id}
        tone="paper"
        eyebrow={wirtschaft.eyebrow}
        title={wirtschaft.title}
        lede={wirtschaft.lede}
      >
        <Tiles items={wirtschaft.tiles} columns={3} />
      </Section>

      <Section id={ihk.id} tone="ink" eyebrow={ihk.eyebrow} title={ihk.title} lede={ihk.lede}>
        <div className="ihk">
          <div className="ihk__goals">
            <h3 className="ihk__subtitle" data-reveal="up">{ihk.goalsTitle}</h3>
            <ol className="goals" role="list" data-reveal="stagger">
              {ihk.goals.map((g, i) => (
                <li className="goals__item" key={g}>
                  <span className="goals__num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{g}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="ihk__aside">
            <p className="eyebrow" data-reveal="up">Mein Ansatz</p>
            <ol className="steps" role="list" data-reveal="stagger">
              {ihk.approach.map((s) => (
                <li className="steps__item display" key={s}>{s}</li>
              ))}
            </ol>
            <blockquote className="ihk__statement" data-reveal="up">
              <p>{ihk.statement}</p>
            </blockquote>
          </aside>
        </div>
      </Section>

      <Section
        id={berlin.id}
        tone="white"
        eyebrow={berlin.eyebrow}
        title={berlin.title}
        lede={berlin.lede}
      >
        <Tiles items={berlin.tiles} columns={3} />
      </Section>

      <Section id={innovation.id} tone="navy" eyebrow={innovation.eyebrow} title={innovation.title}>
        <div className="split">
          <div className="split__media" data-reveal="clip">
            <Pic name="project-3" sizes="(max-width: 900px) 100vw, 44vw" alt="" />
          </div>
          <div className="split__body">
            <div className="prose prose--light" data-reveal="stagger">
              {innovation.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="question" data-reveal="up">{innovation.question}</p>
            <dl className="facts" data-reveal="stagger">
              {innovation.examples.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <FillButton href="/projekte/hygh" className="btn-fill--sm" data-reveal="up">
              Projekt HYGH
            </FillButton>
          </div>
        </div>
      </Section>

      <CtaBand
        title="Projekte statt Papier."
        text="Was aus diesen Themen konkret wird, zeigen die Projekte."
        href="/projekte"
        label="Zu den Projekten"
      />
    </main>
  );
}
