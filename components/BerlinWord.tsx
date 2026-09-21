import { withBasePath } from "@/lib/site-path";

type Props = {
  className?: string;
};

/** „Berlin“ mit Bär-Grafik anstelle des „i“. */
export default function BerlinWord({ className }: Props) {
  return (
    <span
      className={className ? `berlin-word ${className}` : "berlin-word"}
      aria-label="Berlin"
    >
      Berl
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="berlin-word__bear"
        src={withBasePath("/img/image 17.png")}
        alt=""
        width={48}
        height={64}
        decoding="async"
        draggable={false}
      />
      n
    </span>
  );
}
