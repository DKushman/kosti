"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Encounter } from "@/lib/content/netzwerk";
import Pic from "@/components/Pic";

type Category = { id: string; label: string; text: string };

type Props = {
  items: readonly Encounter[];
  categories: readonly Category[];
};

/**
 * Filterable photo wall („Menschen & Begegnungen“). Filtering animates
 * cards out/in with a FLIP-free fade+rise to stay cheap on mobile.
 */
export default function PhotoWall({ items, categories }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("alle");
  const visible = items.filter((it) => filter === "alle" || it.category === filter);
  const activeCategory = categories.find((c) => c.id === filter);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-wall-card]", root.current);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", clearProps: "all" }
      );
    },
    { scope: root, dependencies: [filter] }
  );

  return (
    <div className="wall" ref={root}>
      <div className="wall__filters" role="group" aria-label="Nach Bereich filtern">
        <button
          type="button"
          className={`chip chip--btn${filter === "alle" ? " is-active" : ""}`}
          aria-pressed={filter === "alle"}
          onClick={() => setFilter("alle")}
        >
          Alle
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chip chip--btn${filter === c.id ? " is-active" : ""}`}
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="wall__hint" aria-live="polite">
        {activeCategory ? activeCategory.text : "Wirtschaft · Politik · Kultur · Sport · Gesellschaft"}
      </p>

      <ul className="wall__grid" role="list">
        {visible.map((it) => (
          <li className="wall__item" key={it.id} data-wall-card>
            <figure>
              <div className="wall__media">
                <Pic name={it.img} sizes="(max-width: 700px) 50vw, 25vw" alt="" />
                <span className="wall__tag">{categories.find((c) => c.id === it.category)?.label}</span>
              </div>
              <figcaption className="wall__caption">
                <strong>{it.person}</strong>
                <span>
                  {it.occasion} · {it.topic} · {it.year}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
