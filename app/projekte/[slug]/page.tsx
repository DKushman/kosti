import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/lib/content/projekte";
import PageHero from "@/components/blocks/PageHero";
import Section from "@/components/blocks/Section";
import CtaBand from "@/components/blocks/CtaBand";
import Pic from "@/components/Pic";
import FillButton from "@/components/FillButton";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.name, description: project.intro };
}

export default async function ProjektPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main id="main" className="page page--light">
      <PageHero
        index={String(index + 1).padStart(2, "0")}
        eyebrow={`Projekt · ${project.category}`}
        title={project.name}
        lede={project.short}
      >
        <FillButton href="/projekte" className="btn-fill--sm">
          ← Alle Projekte
        </FillButton>
      </PageHero>

      <Section tone="paper" wide className="project-media">
        <div className="project-media__frame" data-reveal="clip">
          <Pic name={project.img} sizes="100vw" alt="" priority />
        </div>
      </Section>

      <Section tone="paper" className="project-body">
        <div className="project-body__grid">
          <div className="project-body__main">
            <p className="serif-lede" data-reveal="lines">{project.intro}</p>
            <div className="prose" data-reveal="stagger">
              {project.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {project.link ? (
              <FillButton href={project.link.href} className="btn-fill--sm" data-reveal="up">
                {project.link.label}
              </FillButton>
            ) : null}
          </div>
          <aside className="project-body__aside">
            <p className="eyebrow" data-reveal="up">{project.formatsTitle}</p>
            <ul className="taglist" role="list" data-reveal="stagger">
              {project.formats.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <dl className="facts facts--stack" data-reveal="stagger">
              <div>
                <dt>Bereich</dt>
                <dd>{project.category}</dd>
              </div>
              <div>
                <dt>Zeitraum</dt>
                <dd>{project.year}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <CtaBand
        title={`Nächstes Projekt: ${next.name}`}
        text={next.short}
        href={`/projekte/${next.slug}`}
        label="Weiter"
        tone="navy"
      />
    </main>
  );
}
