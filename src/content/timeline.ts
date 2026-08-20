export interface TimelineEntry {
  /** « — » tant que l'année n'est pas confirmée : on n'invente pas de date. */
  year: string;
  title: string;
  description: string;
  upcoming: boolean;
}

export const timeline: TimelineEntry[] = [
  {
    year: "—",
    title: "Découverte du business",
    description: "Premières formations, premiers tests, l'envie de construire.",
    upcoming: false,
  },
  {
    year: "—",
    title: "Premiers sites",
    description: "HTML, CSS, JavaScript, puis les outils no-code et l'IA.",
    upcoming: false,
  },
  {
    year: "—",
    title: "EydenDesigns",
    description: "Premier projet e-commerce, en print-on-demand.",
    upcoming: false,
  },
  {
    year: "—",
    title: "MindSet & Business Lab",
    description: "Première plateforme lancée : formations, e-books, communauté.",
    upcoming: false,
  },
  {
    year: "—",
    title: "Cosmos",
    description: "Du prototype Lovable à la version Claude Code + GitHub, en 3D.",
    upcoming: false,
  },
  {
    year: "—",
    title: "Synthesia & EcoLeaf",
    description: "Deux produits IA mis en ligne et terminés.",
    upcoming: false,
  },
  {
    year: "—",
    title: "PawVolt",
    description: "Construction d'une marque e-commerce de A à Z.",
    upcoming: false,
  },
  {
    year: "À venir",
    title: "Prochains projets",
    description: "L'écosystème continue.",
    upcoming: true,
  },
];
