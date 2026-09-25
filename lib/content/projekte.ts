import type { ImageName } from "@/lib/images";
import { withBasePath } from "@/lib/site-path";
import {
  AGCITY_IMAGE,
  HYGH_NETWORK_IMAGE,
  HYGH_PROJECT_IMAGE,
  MYBLN_IMAGE,
} from "@/lib/content/media-urls";

export { HYGH_NETWORK_IMAGE, HYGH_PROJECT_IMAGE, MYBLN_IMAGE, AGCITY_IMAGE };
/** @deprecated alias */
export const HYGH_IMAGE = HYGH_NETWORK_IMAGE;

export type Project = {
  slug: string;
  name: string;
  short: string;
  category: string;
  year: string;
  img: ImageName;
  /** Direkte Cloudinary-URL statt lokalem Pic */
  image?: string;
  intro: string;
  body: string[];
  formatsTitle: string;
  formats: string[];
  link?: { label: string; href: string };
};

export const PROJECTS: Project[] = [
  {
    slug: "mybln",
    name: "MyBLN",
    short: "Echt. Laut. Berlin.",
    category: "Netzwerk — Berlin",
    year: "seit 2024",
    img: "project-1",
    image: MYBLN_IMAGE,
    intro:
      "MyBLN bringt Menschen aus Wirtschaft, Kultur, Politik, Wissenschaft, Sport und Gesellschaft zusammen. Nicht Visitenkarten stehen im Mittelpunkt, sondern die Frage: Was können wir gemeinsam für Berlin bewegen?",
    body: [
      "Berlin hat außergewöhnlich viele kluge, kreative und engagierte Menschen, die sich oft nur noch nicht kennen. MyBLN ist der Rahmen, in dem aus Begegnungen Kooperationen werden.",
      "Die Formate sind bewusst unterschiedlich – vom Empfang bis zum Kiez-Format – aber alle folgen demselben Prinzip: Menschen zusammenbringen und Räume schaffen, in denen Neues entstehen kann.",
    ],
    formatsTitle: "Formate",
    formats: [
      "MyBLN Neujahrsempfang",
      "Underground Connections",
      "May the 4th",
      "Berliner Heldenlicht",
      "12 Bezirke × Meine Stadt",
    ],
    link: { label: "Zum MyBLN-Netzwerk", href: "/netzwerk" },
  },
  {
    slug: "ag-city",
    name: "AG City",
    short: "Die Stimme der City West.",
    category: "Vorstand — City West",
    year: "laufend",
    img: "project-2",
    image: AGCITY_IMAGE,
    intro:
      "Die AG City ist seit Jahrzehnten eine wichtige Stimme der Berliner City West. Als Teil des Vorstands arbeite ich an den Themen, die den Ku'damm und seine Umgebung als Zentrum stark halten.",
    body: [
      "Innenstadtentwicklung, Handel, Tourismus, Mobilität, Kultur, Veranstaltungen, Digitalisierung, Aufenthaltsqualität und Standortmarketing – die City West braucht alle diese Bausteine gleichzeitig.",
      "Gute Stadtentwicklung funktioniert nicht in Silos. Deshalb bringt die AG City Eigentümer, Händler, Gastronomen, Kultur und Politik an einen Tisch.",
    ],
    formatsTitle: "Schwerpunkte",
    formats: [
      "Ku'damm",
      "Stadtentwicklung",
      "Handel",
      "Tourismus",
      "Mobilität",
      "Kultur",
      "Veranstaltungen",
    ],
  },
  {
    slug: "hygh",
    name: "HYGH",
    short: "Digitale Kommunikation im Stadtraum.",
    category: "Digital Out of Home — Berlin",
    year: "laufend",
    img: "project-3",
    image: HYGH_PROJECT_IMAGE,
    intro:
      "Digital Out of Home verbindet Technologie, Werbung, Architektur, Handel und Stadtentwicklung. Bei HYGH arbeite ich daran, wie Kommunikation Teil der digitalen Infrastruktur einer Metropole wird.",
    body: [
      "Vom digitalen Schaufenster bis zur großformatigen Landmarke am Potsdamer Platz: Digitale Flächen prägen, wie eine Stadt wahrgenommen wird – von Bewohnern, Besuchern und Unternehmen.",
      "Die Leitfrage bleibt dieselbe: Wie können neue Technologien sinnvoll Teil unserer Stadt werden?",
    ],
    formatsTitle: "Umsetzungen",
    formats: [
      "Potsdamer Platz",
      "The Center",
      "Digitale Premium-Vitrinen",
      "Ku'damm",
      "Sonderumsetzungen",
      "Live-Übertragungen",
      "Markenaktivierungen",
    ],
  },
  {
    slug: "zukunftsorte",
    name: "Zukunftsorte Berlin",
    short: "Wissenschaft trifft Wirtschaft.",
    category: "Innovation — Berlin",
    year: "laufend",
    img: "project-4",
    image: withBasePath("/img/pexels-burkaycanatar-30036675.webp"),
    intro:
      "Berlins Wissenschafts-, Technologie- und Innovationsstandorte stärker mit Wirtschaft und Stadt verbinden – damit aus Forschung wirtschaftlicher Erfolg wird.",
    body: [
      "Die Zukunftsorte sind Berlins Antwort auf die Frage, wo Innovation entsteht. Ihre Wirkung entfalten sie erst, wenn Unternehmen, Start-ups, Wissenschaft und Stadtgesellschaft dort tatsächlich zusammenkommen.",
      "Dafür braucht es Sichtbarkeit, Erreichbarkeit und Formate, die Menschen über Disziplinen hinweg ins Gespräch bringen.",
    ],
    formatsTitle: "Ziele",
    formats: [
      "Wissenschaft und Wirtschaft verbinden",
      "Innovationsstandorte sichtbar machen",
      "Start-ups und etablierte Unternehmen zusammenbringen",
      "Innovationsquartiere stärken",
    ],
  },
  {
    slug: "expo-2035",
    name: "EXPO 2035",
    short: "Eine Bühne für die Stadt von morgen.",
    category: "Internationale Sichtbarkeit — Berlin",
    year: "Vision",
    img: "hero",
    image: withBasePath("/img/pexels-bence-szemerey-337043-7081214.webp"),
    intro:
      "Eine EXPO als gemeinsamer Zukunftsprozess für Berlin – und als internationale Bühne für Lösungen der Stadt von morgen.",
    body: [
      "Andere Metropolen investieren massiv in Projekte mit Strahlkraft. Eine EXPO wäre für Berlin mehr als eine Veranstaltung: ein Anlass, Infrastruktur, Innovation, Kultur und Tourismus über Jahre gemeinsam zu denken.",
      "Berlin sollte seine internationale Rolle selbstbewusster wahrnehmen. Die EXPO 2035 ist dafür die größtmögliche Einladung.",
    ],
    formatsTitle: "Themenfelder",
    formats: [
      "Zukunftsprozess für Berlin",
      "Internationale Bühne",
      "Infrastruktur & Innovation",
      "Kultur & Tourismus",
      "Standortmarketing",
    ],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
