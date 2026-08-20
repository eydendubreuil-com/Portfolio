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
    name: "Synthesia",
    category: "IA",
    status: "live",
    description:
      "Assistant IA français qui rédige des textes créatifs et génère des images uniques à partir de simples descriptions.",
    goal: "Rendre l'IA utile sur des tâches concrètes, sans courbe d'apprentissage.",
    tech: ["Lovable", "IA générative (texte & image)"],
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
      "Identifie les plantes par photo grâce à l'IA. Bibliothèque botanique, défis et tutoriels pour rendre l'écologie concrète.",
    goal: "Transformer une simple photo en compréhension du vivant.",
    tech: ["Lovable", "Reconnaissance d'image par IA"],
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
      "Plateforme complète de formation (business, mindset, IA, marketing) : e-books, mini-formations, packs et espace membre. Méthodes concrètes, sans blabla.",
    goal: "Transmettre des méthodes business directement applicables.",
    tech: ["Lovable", "Stripe", "Brevo", "Espace membre", "SEO"],
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
      "Portail immersif d'exploration de l'Univers : Système solaire 3D temps réel, chronologie du cosmos, Voie lactée interactive, formation de la Terre.",
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
      "Marque premium autour d'une laisse double intelligente pour promener deux chiens sans nœuds : « Zéro nœud. Zéro chaos. »",
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
      "Premier projet e-commerce : une vitrine de créations et produits personnalisés (t-shirts, pulls, tote bags, mugs, art mural), vendus sur Etsy.",
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
    url: null,
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
