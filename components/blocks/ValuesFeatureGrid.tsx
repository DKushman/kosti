import type { ReactNode } from "react";

type ValueItem = { title: string; text: string };

type Props = {
  items: readonly ValueItem[];
};

/** CSS/SVG dot icons for value cards — hover via CSS only. */
export function ValueIcon({ index }: { index: number }) {
  const gold = "var(--gold-light)";
  const patterns: ReactNode[] = [
    <>
      <circle cx="7" cy="7" r="2.2" fill={gold} />
      <circle cx="17" cy="7" r="2.2" fill={gold} />
      <circle cx="12" cy="12" r="2.2" fill={gold} />
      <circle cx="7" cy="17" r="2.2" fill={gold} />
      <circle cx="17" cy="17" r="2.2" fill={gold} />
    </>,
    <>
      <circle cx="6" cy="12" r="2" fill={gold} />
      <circle cx="12" cy="8" r="2.2" fill={gold} />
      <circle cx="18" cy="12" r="2" fill={gold} />
      <circle cx="12" cy="16" r="2.2" fill={gold} />
    </>,
    <>
      <circle cx="8" cy="8" r="2" fill={gold} />
      <circle cx="16" cy="8" r="2" fill={gold} />
      <circle cx="12" cy="12" r="2.4" fill={gold} />
      <circle cx="8" cy="16" r="2" fill={gold} />
      <circle cx="16" cy="16" r="2" fill={gold} />
    </>,
    <>
      <circle cx="12" cy="6" r="2" fill={gold} />
      <circle cx="8" cy="12" r="2" fill={gold} />
      <circle cx="16" cy="12" r="2" fill={gold} />
      <circle cx="12" cy="18" r="2" fill={gold} />
    </>,
    <>
      <circle cx="7" cy="10" r="1.8" fill={gold} />
      <circle cx="12" cy="7" r="2.2" fill={gold} />
      <circle cx="17" cy="10" r="1.8" fill={gold} />
      <circle cx="9" cy="16" r="2" fill={gold} />
      <circle cx="15" cy="16" r="2" fill={gold} />
    </>,
  ];

  return (
    <span
      className={`value-features__icon value-features__icon--${index}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={24} height={24} focusable="false">
        {patterns[index % patterns.length]}
      </svg>
    </span>
  );
}

export default function ValuesFeatureGrid({ items }: Props) {
  return (
    <ul className="value-features" role="list" data-reveal="stagger">
      {items.map((item, i) => (
        <li className="value-features__item" key={item.title}>
          <ValueIcon index={i} />
          <h3 className="value-features__title">{item.title}</h3>
          <p className="value-features__text">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
