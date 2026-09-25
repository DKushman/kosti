"use client";

import {
  AGCITY_IMAGE,
  HYGH_NETWORK_IMAGE,
  MYBLN_IMAGE,
} from "@/lib/content/media-urls";
import { useNetDuoTiles, type NetDuoTileEl } from "@/lib/net-duo-tile";
import TransitionLink from "@/components/TransitionLink";

const PARTNERS = [
  {
    id: "ag-city",
    title: "AG City",
    handle: "Vorstandsvorsitzender bei AG City West",
    text: "Die Stimme der City West – Handel, Tourismus und Innenstadtentwicklung im Zusammenspiel.",
    href: "/projekte/ag-city",
    image: AGCITY_IMAGE,
  },
  {
    id: "mybln",
    title: "MyBLN",
    handle: "Vorstand bei MyBLN",
    text: "Echt. Laut. Berlin. – Menschen verbinden, damit aus Ideen gemeinsame Projekte werden.",
    href: "/projekte/mybln",
    image: MYBLN_IMAGE,
  },
  {
    id: "hygh",
    title: "HYGH",
    handle: "Director Direct Sales · HYGH",
    text: "Digitale Kommunikation im Stadtraum – vom Schaufenster bis zur Landmarke am Potsdamer Platz.",
    href: "/projekte/hygh",
    image: HYGH_NETWORK_IMAGE,
  },
] as const;

export default function NetworkPartnerDuo() {
  const { bindTile, onMouseEnter, onMouseMove, onMouseLeave } = useNetDuoTiles();

  return (
    <div className="net-duo">
      <div className="net-duo__grid" data-reveal="stagger">
        {PARTNERS.map((p) => {
          return (
            <TransitionLink
              key={p.id}
              href={p.href}
              className="net-duo__tile"
              ref={(el) => bindTile(p.id, el as NetDuoTileEl | null)}
              onMouseEnter={onMouseEnter}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              <div className="net-duo__media" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  alt=""
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
                <div className="net-duo__shade" />
              </div>
              <div className="net-duo__content">
                <p className="net-duo__handle">{p.handle}</p>
                <h2 className="net-duo__title">
                  <span className="net-duo__title-inner display">{p.title}</span>
                </h2>
                <p className="net-duo__text">{p.text}</p>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
