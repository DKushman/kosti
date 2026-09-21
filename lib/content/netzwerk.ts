export const NETZWERK = {
  hero: {
    eyebrow: "Netzwerk",
    title: "Die besten Projekte entstehen selten allein.",
    lede:
      "Berlin hat außergewöhnlich viele kluge, kreative und engagierte Menschen, die sich oft nur noch nicht kennen. Vernetzung ist kein Selbstzweck. Ein gutes Netzwerk schafft konkrete Projekte.",
  },
  networks: [
    {
      id: "mybln",
      name: "MyBLN",
      claim: "Echt. Laut. Berlin.",
      text:
        "MyBLN bringt Menschen aus Wirtschaft, Kultur, Politik, Wissenschaft, Sport und Gesellschaft zusammen. Nicht Visitenkarten stehen im Mittelpunkt, sondern die Frage: Was können wir gemeinsam für Berlin bewegen?",
      href: "/projekte/mybln",
    },
    {
      id: "ag-city",
      name: "AG City",
      claim: "Die Stimme der City West.",
      text:
        "Seit Jahrzehnten eine wichtige Stimme der Berliner City West. Als Teil des Vorstands arbeite ich an Innenstadtentwicklung, Handel, Tourismus, Mobilität, Kultur, Veranstaltungen, Digitalisierung, Aufenthaltsqualität und Standortmarketing.",
      href: "/projekte/ag-city",
    },
    {
      id: "wirtschaft-politik",
      name: "Wirtschaft × Politik × Stadtgesellschaft",
      claim: "Keine Silos.",
      text:
        "Gute Stadtentwicklung funktioniert nicht in Silos. Unternehmer treffen Politik. Start-ups treffen etablierte Unternehmen. Wissenschaft trifft Stadtgesellschaft. Kultur trifft Wirtschaft. Daraus entstehen neue Perspektiven und konkrete Projekte.",
      href: "/themen",
    },
  ],
  kiez: {
    eyebrow: "Kiez & lokales Engagement",
    title: "Eine Stadt beginnt im Kiez.",
    paragraphs: [
      "Große Stadtentwicklung und lokale Gemeinschaft sind keine Gegensätze. Mein Kiezcafé im Pangea-Haus in Berlin-Wilmersdorf verbindet Gastronomie mit Begegnung, Kultur, Familienangeboten und gesellschaftlichem Austausch.",
    ],
    principle: [
      "Aus einem Kaffee ein Gespräch.",
      "Aus einem Gespräch eine Idee.",
      "Aus einer Idee ein gemeinsames Projekt.",
    ],
    closing:
      "Dieses Prinzip beschreibt auch meine Vorstellung von Berlin: Menschen zusammenbringen und Räume schaffen, in denen Neues entstehen kann.",
  },
  encounters: {
    eyebrow: "Menschen & Begegnungen",
    title: "Wer Berlin bewegt.",
    lede:
      "Keine Prominentengalerie, sondern eine persönliche Fotowand – thematisch erzählt. Unternehmerinnen und Unternehmer, Politik, Kultur, Sport und Menschen, die sich für Berlin engagieren.",
    categories: [
      { id: "wirtschaft", label: "Wirtschaft", text: "Unternehmerinnen, Unternehmer, Wirtschaftsvertreter" },
      { id: "politik", label: "Politik", text: "Gespräche über konkrete Herausforderungen der Berliner Wirtschaft und Stadtentwicklung" },
      { id: "kultur", label: "Kultur", text: "Menschen, die Berlin kulturell prägen" },
      { id: "sport", label: "Sport", text: "Sport als Wirtschaftsfaktor und verbindendes Element" },
      { id: "gesellschaft", label: "Gesellschaft", text: "Menschen und Initiativen, die sich für Berlin engagieren" },
    ],
  },
} as const;

export type Encounter = {
  id: string;
  category: "wirtschaft" | "politik" | "kultur" | "sport" | "gesellschaft";
  /** Bildunterschrift: Person · Anlass · Thema · Jahr */
  person: string;
  occasion: string;
  topic: string;
  year: string;
  img: "project-1" | "project-2" | "project-3" | "project-4" | "sector-retail" | "sector-hospitality" | "sector-workplace" | "sector-exhibition" | "hero";
};

/**
 * TODO: Echte Fotos + Bildunterschriften einsetzen (inkl. Einverständnis
 * der abgebildeten Personen). Bis dahin: Platzhalter je Kategorie.
 */
export const ENCOUNTERS: Encounter[] = [
  { id: "e1", category: "wirtschaft", person: "Foto folgt", occasion: "Unternehmergespräch", topic: "Wirtschaft", year: "—", img: "sector-workplace" },
  { id: "e2", category: "politik", person: "Foto folgt", occasion: "Politisches Gespräch", topic: "Stadtentwicklung", year: "—", img: "project-2" },
  { id: "e3", category: "kultur", person: "Foto folgt", occasion: "Kulturveranstaltung", topic: "Kultur", year: "—", img: "sector-exhibition" },
  { id: "e4", category: "sport", person: "Foto folgt", occasion: "Sportveranstaltung", topic: "Sport", year: "—", img: "project-4" },
  { id: "e5", category: "gesellschaft", person: "Foto folgt", occasion: "Soziales Projekt", topic: "Gesellschaft", year: "—", img: "sector-hospitality" },
  { id: "e6", category: "wirtschaft", person: "Foto folgt", occasion: "MyBLN Neujahrsempfang", topic: "Netzwerk", year: "—", img: "project-1" },
  { id: "e7", category: "politik", person: "Foto folgt", occasion: "AG City", topic: "City West", year: "—", img: "sector-retail" },
  { id: "e8", category: "gesellschaft", person: "Foto folgt", occasion: "Mein Kiezcafé", topic: "Kiez", year: "—", img: "project-3" },
];
