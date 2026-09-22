"use client";

import { useRef, type MouseEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis-store";
import { scheduleRefresh } from "@/lib/st-refresh";
import { CAREER_STATIONS } from "@/lib/content/werdegang";

const SKIP_TARGET = "#projekte";

/**
 * Werdegang: horizontal pan starts only when the section is pinned (GSAP).
 */
export default function Werdegang() {
  const root = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const tickRefs = useRef<(HTMLLIElement | null)[]>([]);
  const count = CAREER_STATIONS.length;

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const rootEl = root.current;
      if (!scene || !viewport || !track || !rootEl) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const mobileMq = window.matchMedia("(max-width: 900px)");

      if (prefersReduced) return;

      if (mobileMq.matches) return;

      rootEl.classList.add("werdegang--enhanced");

      const travel = () => {
        const panelW = viewport.clientWidth;
        return Math.max(0, panelW * (count - 1));
      };

      let lastIdx = -1;
      const setActiveTicks = (progress: number) => {
        const idx = Math.min(
          count - 1,
          Math.max(0, Math.round(progress * (count - 1)))
        );
        if (idx === lastIdx) return;
        lastIdx = idx;
        tickRefs.current.forEach((el, i) => {
          if (!el) return;
          el.classList.toggle("is-active", i <= idx);
          el.classList.toggle("is-current", i === idx);
        });
      };

      const st = ScrollTrigger.create({
        trigger: scene,
        start: "top top",
        end: () => `+=${travel()}`,
        pin: true,
        scrub: 0.55,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const x = -self.progress * travel();
          gsap.set(track, { x });
          if (railFillRef.current) {
            gsap.set(railFillRef.current, { scaleY: self.progress });
          }
          setActiveTicks(self.progress);
        },
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      setActiveTicks(0);

      return () => {
        window.removeEventListener("resize", onResize);
        st.kill();
        rootEl.classList.remove("werdegang--enhanced");
      };
    },
    { scope: root, dependencies: [count] }
  );

  const skipSection = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToTarget(SKIP_TARGET);
    scheduleRefresh();
  };

  return (
    <section
      className="werdegang"
      id="werdegang"
      ref={root}
      aria-labelledby="werdegang-heading"
    >
      <h2 className="visually-hidden" id="werdegang-heading">
        Werdegang
      </h2>

      <div className="werdegang__scene" ref={sceneRef}>
        <div className="werdegang__sticky">
          <div className="werdegang__viewport" ref={viewportRef}>
            <div className="werdegang__track" ref={trackRef}>
              {CAREER_STATIONS.map((station) => (
                <article className="werdegang__panel" key={station.id}>
                  <div className="werdegang__panel-head">
                    {station.logoSrc ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        className="werdegang__logo"
                        src={station.logoSrc}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    ) : null}
                    <p className="werdegang__panel-year">{station.year}</p>
                    {station.active ? (
                      <p className="werdegang__status">
                        <span className="werdegang__status-dot" aria-hidden="true" />
                        Aktiv
                      </p>
                    ) : null}
                    <h3 className="werdegang__label">{station.label}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <nav className="werdegang__rail" aria-label="Werdegang Stationen">
            <div className="werdegang__rail-axis" aria-hidden="true">
              <span className="werdegang__rail-line" />
              <span className="werdegang__rail-fill" ref={railFillRef} />
            </div>
            <ol className="werdegang__rail-list" role="list">
              {CAREER_STATIONS.map((station, i) => (
                <li
                  key={station.id}
                  className={`werdegang__tick${station.active ? " is-live" : ""}`}
                  ref={(el) => {
                    tickRefs.current[i] = el;
                  }}
                >
                  {station.active ? (
                    <span className="werdegang__tick-dot" aria-hidden="true" />
                  ) : null}
                  <span className="werdegang__year">{station.year}</span>
                </li>
              ))}
            </ol>
          </nav>

          <a
            className="werdegang__skip link-underline"
            href={SKIP_TARGET}
            onClick={skipSection}
          >
            Überspringen
          </a>
        </div>
      </div>

      <ol className="werdegang__fallback" role="list">
        {CAREER_STATIONS.map((station) => (
          <li key={station.id} className="werdegang__fallback-item">
            <span className="werdegang__fallback-year">{station.year}</span>
            <div className="werdegang__fallback-row">
              {station.active ? (
                <p className="werdegang__status werdegang__status--fallback">
                  <span className="werdegang__status-dot" aria-hidden="true" />
                  Aktiv
                </p>
              ) : null}
              {station.logoSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="werdegang__fallback-logo"
                  src={station.logoSrc}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <p className="werdegang__fallback-label">{station.label}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
