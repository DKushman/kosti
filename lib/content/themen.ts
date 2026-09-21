export type Tile = { title: string; text: string };

export const THEMEN = {
  hero: {
    eyebrow: "Themen",
    title: "Wirtschaft. Berlin. Innovation.",
    lede:
      "Gute Rahmenbedingungen, eine Verwaltung, die ermöglicht, und eine Stadt, die international mithält – meine Themen für Berlin.",
  },
  wirtschaft: {
    id: "wirtschaft",
    eyebrow: "Wirtschaft & Unternehmertum",
    title: "Berlin braucht eine starke Wirtschaft.",
    lede:
      "Eine funktionierende Stadt braucht erfolgreiche Unternehmen. Die Herausforderungen kenne ich nicht nur aus Gesprächen, sondern aus eigener beruflicher und unternehmerischer Erfahrung.",
    tiles: [
      { title: "Weniger Bürokratie", text: "Energie gehört in Produkte, Mitarbeiter und Kunden – nicht in administrative Prozesse." },
      { title: "Planungssicherheit", text: "Investitionen entstehen dort, wo Entscheidungen nachvollziehbar und Rahmenbedingungen verlässlich sind." },
      { title: "Mittelstand stärken", text: "Familienunternehmen, Mittelstand, Gastronomie, Handel, Handwerk und Dienstleister sind das wirtschaftliche Rückgrat Berlins." },
      { title: "Gründungen ermöglichen", text: "Berlin als Ort, an dem Menschen den Mut haben, Unternehmen und neue Ideen aufzubauen." },
      { title: "Fachkräfte & Ausbildung", text: "Qualifizierte Mitarbeiter und attraktive Perspektiven für junge Menschen." },
      { title: "Verwaltung als Partner", text: "Eine moderne Verwaltung, die wirtschaftliche Entwicklung ermöglicht statt verhindert." },
    ] as Tile[],
  },
  ihk: {
    id: "ihk",
    eyebrow: "IHK Berlin",
    title: "Wirtschaft gemeinsam gestalten.",
    lede:
      "Mich verbindet eine langjährige Beziehung zur Berliner Wirtschaft und zur IHK. Berliner Unternehmen habe ich aus vielen Perspektiven erlebt – als Mitarbeiter, Unternehmer, Vertriebler, Projektentwickler, Netzwerker und Vertreter wirtschaftlicher Interessen.",
    goalsTitle: "Dafür möchte ich mich einsetzen",
    goals: [
      "weniger Bürokratie für Berliner Unternehmen",
      "schnellere und digitalere Verwaltungsprozesse",
      "bessere Bedingungen für Mittelstand und Gründer",
      "attraktive und erreichbare Berliner Geschäftsquartiere",
      "Stärkung von Ausbildung und Fachkräften",
      "bessere Vernetzung zwischen Unternehmen, Politik und Verwaltung",
      "mehr Sichtbarkeit für Innovationen aus Berlin",
      "eine starke internationale Positionierung Berlins",
    ],
    approach: ["Zuhören.", "Menschen verbinden.", "Lösungen entwickeln.", "Umsetzen."],
    statement:
      "Die IHK sollte nicht nur Interessen vertreten, sondern auch eine Plattform sein, auf der Unternehmer voneinander lernen, gemeinsame Interessen erkennen und neue Kooperationen entstehen.",
  },
  berlin: {
    id: "berlin",
    eyebrow: "Berlin gestalten",
    title: "Berlin kann mehr.",
    lede:
      "Berlin gehört zu den spannendsten Städten Europas – aber internationaler Erfolg ist kein Selbstläufer. Andere Metropolen investieren massiv in Infrastruktur, Innovation, Digitalisierung, Kultur, Tourismus und Standortmarketing.",
    tiles: [
      { title: "Wirtschaftsstandort", text: "Ein Ort, an dem Unternehmen investieren, wachsen und Arbeitsplätze schaffen wollen." },
      { title: "Innenstadt", text: "City West, Ku'damm, Potsdamer Platz und andere Zentren brauchen Handel, Gastronomie, Kultur, Veranstaltungen und attraktive öffentliche Räume." },
      { title: "Mobilität", text: "Erreichbar für Bewohner, Mitarbeiter, Kunden und Besucher." },
      { title: "Innovation", text: "Wissenschaft, Start-ups, etablierte Unternehmen und Kreativwirtschaft stärker verbinden." },
      { title: "Internationale Sichtbarkeit", text: "Projekte mit Strahlkraft: EXPO 2035, Olympische Spiele, Zukunftsorte, House of Games, neue Innovationsquartiere." },
    ] as Tile[],
  },
  innovation: {
    id: "innovation",
    eyebrow: "Innovation & die Stadt von morgen",
    title: "Technologie sichtbar machen.",
    paragraphs: [
      "Meine berufliche Arbeit bei HYGH dreht sich um Digital Out of Home. Digitale Kommunikation im öffentlichen Raum verbindet Technologie, Werbung, Architektur, Handel und Stadtentwicklung.",
      "Digitale Screens in Schaufenstern, Premium-Standorte am Kurfürstendamm, großformatige digitale Landmarken am Potsdamer Platz: Kommunikation wird zunehmend Teil der digitalen Infrastruktur einer Metropole.",
    ],
    question: "Wie können neue Technologien sinnvoll Teil unserer Stadt werden?",
    examples: [
      { label: "Schaufenster", value: "Digitale Screens" },
      { label: "Kurfürstendamm", value: "Premium-Standorte" },
      { label: "Potsdamer Platz", value: "Digitale Landmarken" },
    ],
  },
} as const;

/** Startseite – Block 3 „Meine Themen“ */
export const HOME_THEMES = [
  { name: "Wirtschaft", href: "/themen#wirtschaft", img: "sector-workplace", text: "Gute Rahmenbedingungen, Planungssicherheit und eine Verwaltung, die wirtschaftliche Entwicklung ermöglicht." },
  { name: "Berlin", href: "/themen#berlin", img: "hero", text: "Lebenswerte Metropole und international wettbewerbsfähiger Wirtschaftsstandort." },
  { name: "Innovation", href: "/themen#innovation", img: "sector-exhibition", text: "Neue Technologien und Geschäftsmodelle als Chance für Berlin." },
  { name: "Netzwerke", href: "/netzwerk", img: "sector-hospitality", text: "Wirtschaft, Politik, Wissenschaft, Kultur und Gesellschaft zusammenbringen." },
  { name: "Gesellschaft", href: "/ueber-mich#haltung", img: "sector-retail", text: "Wirtschaftlichen Erfolg mit gesellschaftlicher Verantwortung verbinden." },
] as const;
