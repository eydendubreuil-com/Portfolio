/**
 * Les points d'appui du brief (Partie 1), réécrits à la première personne
 * selon les règles de voix. Chaque affirmation est adossée à un fait vérifiable
 * du document — rien n'est ajouté.
 */

export const positioning = {
  eyebrow: "Positionnement",
  title: "Ce qui me distingue n'est pas un projet. C'est d'avoir livré.",
  lead: "Sept projets, dans des domaines très différents, reliés par une même logique : chaque projet fait progresser le suivant.",
  pillars: [
    {
      label: "Je livre",
      title: "Cinq projets en ligne, à 15 ans.",
      body: "Sur sept projets construits, cinq sont accessibles et utilisables aujourd'hui. Le visiteur clique et voit du réel, pas des promesses. À cet âge, ce n'est pas un détail : c'est le point de départ.",
    },
    {
      label: "L'IA comme levier",
      title: "Construire seul ce qui demandait une équipe.",
      body: "Lovable, Claude Code, GitHub, Stripe. Ces outils ne remplacent pas le travail, ils suppriment la barrière d'entrée. Je m'en sers pour aller de l'idée au déploiement sans intermédiaire.",
    },
    {
      label: "La largeur",
      title: "Six domaines, une même méthode.",
      body: "IA générative, reconnaissance d'image, 3D temps réel dans le navigateur, e-commerce, formation, édition. Apprendre un domaine en construisant dedans, puis reporter ce qui marche sur le suivant.",
    },
    {
      label: "Sans blabla",
      title: "Des méthodes concrètes, des résultats réels.",
      body: "C'est la ligne que je tiens sur MindSet & Business Lab, et elle vaut pour ce site : des statuts honnêtes, des chiffres vérifiables, aucune promesse irréaliste.",
    },
  ],
} as const;
