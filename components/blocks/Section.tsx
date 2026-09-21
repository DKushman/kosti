import type { ReactNode } from "react";
import RevealScope from "@/components/RevealScope";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  tone?: "paper" | "white" | "ink" | "navy" | "gold";
  children?: ReactNode;
  className?: string;
  wide?: boolean;
};

/** Content section with a consistent head (eyebrow · title · lede). */
export default function Section({
  id,
  eyebrow,
  title,
  lede,
  tone = "paper",
  children,
  className,
  wide = false,
}: Props) {
  return (
    <RevealScope
      as="section"
      id={id}
      className={`block block--${tone}${wide ? " block--wide" : ""}${className ? ` ${className}` : ""}`}
    >
      {eyebrow || title || lede ? (
        <header className="block__head">
          {eyebrow ? (
            <p className="eyebrow block__eyebrow" data-reveal="up">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="block__title display" data-reveal="lines">
              {title}
            </h2>
          ) : null}
          {lede ? (
            <p className="block__lede serif-lede" data-reveal="up" data-reveal-delay="0.15">
              {lede}
            </p>
          ) : null}
        </header>
      ) : null}
      {children}
    </RevealScope>
  );
}
