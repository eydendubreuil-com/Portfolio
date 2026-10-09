export type ProjectStatus = "live" | "building" | "paused" | "ongoing";

export type ProjectCategory =
  | "IA"
  | "Environnement"
  | "Formation"
  | "E-commerce"
  | "Développement"
  | "Édition";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  goal: string;
  tech: string[];
  /** null => aucun bouton, jamais de lien mort */
  url: string | null;
  /** null => placeholder composé, à l'accent du projet */
  image: string | null;
  /** Affichée dans le placeholder quand `image` est null. Accroche réelle du projet. */
  tagline?: string;
  accent: string;
  /** Position dans la constellation du hero, en % */
  node?: { x: number; y: number };
}

export const projects: Project[] = [
  {
    slug: "synthesia",
    // Le produit s'appelle « Agent Synthesia B.O.S » depuis sa dernière version :
    // c'est le nom affiché partout sur le site, dans le titre de la page comme
    // dans les boutons. Le slug reste `synthesia`, pour ne pas casser les liens
    // déjà partagés.
    name: "Agent Synthesia B.O.S",
    category: "IA",
    status: "live",
    description:
      "Assistant IA français qui rédige et génère des images à partir d'une simple description. Devenu un poste de travail complet : modèles prêts à l'emploi, dictée vocale, historique synchronisé, quatre formules d'abonnement.",
    goal: "Rendre l'IA utile sur des tâches concrètes, sans courbe d'apprentissage.",
    tech: ["Lovable", "API GPT-5 & Gemini", "Abonnements", "Dictée vocale"],
    url: "https://synthesia-ia.lovable.app/",
    image: "/projets/synthesia.webp",
    accent: "#6D5DFB",
    node: { x: 26, y: 22 },
  },
  {
    slug: "ecoleaf",
    name: "EcoLeaf",
    category: "Environnement",
    status: "live",
    description:
      "Identifie les plantes par photo grâce à l'IA. Bibliothèque botanique, défis, tutoriels — et un programme pédagogique pour les classes, de la maternelle au lycée.",
    goal: "Transformer une simple photo en compréhension du vivant.",
    tech: ["Lovable", "Reconnaissance d'image par IA", "Abonnements", "Offre enseignant"],
    url: "https://ecoleaf.site/",
    image: "/projets/ecoleaf.webp",
    accent: "#34D399",
    node: { x: 74, y: 30 },
  },
  {
    slug: "mindset-business-lab",
    name: "MindSet & Business Lab",
    category: "Formation",
    status: "live",
    description:
      "Plateforme complète de formation (business, mindset, IA, marketing) : e-books, packs, vidéothèque classée par thème, blog, communauté et espace membre. Méthodes concrètes, sans blabla.",
    goal: "Transmettre des méthodes business directement applicables.",
    tech: ["Lovable", "Stripe", "Stripe Climate", "Brevo", "Espace membre", "Blog SEO"],
    url: "https://mindsetbusinesslab.store/",
    image: "/projets/mindset.webp",
    accent: "#C9A227",
    node: { x: 38, y: 66 },
  },
  {
    slug: "cosmos",
    name: "Cosmos",
    category: "Développement",
    status: "live",
    description:
      "Portail immersif d'exploration de l'Univers : trois explorateurs 3D temps réel — Système solaire, Voie lactée, trou noir — plus la chronologie du cosmos, la formation de la Terre et les distances à l'échelle.",
    goal: "Apprendre le développement web moderne — et le prouver.",
    tech: ["Three.js / WebGL", "Claude Code", "GitHub", "Lovable"],
    url: "https://cosmos-univers.lovable.app/",
    image: "/projets/cosmos.webp",
    accent: "#4C6EF5",
    node: { x: 70, y: 74 },
  },
  {
    slug: "pawvolt",
    name: "PawVolt",
    category: "E-commerce",
    status: "live",
    description:
      "Marque premium autour d'une laisse double intelligente — anti-nœuds 360°, LED, porte-sacs — pour promener deux chiens sans nœuds : « Zéro nœud. Zéro chaos. »",
    goal: "Construire une marque complète, du produit à l'acquisition.",
    tech: ["Shopify", "Branding", "Publicité en ligne", "Funnels"],
    // Le domaine apex sert un certificat expiré : depuis l'extérieur,
    // https://pawvolt.eu échoue avant même d'afficher quoi que ce soit. Le
    // sous-domaine www répond. On pointe donc là où la boutique s'ouvre
    // vraiment — un lien mort sur une carte « en ligne » est pire que rien.
    url: "https://www.pawvolt.eu/",
    image: "/projets/pawvolt.webp",
    // Pas le slogan « Zéro nœud. Zéro chaos. » : il est déjà dans la description
    // juste en dessous, et le répéter dans la même carte fait doublon.
    tagline: "La laisse double intelligente",
    accent: "#FF7A18",
    node: { x: 50, y: 44 },
  },
  {
    slug: "eyden-designs",
    name: "EydenDesigns",
    category: "E-commerce",
    status: "paused",
    description:
      "Premier projet e-commerce : une vitrine de créations et produits personnalisés (t-shirts, pulls, tote bags, mugs, art mural), avec un configurateur d'affiche sur mesure. Vendus sur Etsy.",
    goal: "Le point de départ e-commerce de l'écosystème.",
    tech: ["Lovable", "Etsy", "Print-on-demand", "Design graphique"],
    url: "https://eydendesigns.lovable.app/",
    image: "/projets/eyden-designs.webp",
    accent: "#EC4899",
  },
  {
    slug: "auteur-edition",
    name: "Auteur & Édition",
    category: "Édition",
    status: "ongoing",
    description:
      "Bibliothèque de contenus éducatifs orientés action : un ouvrage principal (~350 pages) et une série de titres sur le business, le marketing et l'IA.",
    goal: "Donner à l'écosystème sa profondeur éducative.",
    tech: ["Édition numérique", "Création de contenu"],
    // La bibliothèque n'a pas de site à elle : elle vit dans MindSet & Business
    // Lab, qui la vend. Le lien mène donc à son rayon. Laisser `null` affichait
    // « Ce projet n'est pas encore public » alors que les 15 titres le sont.
    url: "https://mindsetbusinesslab.store/ebooks",
    image: "/projets/auteur-edition.webp",
    accent: "#D9A55B",
  },
];

export const statusLabels: Record<ProjectStatus, string> = {
  live: "En ligne",
  building: "En préparation",
  paused: "En pause",
  ongoing: "En cours",
};

export const statusColors: Record<ProjectStatus, string> = {
  live: "var(--color-status-live)",
  building: "var(--color-status-building)",
  paused: "var(--color-status-planned)",
  ongoing: "var(--color-status-building)",
};

/** Ordre des filtres. « Tous » est ajouté par le composant. */
export const categories: ProjectCategory[] = [
  "IA",
  "Environnement",
  "Formation",
  "E-commerce",
  "Développement",
  "Édition",
];

export const liveProjects = projects.filter((p) => p.status === "live");
