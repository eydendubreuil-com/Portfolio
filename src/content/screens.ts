/**
 * Écrans réels des projets, capturés sur les sites en ligne.
 *
 * Généré par `scripts/ecrans.mjs` à partir d'une liste de pages, jamais écrit à
 * la main : une légende recopiée est une légende qui finit par mentir quand la
 * page change. Les captures vivent dans `public/projets/ecrans/`.
 *
 * Le dossier d'un projet n'avait qu'une image — sa page d'accueil. Sept projets
 * racontés en cinq chapitres chacun méritaient mieux qu'une vignette : ce sont
 * les pages qui montrent le travail, pas la façade.
 */
export interface Ecran {
  src: string;
  legende: string;
}

export const ecrans: Record<string, Ecran[]> = {
  "synthesia": [
      { src: "/projets/ecrans/synthesia-1.webp", legende: "Quatre étapes, de la demande au résultat" },
      { src: "/projets/ecrans/synthesia-2.webp", legende: "La bibliothèque de modèles" },
      { src: "/projets/ecrans/synthesia-3.webp", legende: "Les formules, de la gratuite à l'illimitée" },
      { src: "/projets/ecrans/synthesia-4.webp", legende: "Création de compte" },
  ],
  "ecoleaf": [
      { src: "/projets/ecrans/ecoleaf-1.webp", legende: "La bibliothèque botanique" },
      { src: "/projets/ecrans/ecoleaf-2.webp", legende: "Les tutoriels pas à pas" },
      { src: "/projets/ecrans/ecoleaf-3.webp", legende: "L'offre pour les établissements scolaires" },
      { src: "/projets/ecrans/ecoleaf-4.webp", legende: "Les formules" },
  ],
  "mindset-business-lab": [
      { src: "/projets/ecrans/mindset-1.webp", legende: "La boutique" },
      { src: "/projets/ecrans/mindset-2.webp", legende: "Les formations" },
      { src: "/projets/ecrans/mindset-3.webp", legende: "Une fiche produit : Le Business IA" },
      { src: "/projets/ecrans/mindset-4.webp", legende: "L'espace communauté" },
  ],
  "cosmos": [
      { src: "/projets/ecrans/cosmos-1.webp", legende: "Le Système solaire en 3D temps réel" },
      { src: "/projets/ecrans/cosmos-2.webp", legende: "13,8 milliards d'années, en chronologie" },
      { src: "/projets/ecrans/cosmos-3.webp", legende: "La Voie lactée interactive" },
      { src: "/projets/ecrans/cosmos-4.webp", legende: "Les distances, à l'échelle" },
  ],
  "pawvolt": [
      { src: "/projets/ecrans/pawvolt-1.webp", legende: "La fiche produit" },
      { src: "/projets/ecrans/pawvolt-2.webp", legende: "La page de marque" },
      { src: "/projets/ecrans/pawvolt-3.webp", legende: "La FAQ" },
      { src: "/projets/ecrans/pawvolt-4.webp", legende: "Le problème, posé avant le produit" },
  ],
  "eyden-designs": [
      { src: "/projets/ecrans/eyden-designs-1.webp", legende: "La boutique" },
      { src: "/projets/ecrans/eyden-designs-2.webp", legende: "Le configurateur d'affiche" },
      { src: "/projets/ecrans/eyden-designs-3.webp", legende: "Les avis clients" },
  ],
  "auteur-edition": [
      { src: "/projets/ecrans/auteur-edition-1.webp", legende: "L'École des Entrepreneurs" },
      { src: "/projets/ecrans/auteur-edition-2.webp", legende: "Les 100 Leçons du Jeune Entrepreneur" },
      { src: "/projets/ecrans/auteur-edition-3.webp", legende: "Les packs de formation" },
  ],
};
