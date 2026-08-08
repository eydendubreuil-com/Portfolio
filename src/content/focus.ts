/**
 * Étude de cas du projet le plus abouti. Tous les éléments viennent du brief
 * (Partie 6.3) : catalogue, espace membre, engagement climat, preuves.
 */

export const focus = {
  eyebrow: "Étude de cas",
  project: "MindSet & Business Lab",
  motto: "Former aujourd'hui les bâtisseurs de demain.",
  accent: "#C9A227",
  url: "https://mindsetbusinesslab.store/",
  intro:
    "Une plateforme de formation complète au business, au mindset, à l'IA et au marketing. L'approche est revendiquée « sans blabla » : des méthodes concrètes, des stratégies claires, des résultats réels, sans promesses irréalistes.",
  blocks: [
    {
      title: "Le catalogue",
      lead: "E-books, mini-formations et packs. Trois produits portent l'offre.",
      items: [
        {
          name: "Le Business IA",
          detail:
            "100 pages sur ChatGPT, Claude et Lovable pour automatiser un business.",
        },
        {
          name: "L'École des Entrepreneurs",
          detail: "Les 21 compétences que l'école n'enseigne pas.",
        },
        {
          name: "Les 100 Leçons du Jeune Entrepreneur",
          detail: "Un format court, une leçon par page.",
        },
      ],
    },
    {
      title: "L'espace membre",
      lead: "Ce qui transforme un catalogue en produit : ce que les gens retrouvent en revenant.",
      items: [
        { name: "Tableau de bord", detail: "Progression en XP, niveaux et série de jours." },
        { name: "Bibliothèque privée", detail: "Accès à vie aux contenus achetés." },
        {
          name: "Communauté",
          detail: "Forums Business, Mindset, IA et E-commerce.",
        },
        { name: "Classement et récompenses", detail: "La progression se voit et se compare." },
        { name: "Assistant IA intégré", detail: "De l'aide sur le contenu, à l'intérieur du produit." },
        { name: "Notifications temps réel", detail: "Rien ne se rate." },
      ],
    },
  ],
  climate: {
    title: "1,5 % de chaque vente pour le climat",
    body: "Reversé à l'action climatique via Stripe Climate. Ce n'est pas un argument marketing ajouté après coup : c'est prélevé sur chaque transaction, automatiquement.",
  },
  /* Unité dans le label, jamais dans la valeur : en monospace une espace occupe
     une cellule entière et « +214 h » se lit « +214  h ». */
  proof: [
    { value: "+25", label: "clients" },
    { value: "+214", label: "heures de formation" },
    { value: "4,9", label: "note moyenne sur 5" },
  ],
  tech: ["Lovable", "Stripe", "Stripe Climate", "Brevo", "Zoho Mail", "Blog SEO", "Newsletter"],
} as const;
