"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  cloudinaryImageUrl,
  type NetworkMember,
} from "@/lib/network-types";

type ViewMode = "grid" | "list";

type NetworkDirectoryProps = {
  members: NetworkMember[];
};

const COLUMN_OFFSETS = [0, 72, 144, 36];

function LinkedInIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="1" y="2" width="14" height="2.5" rx="0.5" />
      <rect x="1" y="6.75" width="14" height="2.5" rx="0.5" />
      <rect x="1" y="11.5" width="14" height="2.5" rx="0.5" />
    </svg>
  );
}

function MemberCard({
  member,
  view,
  eager = false,
}: {
  member: NetworkMember;
  view: ViewMode;
  eager?: boolean;
}) {
  const [showBio, setShowBio] = useState(false);
  const imageSrc = cloudinaryImageUrl(
    member.image,
    view === "list" ? 160 : 800
  );

  return (
    <article
      className={`network-card network-card--${view}${showBio ? " is-expanded" : ""}`}
      data-member={member.id}
    >
      <div className="network-card__media">
        <Image
          src={imageSrc}
          alt=""
          width={view === "list" ? 80 : 400}
          height={view === "list" ? 80 : 400}
          sizes={
            view === "list"
              ? "80px"
              : "(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 24vw"
          }
          className="network-card__img"
          loading={eager ? "eager" : "lazy"}
        />

        {member.bio && view === "grid" ? (
          <div className="network-card__overlay" aria-hidden={!showBio}>
            <p className="network-card__bio">{member.bio}</p>
          </div>
        ) : null}
      </div>

      <div className="network-card__body">
        <div className="network-card__text">
          <h2 className="network-card__name">{member.name}</h2>
          {member.company ? (
            <p className="network-card__company">{member.company}</p>
          ) : null}
          {member.bio && view === "list" ? (
            <p className="network-card__bio network-card__bio--inline">
              {member.bio}
            </p>
          ) : null}
        </div>

        <div className="network-card__actions">
          {member.bio && view === "grid" ? (
            <button
              type="button"
              className="network-card__plus"
              aria-label={`Mehr über ${member.name}`}
              aria-pressed={showBio}
              onClick={() => setShowBio((v) => !v)}
            >
              <PlusIcon />
            </button>
          ) : null}
          {member.linkedin ? (
            <a
              href={member.linkedin}
              className="network-card__linkedin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} auf LinkedIn`}
            >
              <LinkedInIcon />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function splitIntoColumns(members: NetworkMember[], count: number) {
  const columns: NetworkMember[][] = Array.from({ length: count }, () => []);
  members.forEach((member, index) => {
    columns[index % count].push(member);
  });
  return columns;
}

function useColumnCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 560) setCount(2);
      else if (width < 900) setCount(3);
      else setCount(4);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export default function NetworkDirectory({ members }: NetworkDirectoryProps) {
  const [view, setView] = useState<ViewMode>("grid");
  const columnCount = useColumnCount();
  const columns = useMemo(
    () => splitIntoColumns(members, columnCount),
    [members, columnCount]
  );
  const columnOffsets = COLUMN_OFFSETS.slice(0, columnCount);

  return (
    <section className="network" aria-labelledby="network-heading">
      <header className="network__toolbar">
        <div
          className="network__view-toggle"
          role="group"
          aria-label="Ansicht wechseln"
        >
          <button
            type="button"
            className={`network__view-btn${view === "grid" ? " is-active" : ""}`}
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            aria-label="Rasteransicht"
          >
            <GridIcon />
          </button>
          <button
            type="button"
            className={`network__view-btn${view === "list" ? " is-active" : ""}`}
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            aria-label="Listenansicht"
          >
            <ListIcon />
          </button>
        </div>

        <p className="network__count">{members.length} Mitglieder</p>
      </header>

      {view === "grid" ? (
        <div
          className="network__masonry"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          }}
          role="list"
        >
          {columns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="network__column"
              style={{ paddingTop: `${columnOffsets[columnIndex] ?? 0}px` }}
              role="presentation"
            >
              {column.map((member, itemIndex) => (
                <div key={member.id} role="listitem">
                  <MemberCard
                    member={member}
                    view="grid"
                    eager={columnIndex === 0 && itemIndex < 2}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="network__grid network__grid--list" role="list">
          {members.map((member) => (
            <div key={member.id} role="listitem">
              <MemberCard member={member} view="list" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
