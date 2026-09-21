type Tile = { title: string; text: string };

type Props = {
  items: readonly Tile[];
  columns?: 2 | 3;
  tone?: "light" | "dark";
};

/** Numbered tile grid with a growing gold rule on hover. */
export default function Tiles({ items, columns = 3, tone = "light" }: Props) {
  return (
    <ul
      className={`tiles tiles--${columns} tiles--${tone}`}
      role="list"
      data-reveal="stagger"
    >
      {items.map((item, i) => (
        <li className="tile" key={item.title}>
          <span className="tile__num">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="tile__title">{item.title}</h3>
          <p className="tile__text">{item.text}</p>
          <span className="tile__rule" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}
