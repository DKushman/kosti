import { withBasePath } from "@/lib/site-path";

const postCover = (slug: string) => withBasePath(`/img/posts/${slug}.webp`);

export type ArticleCategory =
  | "Wirtschaft"
  | "Stadtentwicklung"
  | "Innovation"
  | "Berlin international"
  | "Menschen";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: ArticleCategory;
  tags: string[];
  /** Absätze; Zeilen mit vorangestelltem "> " werden als Zitat gesetzt */
  body: string[];
  /** TODO: Link zum LinkedIn-Originalbeitrag */
  linkedin?: string;
  img?: "project-1" | "project-2" | "project-3" | "project-4" | "hero" | "sector-workplace" | "sector-exhibition";
  /** WebP unter public/img/posts/ (Pexels) */
  image?: string;
};

export const ARTICLE_CATEGORIES: { id: ArticleCategory; question: string }[] = [
  { id: "Wirtschaft", question: "Was brauchen Berliner Unternehmen?" },
  { id: "Stadtentwicklung", question: "Wie schaffen wir attraktive Zentren?" },
  { id: "Innovation", question: "Wie wird aus Forschung wirtschaftlicher Erfolg?" },
  { id: "Berlin international", question: "Wie behauptet Berlin seine Position unter internationalen Metropolen?" },
  { id: "Menschen", question: "Begegnungen mit Persönlichkeiten, die etwas bewegen." },
];

/** Themenlandkarte (Konzept 13) */
export const THEME_MAP = [
  { group: "Wirtschaft", items: ["Unternehmertum", "Mittelstand", "Start-ups", "Bürokratie", "Fachkräfte"] },
  { group: "Stadt", items: ["Innenstadt", "Mobilität", "Handel", "Öffentlicher Raum", "Tourismus"] },
  { group: "Innovation", items: ["Digitalisierung", "Medien", "KI", "Zukunftsorte", "Gaming"] },
  { group: "Gesellschaft", items: ["Vielfalt", "Integration", "Antisemitismus", "Zusammenhalt"] },
  { group: "Berlin international", items: ["EXPO 2035", "Internationale Beziehungen", "Tourismus", "Standortmarketing"] },
  { group: "Netzwerke", items: ["Wirtschaft", "Politik", "Wissenschaft", "Kultur", "Gesellschaft"] },
] as const;

/**
 * Erste Beiträge – Entwürfe auf Basis des Konzepttextes.
 * TODO: Durch überarbeitete LinkedIn-Beiträge ersetzen / ergänzen.
 */
export const ARTICLES: Article[] = [
  {
    slug: "weniger-buerokratie-mehr-unternehmertum",
    title: "Weniger Bürokratie, mehr Unternehmertum",
    excerpt:
      "Energie gehört in Produkte, Mitarbeiter und Kunden – nicht in administrative Prozesse. Warum Planungssicherheit die wichtigste Standortpolitik ist.",
    date: "2026-08-24",
    category: "Wirtschaft",
    tags: ["Bürokratie", "Mittelstand", "Verwaltung"],
    img: "sector-workplace",
    image: postCover("weniger-buerokratie-mehr-unternehmertum"),
    body: [
      "Eine funktionierende Stadt braucht erfolgreiche Unternehmen. Das klingt selbstverständlich, ist es in Berlin aber nicht immer. Wer ein Unternehmen führt, kennt die Situation: Zu viel Zeit fließt in Formulare, Genehmigungen und Abstimmungen – Zeit, die in Produkte, Mitarbeiter und Kunden gehört.",
      "Investitionen entstehen dort, wo Entscheidungen nachvollziehbar und Rahmenbedingungen verlässlich sind. Planungssicherheit ist deshalb keine Nebensache, sondern die wichtigste Standortpolitik, die eine Stadt betreiben kann.",
      "> Familienunternehmen, Mittelstand, Gastronomie, Handel, Handwerk und Dienstleister sind das wirtschaftliche Rückgrat Berlins.",
      "Was es braucht, ist eine Verwaltung, die sich als Partner der Wirtschaft versteht: schneller, digitaler, lösungsorientiert. Nicht, weil Regeln unwichtig wären – sondern weil eine Stadt nur dann wächst, wenn Menschen den Mut haben, hier Unternehmen und neue Ideen aufzubauen.",
    ],
  },
  {
    slug: "die-city-west-braucht-alles-gleichzeitig",
    title: "Die City West braucht alles gleichzeitig",
    excerpt:
      "Handel, Gastronomie, Kultur, Veranstaltungen und attraktive öffentliche Räume: Warum Innenstädte nur als Ganzes funktionieren.",
    date: "2026-07-13",
    category: "Stadtentwicklung",
    tags: ["Innenstadt", "Ku'damm", "AG City"],
    img: "project-2",
    image: postCover("die-city-west-braucht-alles-gleichzeitig"),
    body: [
      "City West, Ku'damm, Potsdamer Platz – Berlins Zentren stehen im Wettbewerb. Nicht nur untereinander, sondern mit den Innenstädten anderer europäischer Metropolen. Wer dort gewinnt, hat verstanden, dass ein Zentrum kein Einkaufsort ist, sondern ein Erlebnisraum.",
      "Handel braucht Gastronomie. Gastronomie braucht Kultur. Kultur braucht Veranstaltungen. Und alles zusammen braucht öffentliche Räume, in denen sich Menschen gerne aufhalten – und eine Mobilität, die Bewohner, Mitarbeiter, Kunden und Besucher gleichermaßen ankommen lässt.",
      "> Gute Stadtentwicklung funktioniert nicht in Silos.",
      "In der AG City arbeiten wir genau daran: Eigentümer, Händler, Gastronomen, Kultur und Politik an einen Tisch zu bringen. Denn die Stadt von morgen entsteht nicht in einer Abteilung, sondern im Austausch.",
    ],
  },
  {
    slug: "wie-technologie-teil-der-stadt-wird",
    title: "Wie Technologie Teil der Stadt wird",
    excerpt:
      "Digitale Screens, Premium-Standorte, Landmarken: Kommunikation wird zur Infrastruktur einer Metropole. Eine Leitfrage – und ein paar Antworten.",
    date: "2026-06-02",
    category: "Innovation",
    tags: ["Digital Out of Home", "HYGH", "Digitalisierung"],
    img: "project-3",
    image: postCover("wie-technologie-teil-der-stadt-wird"),
    body: [
      "Digitale Kommunikation im öffentlichen Raum verbindet Technologie, Werbung, Architektur, Handel und Stadtentwicklung. Was früher ein Plakat war, ist heute Teil der digitalen Infrastruktur einer Stadt.",
      "Digitale Screens in Schaufenstern, Premium-Standorte am Kurfürstendamm, großformatige digitale Landmarken am Potsdamer Platz: Diese Flächen prägen, wie Berlin wahrgenommen wird – und sie können mehr als Werbung. Sie können informieren, verbinden und eine Stadt in Echtzeit erzählen.",
      "> Wie können neue Technologien sinnvoll Teil unserer Stadt werden?",
      "Die Antwort liegt nicht in mehr Technik, sondern in besserer Verbindung: zwischen Wissenschaft, Start-ups, etablierten Unternehmen und Kreativwirtschaft. Berlin hat all das. Es muss es nur häufiger zusammenbringen.",
    ],
  },
  {
    slug: "berlin-sollte-selbstbewusster-auftreten",
    title: "Berlin sollte selbstbewusster auftreten",
    excerpt:
      "Andere Metropolen investieren massiv in Infrastruktur, Innovation und Standortmarketing. Berlin kann mehr – und sollte es zeigen.",
    date: "2026-05-11",
    category: "Berlin international",
    tags: ["EXPO 2035", "Standortmarketing", "Internationale Beziehungen"],
    img: "hero",
    image: postCover("berlin-sollte-selbstbewusster-auftreten"),
    body: [
      "Berlin gehört zu den spannendsten Städten Europas. Aber internationaler Erfolg ist kein Selbstläufer. Andere Metropolen investieren massiv in Infrastruktur, Innovation, Digitalisierung, Kultur, Tourismus und Standortmarketing.",
      "Meine eigene Geschichte verbindet Berlin mit Europa und insbesondere mit Zypern. Sie hat mir gezeigt, wie viel Kraft in Beziehungen zwischen Städten steckt: Städtepartnerschaften, Tourismus, internationale Unternehmen, Austausch zwischen Metropolen.",
      "> Berlin sollte seine internationale Rolle selbstbewusster wahrnehmen.",
      "Projekte mit Strahlkraft – EXPO 2035, Zukunftsorte, neue Innovationsquartiere – sind keine Prestigefragen. Sie sind der Anlass, Infrastruktur, Innovation, Kultur und Tourismus über Jahre gemeinsam zu denken.",
    ],
  },
  {
    slug: "aus-einem-kaffee-ein-gespraech",
    title: "Aus einem Kaffee ein Gespräch",
    excerpt:
      "Eine Stadt beginnt im Kiez. Was ein Kiezcafé in Wilmersdorf über Berlin erzählt – und über die Menschen, die es bewegen.",
    date: "2026-04-06",
    category: "Menschen",
    tags: ["Kiez", "Begegnung", "Wilmersdorf"],
    img: "project-4",
    image: postCover("aus-einem-kaffee-ein-gespraech"),
    body: [
      "Große Stadtentwicklung und lokale Gemeinschaft sind keine Gegensätze. Mein Kiezcafé im Pangea-Haus in Berlin-Wilmersdorf verbindet Gastronomie mit Begegnung, Kultur, Familienangeboten und gesellschaftlichem Austausch.",
      "> Aus einem Kaffee ein Gespräch, aus einem Gespräch eine Idee, aus einer Idee ein gemeinsames Projekt.",
      "Dieses Prinzip beschreibt auch meine Vorstellung von Berlin: Menschen zusammenbringen und Räume schaffen, in denen Neues entstehen kann. Berlin hat außergewöhnlich viele kluge, kreative und engagierte Menschen. Sie kennen sich oft nur noch nicht.",
    ],
  },
  {
    slug: "netzwerke-brauchen-raeume",
    title: "Netzwerke brauchen Räume",
    excerpt:
      "MyBLN, AG City, Zukunftsorte: Was zählt, ist nicht die Größe eines Netzwerks – sondern ob daraus Vertrauen und gemeinsame Projekte entstehen.",
    date: "2026-03-18",
    category: "Menschen",
    tags: ["MyBLN", "Netzwerk", "Kooperation"],
    img: "project-1",
    image: postCover("netzwerke-brauchen-raeume"),
    body: [
      "Berlin lebt von Begegnungen zwischen Wirtschaft, Politik, Wissenschaft und Kultur. Netzwerke sind dabei kein Selbstzweck. Sie sind Räume, in denen Menschen einander finden, Ideen testen und Verantwortung teilen.",
      "Ob Unternehmerforum, Brancheninitiative oder Stadtteilprojekt – entscheidend ist, dass Kontakte nicht bei der Visitenkarte enden. Vertrauen entsteht, wenn Menschen wiederholt zusammenarbeiten und Ergebnisse sichtbar werden.",
      "> Gute Netzwerke schaffen Tempo – und Orientierung.",
      "Deswegen investiere ich Zeit in Formate, die Austausch ermöglichen: ehrlich, unkompliziert und mit dem Anspruch, dass aus Gesprächen konkrete nächste Schritte folgen.",
    ],
  },
  {
    slug: "zukunftsorte-verbinden-wissenschaft-und-wirtschaft",
    title: "Zukunftsorte verbinden Wissenschaft und Wirtschaft",
    excerpt:
      "Forschung allein reicht nicht. Erst wenn Wissen in Unternehmen, Produkte und Arbeitsplätze übersetzt wird, entfaltet Innovation Wirkung in der Stadt.",
    date: "2026-02-09",
    category: "Innovation",
    tags: ["Zukunftsorte", "Transfer", "Start-ups"],
    img: "sector-exhibition",
    image: postCover("zukunftsorte-verbinden-wissenschaft-und-wirtschaft"),
    body: [
      "Berlin verfügt über herausragende Hochschulen, Forschungseinrichtungen und ein wachsendes Start-up-Ökosystem. Die Herausforderung liegt selten im Fehlen von Ideen – sondern in der Verbindung zwischen Laboren, Unternehmen und Anwendern.",
      "Zukunftsorte können diese Brücke bauen: als Orte, an denen Wissenschaft sichtbar wird, Gründerinnen und Gründer Zugang zu Expertise finden und etablierte Unternehmen frühzeitig an Trends herangeführt werden.",
      "> Innovation braucht Übersetzerinnen und Übersetzer.",
      "Wer Berlin stärken will, muss Transfer nicht dem Zufall überlassen. Es braucht Formate, Räume und Mut, Wissenschaft und Wirtschaft dauerhaft zusammenzudenken.",
    ],
  },
  {
    slug: "innenstadt-braucht-mut-zur-veränderung",
    title: "Innenstadt braucht Mut zur Veränderung",
    excerpt:
      "Leerstand, Sicherheit, Erreichbarkeit: Berliner Zentren können wieder lebendiger werden – wenn Händler, Eigentümer und Politik gemeinsam handeln.",
    date: "2026-01-14",
    category: "Stadtentwicklung",
    tags: ["Innenstadt", "Handel", "Mobilität"],
    img: "project-2",
    image: postCover("innenstadt-braucht-mut-zur-veränderung"),
    body: [
      "Viele Berliner Innenstadtlagen wirken noch lebendig – und doch spürt man den Druck: veränderte Kaufverhalten, Leerstände, Debatten über Verkehr und Aufenthaltsqualität. Die Antwort darf nicht in Nostalgie liegen.",
      "Attraktive Zentren entstehen, wenn Handel, Gastronomie, Kultur und öffentlicher Raum gemeinsam gedacht werden. Das bedeutet auch, neue Nutzungen auszuprobieren und Entscheidungen schneller zu treffen.",
      "> Die City West ist kein Museum – sie ist ein Projekt.",
      "In der AG City geht es deshalb nicht um einzelne Maßnahmen, sondern um eine gemeinsame Erzählung: Was soll diese Innenstadt in fünf oder zehn Jahren ausmachen – für Bewohner, Unternehmen und Besucher?",
    ],
  },
];

export const ARTICLES_SORTED = [...ARTICLES].sort((a, b) =>
  a.date < b.date ? 1 : -1
);

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
