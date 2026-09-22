import { useId, type RefObject } from "react";

type Props = {
  className?: string;
  svgRef?: RefObject<SVGSVGElement | null>;
  leftPupilRef?: RefObject<SVGCircleElement | null>;
  rightPupilRef?: RefObject<SVGCircleElement | null>;
};

const EYE = {
  left: { x: 30.6, y: 31.2 },
  right: { x: 49.4, y: 31.2 },
} as const;

/** Kosti-Gesicht (Über-mich-Hero). */
export default function KostiFace({
  className,
  svgRef,
  leftPupilRef,
  rightPupilRef,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const headClip = `kosti-head-clip-${uid}`;
  const eyeLeft = `kosti-eye-left-${uid}`;
  const eyeRight = `kosti-eye-right-${uid}`;
  const skin = `kosti-skin-${uid}`;

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={headClip}>
          <circle cx="40" cy="32" r="25.5" />
        </clipPath>
        <clipPath id={eyeLeft}>
          <ellipse cx={EYE.left.x} cy={EYE.left.y} rx="5.6" ry="5.8" />
        </clipPath>
        <clipPath id={eyeRight}>
          <ellipse cx={EYE.right.x} cy={EYE.right.y} rx="5.6" ry="5.8" />
        </clipPath>
        <linearGradient id={skin} x1="40" y1="6" x2="40" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B26538" />
          <stop offset="0.38" stopColor="#D08955" />
          <stop offset="1" stopColor="#D9A06A" />
        </linearGradient>
      </defs>
      <path
        className="about-hero__kosti-neck"
        d="M31 54 Q40 59 49 54 L51 63 Q40 68 29 63 Z"
      />
      <path
        className="about-hero__kosti-shirt"
        d="M6 80 V67 C8 59 18 57.5 26 62 C34 56 46 56 54 62 C62 57.5 72 59 74 67 V80 Z"
      />
      <ellipse cx="14.5" cy="34" rx="6.1" ry="7.4" fill="#d08955" />
      <ellipse cx="65.5" cy="34" rx="6.1" ry="7.4" fill="#d08955" />
      <ellipse cx="14.2" cy="35" rx="2.4" ry="3.4" className="about-hero__kosti-ear-inner" />
      <ellipse cx="65.8" cy="35" rx="2.4" ry="3.4" className="about-hero__kosti-ear-inner" />
      <circle cx="40" cy="32" r="25.5" fill={`url(#${skin})`} />
      <g clipPath={`url(#${headClip})`}>
        <path
          className="about-hero__kosti-beard"
          d="M15.2 31.5 C18 28 24 34 30 42 C34 47 37 43.8 40 43.8 C43 43.8 46 47 50 42 C56 34 62 28 64.8 31.5 C67.2 39 67.6 49 63 56.5 C57.5 65.5 48.5 68 40 68 C31.5 68 22.5 65.5 17 56.5 C12.4 49 12.8 39 15.2 31.5 Z"
        />
      </g>
      <ellipse className="about-hero__kosti-nose" cx="40" cy="37.4" rx="6.6" ry="5.4" />
      <ellipse className="about-hero__kosti-nose-shine" cx="37.2" cy="35.6" rx="2.2" ry="1.55" />
      <path className="about-hero__kosti-brow" d="M21.8 24.2 Q28.4 20.6 36.4 24.6" />
      <path className="about-hero__kosti-brow" d="M43.6 24.6 Q51.6 20.6 58.2 24.2" />
      <ellipse cx={EYE.left.x} cy={EYE.left.y} rx="5.6" ry="5.8" className="about-hero__kosti-eye" />
      <ellipse cx={EYE.right.x} cy={EYE.right.y} rx="5.6" ry="5.8" className="about-hero__kosti-eye" />
      <g clipPath={`url(#${eyeLeft})`}>
        <circle
          ref={leftPupilRef}
          cx={EYE.left.x}
          cy={EYE.left.y}
          r="3.05"
          className="about-hero__kosti-pupil"
        />
      </g>
      <g clipPath={`url(#${eyeRight})`}>
        <circle
          ref={rightPupilRef}
          cx={EYE.right.x}
          cy={EYE.right.y}
          r="3.05"
          className="about-hero__kosti-pupil"
        />
      </g>
      <path className="about-hero__kosti-shirt-front" d="M33 59.2 L38.6 80 L41.4 80 L47 59.2 Z" />
      <path className="about-hero__kosti-lapel" d="M18 61.2 L35.8 59.8 L38.6 80 L20 80 L8.5 72.5 Z" />
      <path className="about-hero__kosti-lapel" d="M62 61.2 L44.2 59.8 L41.4 80 L60 80 L71.5 72.5 Z" />
      <path className="about-hero__kosti-collar" d="M36.6 55 L29.4 55.3 L27.2 60.2 L35.8 59.6 Z" />
      <path className="about-hero__kosti-collar" d="M43.4 55 L50.6 55.3 L52.8 60.2 L44.2 59.6 Z" />
    </svg>
  );
}
