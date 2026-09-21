/**
 * Stylised neighbourhood sketch around Pangea Haus / Bundesallee,
 * Wilmersdorf. Streets are suggested, not surveyed.
 */
export default function KiezMap() {
  return (
    <svg
      className="kiez-map"
      viewBox="0 0 240 320"
      role="img"
      aria-label="Umgebungsskizze: Pangea Haus an der Bundesallee, Berlin-Wilmersdorf"
    >
      <rect width="240" height="320" fill="#F3F1EA" />

      <g className="kiez-map__fabric" fill="#e6e1d6">
        <rect x="14" y="18" width="18" height="28" rx="1.2" />
        <rect x="36" y="22" width="22" height="20" rx="1.2" />
        <rect x="40" y="64" width="26" height="32" rx="1.2" />
        <rect x="14" y="78" width="20" height="24" rx="1.2" />
        <rect x="16" y="118" width="28" height="18" rx="1.2" />
        <rect x="14" y="154" width="22" height="30" rx="1.2" />
        <rect x="42" y="148" width="18" height="22" rx="1.2" />
        <rect x="16" y="202" width="24" height="26" rx="1.2" />
        <rect x="44" y="214" width="20" height="34" rx="1.2" />
        <rect x="18" y="258" width="30" height="22" rx="1.2" />
        <rect x="78" y="16" width="24" height="26" rx="1.2" />
        <rect x="84" y="58" width="18" height="36" rx="1.2" />
        <rect x="78" y="112" width="22" height="20" rx="1.2" />
        <rect x="82" y="198" width="20" height="28" rx="1.2" />
        <rect x="76" y="244" width="26" height="22" rx="1.2" />
        <rect x="148" y="14" width="22" height="30" rx="1.2" />
        <rect x="176" y="20" width="28" height="22" rx="1.2" />
        <rect x="152" y="58" width="18" height="24" rx="1.2" />
        <rect x="178" y="62" width="32" height="36" rx="1.2" />
        <rect x="150" y="102" width="24" height="18" rx="1.2" />
        <rect x="182" y="118" width="28" height="26" rx="1.2" />
        <rect x="150" y="198" width="20" height="24" rx="1.2" />
        <rect x="178" y="206" width="30" height="20" rx="1.2" />
        <rect x="152" y="244" width="26" height="28" rx="1.2" />
        <rect x="186" y="252" width="24" height="32" rx="1.2" />
        <rect x="148" y="286" width="22" height="18" rx="1.2" />
      </g>

      <g className="kiez-map__park" fill="#d9d3c4">
        <path d="M14 24c22-8 44 4 50 22 5 16-6 32-22 38-20 7-42-2-48-20-5-16 6-34 20-40z" />
        <path d="M172 228c20-6 42 8 48 26 4 14-6 30-22 34-18 5-40-6-46-22-5-14 6-32 20-38z" />
        <circle cx="38" cy="44" r="2.2" fill="#cfc8b6" />
        <circle cx="52" cy="38" r="1.6" fill="#cfc8b6" />
        <circle cx="28" cy="52" r="1.8" fill="#cfc8b6" />
        <circle cx="196" cy="248" r="2.2" fill="#cfc8b6" />
        <circle cx="208" cy="258" r="1.6" fill="#cfc8b6" />
      </g>

      <g
        fill="none"
        stroke="#0b0b0e"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M118 4 L132 316" strokeWidth="2.6" />
        <path d="M4 104 C64 90 148 116 236 88" strokeWidth="1.9" />
        <path d="M4 182 C86 166 152 194 236 176" strokeWidth="1.7" />
        <path d="M38 4 L30 316" strokeWidth="1.25" opacity="0.5" />
        <path d="M200 4 L216 316" strokeWidth="1.25" opacity="0.5" />
        <path d="M4 52 H236" strokeWidth="1.1" opacity="0.4" />
        <path d="M4 246 H236" strokeWidth="1.1" opacity="0.4" />
        <path d="M4 140 H236" strokeWidth="0.95" opacity="0.3" />
        <path d="M4 214 H236" strokeWidth="0.9" opacity="0.26" />
        <path d="M74 4 L66 316" strokeWidth="0.95" opacity="0.32" />
        <path d="M166 4 L176 316" strokeWidth="0.95" opacity="0.32" />
        <path d="M4 78 H236" strokeWidth="0.7" opacity="0.18" />
        <path d="M4 164 H236" strokeWidth="0.7" opacity="0.18" />
        <path d="M4 278 H236" strokeWidth="0.75" opacity="0.2" />
        <path d="M50 4 L46 316" strokeWidth="0.65" opacity="0.16" />
        <path d="M150 4 L158 316" strokeWidth="0.65" opacity="0.16" />
        <path d="M188 4 L196 316" strokeWidth="0.65" opacity="0.16" />
        <path
          d="M8 292 C70 268 130 304 232 270"
          strokeWidth="1.15"
          strokeDasharray="3 3.5"
          opacity="0.45"
        />
      </g>

      <g fill="#0b0b0e" opacity="0.22">
        <circle cx="121" cy="52" r="1.15" />
        <circle cx="124" cy="104" r="1.15" />
        <circle cx="127" cy="140" r="1.15" />
        <circle cx="129" cy="182" r="1.15" />
        <circle cx="131" cy="214" r="1.15" />
        <circle cx="133" cy="246" r="1.15" />
        <circle cx="74" cy="104" r="1.05" />
        <circle cx="166" cy="98" r="1.05" />
        <circle cx="38" cy="182" r="1.05" />
        <circle cx="200" cy="176" r="1.05" />
      </g>

      <g fill="#0b0b0e" fontFamily="inherit">
        <text x="14" y="16" fontSize="7" letterSpacing="0.2em">
          WILMERSDORF
        </text>
        <text
          x="140"
          y="72"
          fontSize="6.2"
          letterSpacing="0.14em"
          transform="rotate(6.5 140 72)"
          opacity="0.55"
        >
          BUNDESALLEE
        </text>
        <text x="42" y="98" fontSize="5.6" opacity="0.42">
          Hohenzollerndamm
        </text>
        <text x="16" y="176" fontSize="5.4" opacity="0.36">
          Berliner Str.
        </text>
        <text x="148" y="136" fontSize="5.4" opacity="0.36">
          Spichernstr.
        </text>
        <text x="150" y="242" fontSize="5.6" opacity="0.4">
          Prager Platz
        </text>
        <text x="16" y="286" fontSize="5.2" opacity="0.32" letterSpacing="0.08em">
          U9
        </text>
      </g>

      <g transform="translate(126 168)">
        <circle r="18" fill="none" stroke="#b8995a" strokeWidth="1" opacity="0.85" />
        <circle r="13" fill="#F3F1EA" />
        <path
          d="M0 -16 C-9 -16 -14 -9 -14 -2 C-14 8 0 18 0 18 C0 18 14 8 14 -2 C14 -9 9 -16 0 -16 Z"
          fill="#0b0b0e"
        />
        <circle cy="-4" r="3.35" fill="#F3F1EA" />
        <text y="36" textAnchor="middle" fontSize="7.4" fontWeight="700" fill="#0b0b0e">
          Pangea Haus
        </text>
      </g>
    </svg>
  );
}
