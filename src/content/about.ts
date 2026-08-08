/**
 * Chaque question devient une section à part entière du site.
 * Les réponses sont les mots exacts d'Eyden : ne pas les réécrire,
 * ne pas les raccourcir, ne pas les « améliorer ».
 */

export const aboutIntro = {
  eyebrow: "À propos",
  markers: ["15 ans", "France", "7 projets", "4 en ligne", "Autodidacte"],
} as const;

export interface AboutSection {
  id: string;
  eyebrow: string;
  question: string;
  answer: string;
  /** Phrase extraite de la réponse, mise en exergue. Toujours un extrait littéral. */
  pullQuote: string;
}

export const aboutSections: AboutSection[] = [
  {
    id: "declic",
    eyebrow: "Mon déclic",
    question: "Pourquoi ai-je commencé à construire ?",
    pullQuote:
      "Devenir quelqu'un capable de créer sa propre réussite plutôt que de simplement l'attendre.",
    answer:
      "Mon déclic est venu d'une volonté de ne plus jamais être médiocre et de ne pas subir une vie que je n'ai pas choisie. Je ne veux pas simplement suivre un chemin tout tracé ou dépendre d'un système qui, selon ma vision, peut enfermer les personnes dans une situation financière limitée. J'ai donc décidé de commencer à construire par moi-même : apprendre, entreprendre, créer des projets et comprendre comment fonctionne réellement le business, l'argent et la technologie. Mon ambition est de devenir multimillionnaire, mais surtout de devenir quelqu'un capable de créer sa propre réussite plutôt que de simplement l'attendre.",
  },
  {
    id: "ecosysteme",
    eyebrow: "Plusieurs projets",
    question: "Pourquoi plusieurs projets plutôt qu'un seul ?",
    pullQuote:
      "Chaque projet représente une partie de ce que je suis et me permet d'apprendre quelque chose de différent.",
    answer:
      "Parce que je veux créer tout ce qui me ressemble. Je suis naturellement curieux et je m'intéresse à plusieurs domaines : l'intelligence artificielle, l'écologie, le business, l'e-commerce, la création de contenu, la technologie, l'éducation et même la musique. Je ne veux donc pas me limiter immédiatement à une seule idée. Chaque projet représente une partie de ce que je suis et me permet d'apprendre quelque chose de différent. Synthesia, EcoLeaf, MindSet & Business Lab, PawVolt et mes autres projets ne sont pas simplement des idées séparées : ils représentent progressivement l'écosystème que je souhaite construire. Je préfère expérimenter, apprendre, créer et évoluer plutôt que de rester enfermé dans une seule direction.",
  },
  {
    id: "objectif",
    eyebrow: "Mon objectif à long terme",
    question: "Où est-ce que je veux aller ?",
    pullQuote:
      "Je ne veux pas seulement chercher la réussite. Je veux construire les compétences, les entreprises et l'écosystème qui me permettront de la créer.",
    answer:
      "À long terme, je veux vivre de mes propres projets, bâtir de vraies entreprises et devenir capable de transformer mes idées en projets concrets et rentables. Mais l'argent n'est pas mon seul objectif. Je veux surtout apprendre le plus possible, développer mes compétences en entrepreneuriat, technologie, IA, marketing et gestion, puis utiliser ces connaissances pour construire quelque chose de réellement important. Mon objectif ultime est de devenir multimillionnaire, entrepreneur reconnu et créateur d'entreprises à succès. Je veux construire une véritable boîte, développer une communauté autour de mon travail et, avec le temps, être connu pour ce que j'aurai créé — pas simplement pour avoir voulu réussir. En résumé : je ne veux pas seulement chercher la réussite. Je veux construire les compétences, les entreprises et l'écosystème qui me permettront de la créer.",
  },
];
