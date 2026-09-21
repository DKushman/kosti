import { withBasePath } from "@/lib/site-path";

export type CareerStation = {
  id: string;
  year: string;
  label: string;
  /** Firmenlogo (LinkedIn og:image, sofern verfügbar). */
  logoSrc?: string;
  /** Laufende Rolle – grüner „Aktiv“-Hinweis in der Timeline. */
  active?: boolean;
};

const wd = (file: string) => withBasePath(`/img/werdegang/${file}`);

/** Startseite – Werdegang (LinkedIn „Erfahrung“, chronologisch). */
export const CAREER_STATIONS: CareerStation[] = [
  {
    id: "rbb",
    year: "1999",
    label: "Marketingassistent · Rundfunk Berlin-Brandenburg (rbb)",
    logoSrc: wd("rbb.png"),
  },
  {
    id: "tubco",
    year: "2009",
    label: "Hochschulmanager · TUB/CO – TU Berlin Corporate",
    logoSrc: wd("tubco.png"),
  },
  {
    id: "mci",
    year: "2012",
    label: "Senior Project Manager Logistik · MCI Group",
    logoSrc: wd("mci.png"),
  },
  {
    id: "ta-panta-ri",
    year: "2013",
    label: "Partner · Restaurant Ta Panta Ri",
    logoSrc: wd("tapantari.png"),
  },
  {
    id: "pavoc",
    year: "2013",
    label: "Geschäftsführer · PAVOC Kommunikationsagentur",
    logoSrc: wd("pavoc.png"),
  },
  {
    id: "domaene-dahlem",
    year: "2015",
    label: "Prokurist / Leitung Events und Messen · Stiftung Domäne Dahlem",
    logoSrc: wd("domaene.png"),
  },
  {
    id: "tunnel",
    year: "2017",
    label: "Markenbotschafter · The Tunnel",
    active: true,
  },
  {
    id: "hygh-kam",
    year: "2022",
    label: "Key-Account-Manager · HYGH",
    logoSrc: wd("hygh.png"),
  },
  {
    id: "hygh-senior",
    year: "2024",
    label: "Senior Strategic Sales Manager · HYGH",
    logoSrc: wd("hygh.png"),
    active: true,
  },
  {
    id: "ag-city",
    year: "2025",
    label: "Vorstandsmitglied · AG City e. V.",
    logoSrc: wd("ag-city.png"),
    active: true,
  },
  {
    id: "hygh-director",
    year: "2025",
    label: "Director Direct Sales & Strategic-/Public-Partnerships · HYGH",
    logoSrc: wd("hygh.png"),
    active: true,
  },
];
