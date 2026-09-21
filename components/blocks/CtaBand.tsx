import RevealScope from "@/components/RevealScope";
import FillButton from "@/components/FillButton";

type Props = {
  title: string;
  text?: string;
  href: string;
  label: string;
  tone?: "gold" | "navy" | "ink";
};

/** Full-width call-to-action strip at the end of a subpage. */
export default function CtaBand({ title, text, href, label, tone = "gold" }: Props) {
  return (
    <RevealScope as="section" className={`cta-band cta-band--${tone}`}>
      <h2 className="cta-band__title display" data-reveal="lines">
        {title}
      </h2>
      {text ? (
        <p className="cta-band__text serif-lede" data-reveal="up">
          {text}
        </p>
      ) : null}
      <FillButton
        href={href}
        className={tone === "gold" ? undefined : "btn-fill--on-dark"}
        data-reveal="up"
        data-reveal-delay="0.1"
      >
        {label}
        <span aria-hidden="true">↗</span>
      </FillButton>
    </RevealScope>
  );
}
