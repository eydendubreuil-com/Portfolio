/**
 * Les questions de la page FAQ.
 *
 * Réponses aux mots exacts d'Eyden : ne pas les réécrire, ne pas les
 * raccourcir, ne pas les « améliorer ».
 *
 * Trois passages du texte fourni ont été écartés — ce n'étaient pas des
 * réponses mais des consignes de rédaction adressées au rédacteur :
 *
 *   • « Cette question compte plus que tu ne crois : c'est celle qui rassure un
 *     partenaire… »            → sur « Comment tu apprends ? »
 *   • « Le ton juste : afficher le fait, jamais le revendiquer… »
 *                              → sur « Qu'est-ce que ça change d'avoir 15 ans ? »
 *   • « Rôle de cette question : c'est la sortie de la page… »
 *                              → sur « Que peut-on faire avec toi ? »
 *
 * Elles sont respectées plutôt qu'affichées : l'âge n'est nulle part
 * revendiqué, et la dernière question porte l'appel à l'action de la page.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export const faq: FaqItem[] = [
  {
    id: "apprendre",
    question: "Comment tu apprends ?",
    answer: [
      "En construisant. Je n'apprends pas une technologie pour la connaître, je l'apprends parce qu'un projet en a besoin.",
      "Cosmos en est l'exemple le plus net : je voulais savoir si je savais réellement développer, alors j'ai choisi un sujet qui ne pardonne rien — la 3D dans le navigateur. J'ai commencé avec un prototype, puis je l'ai entièrement recréé avec Claude Code et GitHub. J'en suis ressorti avec Three.js, Git et la gestion des performances.",
    ],
  },
  {
    id: "ia",
    question: "Quel rôle joue l'IA dans ta façon de travailler ?",
    answer: [
      "L'IA ne remplace pas le travail, elle change son échelle. Concevoir, développer et lancer un produit demandait hier une équipe entière. Aujourd'hui, avec Claude, Claude Code, Lovable et les bons outils, une personne seule peut le faire — à condition d'avoir la méthode.",
      "C'est ce décalage que j'explore projet après projet. Et ce que j'apprends en le faisant, je le transmets ensuite dans mes e-books et mes formations.",
    ],
  },
  {
    id: "choix",
    question: "Comment tu choisis un nouveau projet ?",
    answer: [
      "Chaque projet part d'une question que je me pose vraiment. Comment simplifier une tâche complexe avec l'IA. Comment rendre l'écologie concrète au quotidien. Comment construire une marque de A à Z. Comment transmettre ce que j'apprends.",
      "Si la question m'intéresse assez pour que j'y passe des semaines, le projet mérite d'exister.",
    ],
  },
  {
    id: "age",
    question: "Qu'est-ce que ça change d'avoir 15 ans ?",
    answer: [
      "Concrètement : j'ai moins de moyens et plus de temps devant moi. Je n'ai pas d'équipe, pas de budget, pas de réseau — alors j'apprends à faire seul, et vite.",
      "Ce n'est ni une excuse, ni un argument de vente. Ce sont les projets qui parlent, pas la date de naissance.",
    ],
  },
  {
    id: "ensemble",
    question: "Que peut-on faire avec toi ?",
    answer: [
      "Deux choses. Utiliser mes produits — ils sont en ligne, ils fonctionnent, et j'en suis responsable. Ou construire quelque chose ensemble : projet, collaboration, ou simplement une discussion. Je réponds à tous les messages.",
    ],
  },
  {
    id: "resume",
    question: "Une phrase qui te résume ?",
    answer: [
      "Je ne veux pas seulement chercher la réussite. Je veux construire les compétences, les entreprises et l'écosystème qui me permettront de la créer.",
    ],
  },
];
