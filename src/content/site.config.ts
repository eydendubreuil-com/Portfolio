export const site = {
  name: "Eyden",
  fullName: "Eyden Dubreuil",
  tagline: "Créer aujourd'hui les entreprises de demain.",
  role: "Entrepreneur • Créateur • Développeur de projets IA",
  url: "https://eyden.dev",
  email: "eyden.dubreuil@gmail.com",
  title: "Eyden — Entrepreneur, créateur et développeur de projets IA",
  description:
    "Eyden construit un écosystème de projets qui mêlent IA, business et technologie : Synthesia, EcoLeaf, MindSet & Business Lab, Cosmos, PawVolt.",
  /* `handle` est ce qui s'affiche : un pseudo se retient, pas une URL. */
  socials: [
    {
      label: "TikTok",
      handle: "@Eyden.elite",
      url: "https://www.tiktok.com/@eyden.elite",
    },
    {
      label: "Instagram",
      handle: "@eyden.elite",
      url: "https://instagram.com/eyden.elite",
    },
    {
      label: "GitHub",
      handle: "eydendubreuil-com",
      url: "https://github.com/eydendubreuil-com",
    },
    {
      label: "LinkedIn",
      handle: "eyden-dubreuil",
      url: "https://www.linkedin.com/in/eyden-dubreuil-700b143a1/",
    },
  ],
  nav: [
    { label: "À propos", href: "#a-propos" },
    { label: "Parcours", href: "#parcours" },
    { label: "Projets", href: "#projets" },
    { label: "Compétences", href: "#competences" },
    { label: "Vision", href: "#vision" },
  ],
} as const;

export const hero = {
  eyebrow: "Entrepreneur • Créateur • Développeur de projets IA",
  title: "Eyden",
  lead: "Je conçois, développe et lance des produits qui utilisent l'IA et le web pour résoudre de vrais problèmes. Sept projets, quatre déjà en ligne, un même but : construire des choses utiles et durables.",
  ctaPrimary: { label: "Découvrir mes projets", href: "#projets" },
  ctaSecondary: { label: "Me contacter", href: "#contact" },
} as const;

export const vision = {
  eyebrow: "Vision",
  /* La 2ᵉ phrase est mise en blanc pur par le composant. */
  sentences: [
    "Je veux construire des entreprises utiles, accessibles et durables.",
    "L'IA est une occasion rare d'améliorer le quotidien, d'accélérer l'apprentissage et de faire naître des solutions concrètes — à condition de s'en servir pour résoudre de vrais problèmes.",
    "Mon ambition : un écosystème où la technologie, l'éducation et l'innovation travaillent ensemble.",
  ],
} as const;

export const contact = {
  eyebrow: "Contact",
  title: "Parlons de ton projet.",
  lead: "Une idée, une collaboration, une question ? Écris-moi, je réponds à tout.",
  email: site.email,
} as const;
