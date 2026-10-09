/**
 * La carte des dépendances entre projets.
 *
 * Le site répète « chaque projet fait progresser le suivant » en toutes lettres,
 * dans le héros, dans le positionnement, dans la section Projets — sans jamais
 * le montrer. Une affirmation répétée trois fois reste une affirmation.
 *
 * Règle de construction : **un lien n'existe que si un chapitre le dit**. Chaque
 * arête porte donc la phrase exacte qui la justifie et le chapitre d'où elle
 * vient, pour qu'on puisse aller vérifier. Aucune flèche n'a été ajoutée parce
 * qu'elle rendait le dessin plus joli ; les liens manquants manquent vraiment.
 *
 * Les coordonnées sont dans un repère de 880 × 620, en trois colonnes : ce qui
 * a servi à apprendre, ce que cet apprentissage a produit, et le point où tout
 * converge. Le lien MindSet → PawVolt remonte le courant, et c'est exact : un
 * écosystème n'est pas une chaîne de montage.
 */

export interface Noeud {
  id: string;
  nom: string;
  /** null pour le nœud qui n'est pas un projet (cette page). */
  slug: string | null;
  accent: string;
  x: number;
  y: number;
}

export interface Lien {
  de: string;
  vers: string;
  /** Ce que ce lien transmet, en trois mots. */
  quoi: string;
  /** Citation exacte, telle qu'elle est écrite dans le chapitre. */
  citation: string;
  /** Où aller lire la phrase en entier. */
  source: { slug: string; chapitre: string; titre: string };
}

export const noeuds: Noeud[] = [
  { id: "eyden-designs", nom: "EydenDesigns", slug: "eyden-designs", accent: "#EC4899", x: 110, y: 70 },
  { id: "synthesia", nom: "Agent Synthesia B.O.S", slug: "synthesia", accent: "#6D5DFB", x: 110, y: 220 },
  { id: "ecoleaf", nom: "EcoLeaf", slug: "ecoleaf", accent: "#34D399", x: 110, y: 370 },
  { id: "cosmos", nom: "Cosmos", slug: "cosmos", accent: "#4C6EF5", x: 110, y: 520 },

  { id: "pawvolt", nom: "PawVolt", slug: "pawvolt", accent: "#FF7A18", x: 440, y: 145 },
  { id: "auteur-edition", nom: "Auteur & Édition", slug: "auteur-edition", accent: "#D9A55B", x: 440, y: 330 },
  // Le dernier nœud n'est pas un projet du catalogue : c'est la page qu'on est
  // en train de lire. Cosmos a appris Three.js, Git et GitHub ; ce site est
  // construit avec. Fermer la boucle sur le visiteur lui-même n'est pas un trait
  // d'esprit, c'est le seul endroit où la démonstration se vérifie d'elle-même.
  { id: "portfolio", nom: "Ce site", slug: null, accent: "#5b8cff", x: 440, y: 520 },

  { id: "mindset-business-lab", nom: "MindSet & Business Lab", slug: "mindset-business-lab", accent: "#C9A227", x: 760, y: 330 },
];

export const liens: Lien[] = [
  {
    de: "eyden-designs",
    vers: "pawvolt",
    quoi: "Les fondamentaux du e-commerce",
    citation:
      "Il applique directement ce qui a été appris sur EydenDesigns — le premier e-commerce — et ce qui est enseigné dans MindSet & Business Lab en marketing et en funnels.",
    source: { slug: "pawvolt", chapitre: "resultats", titre: "PawVolt · Résultats et suite" },
  },
  {
    de: "mindset-business-lab",
    vers: "pawvolt",
    quoi: "Le marketing et les funnels",
    citation:
      "Il applique directement ce qui a été appris sur EydenDesigns — le premier e-commerce — et ce qui est enseigné dans MindSet & Business Lab en marketing et en funnels.",
    source: { slug: "pawvolt", chapitre: "resultats", titre: "PawVolt · Résultats et suite" },
  },
  {
    de: "synthesia",
    vers: "auteur-edition",
    quoi: "La matière de « Le Business IA »",
    citation:
      "Les livres ne sortent pas de nulle part : ils viennent directement de ce qui est appris en construisant les autres projets. Le Business IA existe parce que Synthesia a été construit ; les titres e-commerce existent parce qu'EydenDesigns et PawVolt ont été menés. On n'écrit bien que ce qu'on a fait.",
    source: { slug: "auteur-edition", chapitre: "coulisses", titre: "Auteur & Édition · Les coulisses" },
  },
  {
    de: "eyden-designs",
    vers: "auteur-edition",
    quoi: "La matière des titres e-commerce",
    citation:
      "Les titres e-commerce existent parce qu'EydenDesigns et PawVolt ont été menés. On n'écrit bien que ce qu'on a fait.",
    source: { slug: "auteur-edition", chapitre: "coulisses", titre: "Auteur & Édition · Les coulisses" },
  },
  {
    de: "pawvolt",
    vers: "auteur-edition",
    quoi: "La matière des titres e-commerce",
    citation:
      "Les titres e-commerce existent parce qu'EydenDesigns et PawVolt ont été menés. On n'écrit bien que ce qu'on a fait.",
    source: { slug: "auteur-edition", chapitre: "coulisses", titre: "Auteur & Édition · Les coulisses" },
  },
  {
    de: "auteur-edition",
    vers: "mindset-business-lab",
    quoi: "Le contenu de la plateforme",
    citation:
      "Une plateforme de formation ne vaut que ce que vaut son contenu. Sans matière première solide, MindSet & Business Lab ne serait qu'une coquille.",
    source: { slug: "auteur-edition", chapitre: "probleme", titre: "Auteur & Édition · Le problème" },
  },
  {
    de: "synthesia",
    vers: "mindset-business-lab",
    quoi: "Ce que les gens attendent d'une IA",
    citation:
      "Ce qui y a été appris — sur l'interface, sur la simplification, sur ce que les gens attendent vraiment d'un outil d'IA — alimente directement les contenus de MindSet & Business Lab, notamment l'e-book Le Business IA.",
    source: { slug: "synthesia", chapitre: "resultats", titre: "Agent Synthesia B.O.S · Résultats et suite" },
  },
  {
    de: "ecoleaf",
    vers: "mindset-business-lab",
    quoi: "Une expérience de plus à enseigner",
    citation:
      "C'est le cœur économique de l'écosystème, et son point de convergence : ce qui est appris en construisant Synthesia, EcoLeaf ou PawVolt y devient du contenu enseigné.",
    source: { slug: "mindset-business-lab", chapitre: "resultats", titre: "MindSet & Business Lab · Résultats et suite" },
  },
  {
    de: "pawvolt",
    vers: "mindset-business-lab",
    quoi: "Une expérience de plus à enseigner",
    citation:
      "C'est le cœur économique de l'écosystème, et son point de convergence : ce qui est appris en construisant Synthesia, EcoLeaf ou PawVolt y devient du contenu enseigné.",
    source: { slug: "mindset-business-lab", chapitre: "resultats", titre: "MindSet & Business Lab · Résultats et suite" },
  },
  {
    de: "cosmos",
    vers: "portfolio",
    quoi: "Three.js, Git et GitHub",
    citation:
      "Ce que ce projet m'a appris : Three.js, WebGL, Git et GitHub, l'optimisation de performances — et surtout la différence entre assembler un site et le construire.",
    source: { slug: "cosmos", chapitre: "coulisses", titre: "Cosmos · Les coulisses" },
  },
];

export const ecosysteme = {
  eyebrow: "Écosystème",
  title: "Dix liens, et aucun inventé.",
  lead:
    "« Chaque projet fait progresser le suivant » est facile à écrire. Voici les dépendances réelles : chaque flèche porte la phrase du dossier qui la justifie, et mène au chapitre où elle est écrite.",
  /* Dit honnêtement : le graphe n'est pas complet, et c'est l'information. */
  note:
    "EcoLeaf ne reçoit encore rien des autres : c'est le projet le plus à part, le seul qui ne parle ni de business ni d'outils de création.",
} as const;
