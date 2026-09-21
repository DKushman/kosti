import type { ReactNode } from "react";
import RevealScope from "@/components/RevealScope";

type Props = {
  eyebrow: string;
  title: string;
  lede?: string;
  index?: string;
  children?: ReactNode;
  tone?: "paper" | "white" | "ink";
};

/**
 * Subpage opener: eyebrow + giant display title + lede. Title splits by
 * line; lede + children rise in.
 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  index,
  children,
  tone = "paper",
}: Props) {
  return (
    <RevealScope as="header" className={`page-hero page-hero--${tone}`}>
      <p className="page-hero__eyebrow eyebrow" data-reveal="up">
        {index ? <span className="page-hero__index">{index}</span> : null}
        {eyebrow}
      </p>
      <h1 className="page-hero__title display" data-reveal="lines">
        {title}
      </h1>
      {lede ? (
        <p className="page-hero__lede serif-lede" data-reveal="up" data-reveal-delay="0.2">
          {lede}
        </p>
      ) : null}
      {children ? (
        <div className="page-hero__extra" data-reveal="up" data-reveal-delay="0.3">
          {children}
        </div>
      ) : null}
      <span className="page-hero__rule" data-reveal="rule" aria-hidden="true" />
    </RevealScope>
  );
}
