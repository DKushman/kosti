import { withBasePath } from "@/lib/site-path";

export const PARTNER_LOGOS = [
  {
    src: withBasePath("/img/HYGH-logo-white.svg"),
    alt: "HYGH",
    href: "/projekte/hygh",
    variant: "partner" as const,
  },
  {
    src: withBasePath("/img/MyBLN_Logo.svg"),
    alt: "MyBLN",
    href: "/projekte/mybln",
    variant: "partner" as const,
  },
  {
    src: withBasePath("/img/logo-ag-city.webp"),
    alt: "AG City Berlin",
    href: "/projekte/ag-city",
    variant: "partner-wide" as const,
  },
] as const;

/** Hero meta row — same partner set as footer. */
export const HERO_PARTNER_LOGOS = PARTNER_LOGOS;
