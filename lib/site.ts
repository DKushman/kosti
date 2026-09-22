/**
 * Single source of truth for site-wide facts: name, claim, navigation,
 * contact channels. Placeholders are marked with TODO.
 */
export const SITE = {
  name: "Konstantin Patsalides",
  shortName: "Konstantin Patsalides",
  /** TODO: finale Domain eintragen (wird für Sitemap, OpenGraph, Canonical genutzt) */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://konstantin-patsalides.de",
  claim: "Menschen verbinden. Berlin bewegen.",
  positioning:
    "Konstantin Patsalides verbindet Wirtschaft, Menschen und Ideen, um Berlin besser zu machen.",
  description:
    "Konstantin Patsalides – Unternehmer, Netzwerker und Stadtgestalter in Berlin. Wirtschaft, Menschen und Ideen verbinden, um Berlin besser zu machen.",
  /** TODO: E-Mail-Adresse bestätigen */
  email: "mail@konstantin-patsalides.de",
  linkedin: "https://www.linkedin.com/in/konstantin-patsalides-77b06a28/",
  instagram: "https://www.instagram.com/konstantin_patsalides_berlin/",
  location: "Berlin — 52.51° N, 13.40° E",
  credits: {
    label: "von DEVDESIGN",
    href: "https://devdesignstudio.de",
  },
} as const;

export type NavLink = { label: string; href: string; hint?: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Über Kosti", href: "/ueber-mich", hint: "Biografie & Haltung" },
  { label: "Projekte", href: "/projekte", hint: "MyBLN · AG City · HYGH" },
  { label: "Netzwerk", href: "/netzwerk", hint: "Menschen & Begegnungen" },
  { label: "Positionen", href: "/positionen", hint: "Gedanken für Berlin" },
  { label: "Kontakt", href: "/kontakt", hint: "Ins Gespräch kommen" },
];

/** Vollbild-Menü (Desktop-Layout). */
export const MENU_LINKS: NavLink[] = [
  { label: "Über Kosti", href: "/ueber-mich" },
  { label: "Projekte", href: "/projekte" },
  { label: "Netzwerk", href: "/netzwerk" },
  { label: "Positionen", href: "/positionen" },
  { label: "Kontakt", href: "/kontakt" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

export type FooterColumn = { title: string; links: NavLink[] };

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Profil",
    links: [
      { label: "Über mich", href: "/ueber-mich" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    title: "Inhalte",
    links: [
      { label: "Themen", href: "/themen" },
      { label: "Positionen", href: "/positionen" },
    ],
  },
  {
    title: "Projekte",
    links: [
      { label: "Projekte", href: "/projekte" },
      { label: "Netzwerk", href: "/netzwerk" },
    ],
  },
  {
    title: "Rechtliches",
    links: FOOTER_LINKS,
  },
  {
    title: "Direkt",
    links: [
      { label: "E-Mail", href: `mailto:${SITE.email}` },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/konstantin-patsalides-77b06a28/" },
      {
        label: "Instagram",
        href: "https://www.instagram.com/konstantin_patsalides_berlin/",
      },
    ],
  },
];
