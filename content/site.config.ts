import { projectAccents, statusColors } from "@/lib/theme";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TOUT LE CONTENU DU SITE EST ICI.
 *
 *  Les lignes marquées « TODO » sont des textes provisoires écrits faute
 *  d'avoir reçu le dossier portfolio-eyden/ (bio, descriptions, stats, liens).
 *  Remplace-les : aucun composant n'a de texte en dur, ce fichier suffit.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const site = {
  // TODO — remplacer par ton vrai domaine avant la mise en ligne
  url: "https://eydendubreuil.com",
  name: "Eyden Dubreuil",
  role: "Fondateur & développeur produit",
  // TODO — ta phrase d'accroche réelle
  tagline: "Je conçois et je construis des produits numériques, de l'idée au déploiement.",
  description:
    "Portfolio d'Eyden Dubreuil — fondateur et développeur produit. Quatre projets, de l'IA générative à l'électronique connectée.",
  locale: "fr-FR",
  email: "eyden.dubreuil@gmail.com",
} as const;

export const nav = [
  { label: "Projets", href: "#projets" },
  { label: "À propos", href: "#a-propos" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  eyebrow: "Portfolio",
  // Le titre est découpé en lignes pour maîtriser les retours à la ligne
  titleLines: ["Je construis", "des produits", "qui existent."],
  // TODO — ton vrai paragraphe d'introduction
  intro:
    "Quatre projets menés de la première ligne de code au déploiement : une plateforme d'IA générative, une application d'impact environnemental, un laboratoire d'idées business, et un objet connecté. Chacun résout un problème que j'avais moi-même.",
  ctaPrimary: { label: "Voir les projets", href: "#projets" },
  ctaSecondary: { label: "Me contacter", href: "#contact" },
} as const;

/** TODO — remplacer par tes chiffres réels. Une stat fausse coûte plus qu'une stat absente. */
export const stats = [
  { value: "4", label: "Projets menés" },
  { value: "1", label: "En production" },
  { value: "3", label: "Ans de pratique" },
  { value: "12", label: "Technologies maîtrisées" },
] as const;

export type Status = keyof typeof statusColors;

export type Project = {
  slug: keyof typeof projectAccents;
  name: string;
  /** Une ligne, mono, au-dessus du titre */
  category: string;
  status: Status;
  year: string;
  /** 2 à 3 phrases : le problème, la réponse, où ça en est */
  description: string;
  stack: readonly string[];
  /** null = pas de lien public pour l'instant, la carte n'affiche alors rien */
  href: string | null;
  repo: string | null;
  /** Une seule carte en avant sur les quatre — bordure dégradée + flottement */
  featured?: boolean;
};

export const statusLabels: Record<Status, string> = {
  live: "En ligne",
  building: "En développement",
  planned: "À venir",
};

/** TODO — les descriptions ci-dessous sont provisoires, réécris-les avec tes vrais textes. */
export const projects: readonly Project[] = [
  {
    slug: "mindset",
    name: "MindSet & Business Lab",
    category: "Média & formation",
    status: "live",
    year: "2025",
    description:
      "Un laboratoire d'idées pour entrepreneurs : analyses de modèles économiques, méthodes de décision et retours d'expérience. Le seul projet actuellement en ligne et accessible au public.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    href: null,
    repo: null,
    featured: true,
  },
  {
    slug: "synthesia",
    name: "Synthesia",
    category: "IA générative",
    status: "building",
    year: "2025",
    description:
      "Une plateforme qui transforme des documents longs en supports exploitables — résumés structurés, fiches, points clés. Pensée pour les gens qui doivent lire plus vite qu'ils ne le peuvent.",
    stack: ["Next.js", "TypeScript", "API Claude", "PostgreSQL"],
    href: null,
    repo: null,
  },
  {
    slug: "ecoleaf",
    name: "EcoLeaf",
    category: "Impact environnemental",
    status: "building",
    year: "2025",
    description:
      "Une application qui rend l'empreinte carbone du quotidien lisible et actionnable, sans culpabilisation ni greenwashing. Mesurer d'abord, décider ensuite.",
    stack: ["React Native", "TypeScript", "Supabase"],
    href: null,
    repo: null,
  },
  {
    slug: "pawvolt",
    name: "PawVolt",
    category: "Objet connecté",
    status: "planned",
    year: "2026",
    description:
      "Un dispositif connecté pour le suivi de l'activité et de la santé animale. Le projet où le logiciel rencontre l'électronique — et où les contraintes sont physiques.",
    stack: ["Embarqué", "Bluetooth LE", "React Native"],
    href: null,
    repo: null,
  },
] as const;

export const about = {
  eyebrow: "À propos",
  title: "Construire plutôt que décrire.",
  // TODO — ta vraie biographie
  paragraphs: [
    "Je m'appelle Eyden Dubreuil. Je conçois des produits numériques et je les construis moi-même, de l'architecture à la mise en production. Ce qui m'intéresse n'est pas la technologie pour elle-même, mais ce qu'elle permet de résoudre.",
    "Chacun des projets présentés ici est né d'un problème concret que je rencontrais. J'apprends en construisant : une idée qui ne devient pas un produit déployé reste une idée.",
  ],
} as const;

/** TODO — ajuste cette liste à ce que tu utilises réellement au quotidien */
export const stack = [
  {
    group: "Front-end",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"],
  },
  {
    group: "Back-end & données",
    items: ["Node.js", "PostgreSQL", "Supabase", "API REST"],
  },
  { group: "IA", items: ["API Claude", "Traitement de documents", "Prompt design"] },
  { group: "Outils", items: ["Git", "Vercel", "Figma", "Claude Code"] },
] as const;

export const contact = {
  eyebrow: "Contact",
  title: "Un projet, une question, une idée ?",
  // TODO — ta phrase d'invitation
  intro:
    "Le plus simple reste l'e-mail. Je réponds à tout message qui n'est pas automatisé.",
  email: site.email,
} as const;

/** TODO — remplace les URL par tes vrais profils, ou retire les entrées inutilisées. */
export const socials = [
  { label: "GitHub", href: "https://github.com/eydendubreuil-com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "X", href: "https://x.com" },
] as const;
