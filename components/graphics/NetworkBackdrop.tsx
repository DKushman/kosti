type Tone = "gold" | "navy" | "slate" | "sky";

const NODES: [number, number, number, Tone][] = [
  [200, 200, 10, "gold"],
  [88, 118, 5, "navy"],
  [318, 102, 5, "slate"],
  [342, 248, 6, "sky"],
  [102, 302, 5, "navy"],
  [268, 328, 5, "gold"],
  [168, 68, 4, "slate"],
  [48, 208, 4, "sky"],
  [200, 368, 4, "navy"],
  [292, 178, 4, "gold"],
  [128, 188, 3, "slate"],
  [248, 92, 3, "sky"],
];

const LINKS: [number, number, Tone][] = [
  [0, 1, "navy"],
  [0, 2, "slate"],
  [0, 3, "sky"],
  [0, 4, "navy"],
  [0, 5, "gold"],
  [0, 10, "slate"],
  [0, 11, "sky"],
  [1, 6, "slate"],
  [2, 11, "gold"],
  [3, 9, "navy"],
  [4, 7, "sky"],
  [4, 8, "navy"],
  [5, 8, "gold"],
  [5, 9, "slate"],
  [1, 7, "navy"],
  [2, 3, "sky"],
  [10, 1, "gold"],
  [11, 6, "slate"],
];

/** Colorful static network — motion only on parent wrapper (parallax + rotate). */
export default function NetworkBackdrop() {
  return (
    <svg
      className="net net--mission"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="net__edges">
        {LINKS.map(([a, b, tone]) => (
          <line
            key={`${a}-${b}`}
            data-tone={tone}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
          />
        ))}
      </g>
      <g className="net__nodes">
        {NODES.map(([x, y, r, tone], i) => (
          <circle
            key={i}
            data-tone={tone}
            cx={x}
            cy={y}
            r={r}
            className={i === 0 ? "is-core" : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
