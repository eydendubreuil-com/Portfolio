/**
 * Dossiers projet : 7 projets × 5 chapitres.
 *
 * Contenu transcrit depuis le document de référence par un analyseur, pas à la
 * main : 35 chapitres recopiés, c'est la garantie d'une faute de frappe ou d'un
 * paragraphe oublié.
 *
 * Les passages marqués `[À COMPLÉTER]` dans la source ne sont PAS publiés. Ils
 * demandent une information qu'Eyden seul possède ; les inventer serait la seule
 * faute que ce site ne peut pas se permettre. Ils sont conservés dans `todos`
 * pour qu'aucun ne se perde, et listés en fin de fichier.
 *
 * Le balisage `**gras**` et `*italique*` est conservé dans le texte et rendu par
 * `<RichText>` — stocker du HTML ici exposerait le contenu à l'injection et
 * empêcherait de réutiliser ces chaînes ailleurs (métadonnées, JSON-LD).
 */

export type BlockKind = "p" | "transition";

export interface Block {
  kind: BlockKind;
  text: string;
}

export interface Chapter {
  n: number;
  /** Segment d'URL : /projets/{projet}/{slug} */
  slug: string;
  title: string;
  blocks: Block[];
}

export interface ProjectDetail {
  slug: string;
  name: string;
  categories: string[];
  status: string;
  accent: string;
  url: string | null;
  tagline: string;
  chapters: Chapter[];
  /** Passages à compléter par Eyden. Jamais affichés aux visiteurs. */
  todos: string[];
}

export const projectDetails: ProjectDetail[] = [
  {
    slug: "synthesia",
    name: "Synthesia",
    categories: ["Intelligence artificielle"],
    status: "En ligne",
    accent: "#6D5DFB",
    url: "https://synthesia-ia.lovable.app/",
    tagline: "Un assistant IA qui écrit tes textes et crée tes images, à partir d'une simple description.",
    chapters: [
      {
        n: 1,
        slug: "vue-densemble",
        title: "Vue d'ensemble",
        blocks: [
          { kind: "p", text: "Synthesia réunit deux usages de l'IA générative dans un seul outil : la rédaction de textes créatifs et la création d'images à partir d'une description écrite. Le tout en français, sans aucune expertise technique requise." },
          { kind: "p", text: "L'ambition n'était pas d'ajouter un chatbot de plus à une liste déjà longue, mais de construire une plateforme d'outils réellement utilisables au quotidien — pour les particuliers, les étudiants, les entrepreneurs comme les entreprises." },
          { kind: "p", text: "**Pour qui** : quiconque doit produire du contenu régulièrement et n'a ni le temps ni l'envie d'apprendre à manier une dizaine d'outils différents." },
          { kind: "p", text: "**En bref** : on décrit ce qu'on veut, l'outil produit. C'est le principe de départ, et il n'a pas bougé." },
        ],
      },
      {
        n: 2,
        slug: "probleme",
        title: "Le problème",
        blocks: [
          { kind: "p", text: "Les outils d'IA les plus puissants existent déjà. Le problème n'est pas leur puissance, c'est leur **accessibilité**." },
          { kind: "p", text: "Trois obstacles reviennent systématiquement. D'abord la dispersion : un outil pour écrire, un autre pour les images, un troisième pour reformuler — il faut jongler entre les onglets et les abonnements. Ensuite la barrière technique : la plupart des interfaces supposent qu'on sait déjà ce qu'est un prompt efficace, ce qui exclut immédiatement les débutants. Enfin la langue : beaucoup d'outils sont pensés d'abord pour l'anglais, et l'expérience française est une traduction approximative." },
          { kind: "p", text: "Le résultat est simple à observer : des gens qui *savent* que l'IA pourrait les aider, mais qui ne s'en servent pas, faute d'une porte d'entrée assez simple." },
          { kind: "transition", text: "C'est cette porte d'entrée que Synthesia essaie d'être." },
        ],
      },
      {
        n: 3,
        slug: "solution",
        title: "La solution",
        blocks: [
          { kind: "p", text: "**Rédaction créative** — On décrit une intention, l'outil produit un texte. Idées, contenus, formulations : le point de départ est une phrase en français courant, pas une syntaxe à apprendre." },
          { kind: "p", text: "**Génération d'images** — Une description écrite devient un visuel unique. Même logique : on décrit, on obtient." },
          { kind: "p", text: "**Une seule interface** — Les deux usages cohabitent au même endroit. Pas de va-et-vient entre services, pas de comptes multiples." },
          { kind: "p", text: "**Pensé en français** — L'interface, les exemples et les résultats sont conçus pour un public francophone dès le départ, pas adaptés après coup." },
          { kind: "p", text: "Le choix structurant a été de **réduire le nombre d'options** plutôt que de les multiplier. Chaque réglage supplémentaire est un obstacle pour un débutant ; l'outil devait rester lisible par quelqu'un qui l'ouvre pour la première fois." },
        ],
      },
      {
        n: 4,
        slug: "coulisses",
        title: "Les coulisses",
        blocks: [
          { kind: "p", text: "Synthesia a été construit avec **Lovable**, en s'appuyant sur des modèles d'IA générative pour le texte et l'image." },
          { kind: "p", text: "Le travail réel n'a pas été le branchement technique — connecter un modèle est aujourd'hui la partie facile. Il a été le **travail de produit** : décider quelles fonctionnalités garder, lesquelles écarter, et comment présenter une capacité complexe derrière une interface que personne n'a besoin d'apprendre." },
          { kind: "p", text: "**Ce que ce projet m'a appris** : concevoir un produit IA de bout en bout — de l'idée à la mise en ligne — et surtout que la valeur d'un outil d'IA se joue dans l'interface, pas dans le modèle." },
        ],
      },
      {
        n: 5,
        slug: "resultats",
        title: "Résultats et suite",
        blocks: [
          { kind: "p", text: "**Statut** : en ligne et utilisable." },
          { kind: "p", text: "Synthesia est le premier projet de l'écosystème à avoir mis l'IA générative entre les mains d'utilisateurs réels. Ce qui y a été appris — sur l'interface, sur la simplification, sur ce que les gens attendent vraiment d'un outil d'IA — alimente directement les contenus de MindSet & Business Lab, notamment l'e-book *Le Business IA*." },
        ],
      },
    ],
    todos: [
      "Chapitre 4 · Les coulisses — La difficulté la plus concrète rencontrée sur ce projet, et comment tu l'as réglée. C'est le passage que lira le plus attentivement quelqu'un qui envisage de travailler avec toi : il montre comment tu raisonnes face à un problème.",
      "Chapitre 5 · Résultats et suite — **La suite** : `[À COMPLÉTER]` — Ce que tu prévois pour Synthesia (nouveaux outils, refonte, ouverture d'un modèle payant…), ou « projet stable, pas d'évolution prévue à court terme » si c'est le cas. Mieux vaut une phrase honnête qu'une promesse floue.",
    ],
  },
  {
    slug: "ecoleaf",
    name: "EcoLeaf",
    categories: ["Environnement"],
    status: "En ligne",
    accent: "#34D399",
    url: "https://ecoleaf.site/",
    tagline: "Photographie une plante. Comprends le vivant qui t'entoure.",
    chapters: [
      {
        n: 1,
        slug: "vue-densemble",
        title: "Vue d'ensemble",
        blocks: [
          { kind: "p", text: "EcoLeaf met l'intelligence artificielle au service de la nature : une photo suffit pour identifier une plante et en apprendre davantage sur elle." },
          { kind: "p", text: "Mais le site va plus loin qu'un simple identificateur. Il réunit une bibliothèque botanique, des défis et des tutoriels, pour transformer l'écologie en gestes concrets plutôt qu'en principes abstraits." },
          { kind: "p", text: "**Pour qui** : les familles, les débutants, les curieux, les passionnés de plantes — tous ceux pour qui l'écologie reste un sujet un peu lointain." },
        ],
      },
      {
        n: 2,
        slug: "probleme",
        title: "Le problème",
        blocks: [
          { kind: "p", text: "L'écologie souffre d'un problème de distance. On en parle à l'échelle de la planète, du climat, des politiques publiques — des échelles où l'individu ne se sent plus acteur." },
          { kind: "p", text: "Résultat : beaucoup de gens sont sincèrement concernés, mais ne savent pas par où commencer. Le discours est théorique, culpabilisant parfois, et rarement relié à ce qu'on a sous les yeux." },
          { kind: "p", text: "Il y a pourtant une porte d'entrée évidente et sous-utilisée : **le vivant immédiat**. La plante sur le balcon, l'arbre du chemin, l'herbe du jardin. C'est concret, c'est visible, et ça permet de commencer petit." },
          { kind: "transition", text: "Le problème n'est pas le manque d'informations — il est le manque d'un point de départ personnel." },
        ],
      },
      {
        n: 3,
        slug: "solution",
        title: "La solution",
        blocks: [
          { kind: "p", text: "**Identification par photo** — L'IA reconnaît la plante à partir d'une simple image. C'est le point d'entrée : on part de ce qu'on voit, pas d'un cours." },
          { kind: "p", text: "**Bibliothèque botanique** — Une base pour explorer, comparer, approfondir. L'identification n'est qu'un début ; la bibliothèque prolonge la curiosité." },
          { kind: "p", text: "**Défis** — Des objectifs concrets qui transforment l'apprentissage en progression. C'est ce qui fait revenir : une information isolée s'oublie, une progression se poursuit." },
          { kind: "p", text: "**Tutoriels** — Des gestes écologiques expliqués pas à pas, ancrés dans le quotidien." },
          { kind: "p", text: "L'idée directrice : **partir du particulier pour aller vers le général**. On commence par une plante précise, et on finit par comprendre un écosystème." },
        ],
      },
      {
        n: 4,
        slug: "coulisses",
        title: "Les coulisses",
        blocks: [
          { kind: "p", text: "EcoLeaf a été construit avec **Lovable**, autour d'une brique de reconnaissance d'image par IA." },
          { kind: "p", text: "Le vrai défi technique n'était pas la reconnaissance elle-même mais **le parcours autour** : que se passe-t-il quand l'IA se trompe ? Quand la photo est floue ? Quand la plante n'est pas dans la base ? Un produit qui ne fonctionne que dans le cas idéal n'est pas un produit." },
          { kind: "p", text: "L'usage étant très majoritairement mobile — on photographie une plante avec son téléphone, dehors —, l'interface a été pensée pour ce contexte d'abord." },
          { kind: "p", text: "**Ce que ce projet m'a appris** : appliquer une brique d'IA avancée à un usage grand public simple, et concevoir pour le mobile en conditions réelles." },
        ],
      },
      {
        n: 5,
        slug: "resultats",
        title: "Résultats et suite",
        blocks: [
          { kind: "p", text: "**Statut** : en ligne, avec son propre nom de domaine — `ecoleaf.site`. Le passage à un domaine propre était un choix délibéré : un projet qui vise le grand public a besoin d'une adresse qu'on retient et qui inspire confiance." },
          { kind: "p", text: "EcoLeaf prouve qu'une brique technique avancée peut servir un sujet accessible à tous. C'est le projet qui a le plus élargi le champ de l'écosystème, jusque-là centré sur le business et la tech." },
        ],
      },
    ],
    todos: [
      "Chapitre 4 · Les coulisses — Le choix technique dont tu es le plus content sur EcoLeaf.",
      "Chapitre 5 · Résultats et suite — **La suite** : `[À COMPLÉTER]`",
    ],
  },
  {
    slug: "mindset-business-lab",
    name: "MindSet & Business Lab",
    categories: ["Formation"],
    status: "En ligne",
    accent: "#C9A227",
    url: "https://mindsetbusinesslab.store/",
    tagline: "Se former au business, au mindset et à l'IA. Sans blabla.",
    chapters: [
      {
        n: 1,
        slug: "vue-densemble",
        title: "Vue d'ensemble",
        blocks: [
          { kind: "p", text: "MindSet & Business Lab est le projet le plus abouti de l'écosystème : une plateforme complète de formation au business, au mindset, à l'intelligence artificielle et au marketing." },
          { kind: "p", text: "E-books, mini-formations et packs, complétés par un véritable espace membre et une communauté active. L'approche est assumée dès la page d'accueil : **sans blabla**. Des méthodes concrètes, des stratégies claires, des résultats réels — et aucune promesse irréaliste." },
          { kind: "p", text: "**Pour qui** : celles et ceux qui veulent créer un business moderne et cherchent des méthodes applicables plutôt que de la motivation en boucle." },
          { kind: "p", text: "**Les chiffres** : +25 clients · +214 heures de formation · note moyenne 4,9/5." },
        ],
      },
      {
        n: 2,
        slug: "probleme",
        title: "Le problème",
        blocks: [
          { kind: "p", text: "Le contenu business en ligne souffre de deux excès opposés." },
          { kind: "p", text: "D'un côté, le contenu gratuit : abondant, dispersé, contradictoire. On y passe des heures sans jamais savoir par où commencer, et l'accumulation d'informations donne l'illusion d'avancer alors qu'on tourne en rond." },
          { kind: "p", text: "De l'autre, les formations vendues à prix fort sur des promesses invérifiables. Le fameux « devenez libre en 30 jours » — un discours qui vend du rêve, décrédibilise le secteur entier, et laisse l'acheteur plus démuni qu'avant." },
          { kind: "p", text: "Entre les deux, il manque quelque chose de simple : **des méthodes concrètes, honnêtes sur ce qu'elles permettent, à un prix accessible**. Pas de rêve, pas de survente : des étapes applicables dès la lecture terminée." },
          { kind: "transition", text: "C'est exactement l'espace que MindSet & Business Lab occupe." },
        ],
      },
      {
        n: 3,
        slug: "solution",
        title: "La solution",
        blocks: [
          { kind: "p", text: "**Des e-books orientés action** — Chaque titre traite un sujet et donne des étapes applicables. Les principaux : *Le Business IA* (100 pages sur ChatGPT, Claude et Lovable pour automatiser un business), *L'École des Entrepreneurs* (21 compétences que l'école n'enseigne pas), *Les 100 Leçons du Jeune Entrepreneur*. Au total : 15 e-books et 2 packs de formation." },
          { kind: "p", text: "**Un espace membre complet** — Dashboard de progression (XP, niveaux, série), bibliothèque privée à vie, système de classement et de récompenses. La progression est visible : c'est ce qui distingue une plateforme d'un simple catalogue de PDF." },
          { kind: "p", text: "**Une communauté** — Des forums par thème : Business, Mindset, IA, E-commerce. Apprendre seul est le moyen le plus sûr d'abandonner." },
          { kind: "p", text: "**Un assistant IA intégré** — L'accompagnement se fait directement dans la plateforme, sans outil externe." },
          { kind: "p", text: "**Un engagement climat** — 1,5 % de chaque vente est reversé à l'action climatique via Stripe Climate. Peu de créateurs indépendants le font, et c'est vérifiable." },
        ],
      },
      {
        n: 4,
        slug: "coulisses",
        title: "Les coulisses",
        blocks: [
          { kind: "p", text: "La plateforme a été construite avec **Lovable**, avec un ensemble d'outils choisis pour tenir un vrai business en ligne : **Stripe** pour les paiements et Stripe Climate, **Brevo** pour l'emailing, **Zoho Mail** pour les adresses professionnelles, et un espace membre avec authentification." },
          { kind: "p", text: "C'est le projet le plus complexe de l'écosystème, parce qu'il ne s'arrête pas au site : il fallait gérer des paiements réels, des accès à vie, une progression persistante, une communauté, et un blog pour le référencement. Chacun de ces éléments est un petit produit à lui seul." },
          { kind: "p", text: "Le choix le plus structurant a été la **gamification** — XP, niveaux, séries, classement. Le problème numéro un des formations en ligne n'est pas la qualité du contenu, c'est l'abandon. Rendre la progression visible est ce qui donne une raison de revenir." },
          { kind: "p", text: "**Ce que ce projet m'a appris** : lancer et faire vivre un produit payant complet — contenu, paiement, acquisition, communauté, service client." },
        ],
      },
      {
        n: 5,
        slug: "resultats",
        title: "Résultats et suite",
        blocks: [
          { kind: "p", text: "**Statut** : en ligne, avec des clients réels." },
          { kind: "p", text: "- **+25 clients** — de vraies ventes, pas des inscriptions gratuites. - **+214 heures** de formation disponibles. - **4,9/5** de note moyenne. - **1,5 %** de chaque vente reversé au climat." },
          { kind: "p", text: "C'est le cœur économique de l'écosystème, et son point de convergence : ce qui est appris en construisant Synthesia, EcoLeaf ou PawVolt y devient du contenu enseigné. Les livres écrits dans *Auteur & Édition* en sont la matière première." },
        ],
      },
    ],
    todos: [
      "Chapitre 4 · Les coulisses — Ce qui a été le plus difficile à mettre en place (paiements, espace membre, acquisition des premiers clients…) et comment tu t'y es pris.",
      "Chapitre 5 · Résultats et suite — **La suite** : `[À COMPLÉTER]` — formations vidéo, nouveaux packs, objectif de clients…",
    ],
  },
  {
    slug: "cosmos",
    name: "Cosmos",
    categories: ["Développement"],
    status: "En ligne",
    accent: "#4C6EF5",
    url: "https://cosmos-univers.lovable.app/",
    tagline: "L'Univers en 3D, directement dans le navigateur.",
    chapters: [
      {
        n: 1,
        slug: "vue-densemble",
        title: "Vue d'ensemble",
        blocks: [
          { kind: "p", text: "Cosmos est un portail immersif d'exploration de l'Univers. Le Système solaire y est rendu en **3D temps réel** — planètes en orbite, Soleil, ceinture d'astéroïdes, milliers d'étoiles — et se manipule directement à la souris." },
          { kind: "p", text: "Une chronologie animée retrace les 13,8 milliards d'années d'histoire cosmique, une carte interactive parcourt la Voie lactée, et une section détaille la formation de la Terre." },
          { kind: "p", text: "**À l'origine, un projet d'apprentissage. En pratique, la démonstration technique la plus aboutie de l'écosystème.**" },
        ],
      },
      {
        n: 2,
        slug: "probleme",
        title: "Le problème",
        blocks: [
          { kind: "p", text: "Celui-ci est différent des autres projets : le problème à résoudre était **personnel**." },
          { kind: "p", text: "Après plusieurs projets construits avec des outils no-code et assistés par IA, une question devenait inévitable : est-ce que je sais vraiment développer, ou est-ce que je sais seulement assembler ?" },
          { kind: "p", text: "Il fallait un projet assez exigeant techniquement pour que la réponse soit sans ambiguïté. Assez complexe pour ne pas pouvoir être bâclé, et assez visuel pour que le résultat soit immédiatement jugeable. La 3D dans le navigateur cochait les deux cases : ça ne pardonne rien." },
          { kind: "p", text: "Accessoirement, il y avait un vrai sujet : l'astronomie est fascinante mais mal servie sur le web, où elle se résume souvent à des articles illustrés. Un système solaire qu'on manipule soi-même apprend plus qu'un schéma fixe." },
        ],
      },
      {
        n: 3,
        slug: "solution",
        title: "La solution",
        blocks: [
          { kind: "p", text: "**Système solaire en 3D temps réel** — Planètes en orbite, Soleil, ceinture d'astéroïdes, milliers d'étoiles. Entièrement manipulable à la souris." },
          { kind: "p", text: "**Chronologie de 13,8 milliards d'années** — Une frise animée du Big Bang à aujourd'hui, pour rendre une échelle de temps impensable un peu plus tangible." },
          { kind: "p", text: "**Carte interactive de la Voie lactée** — Notre galaxie à explorer, avec ses régions et ses repères." },
          { kind: "p", text: "**Formation de la Terre** — Une section dédiée aux étapes de formation de notre planète." },
          { kind: "p", text: "Cinq sections au total, chacune avec ses fiches détaillées. Le principe partout : **on manipule d'abord, on lit ensuite**." },
        ],
      },
      {
        n: 4,
        slug: "coulisses",
        title: "Les coulisses",
        blocks: [
          { kind: "p", text: "C'est le projet le plus intéressant techniquement, et le plus révélateur du parcours." },
          { kind: "p", text: "Il a commencé comme un **prototype sur Lovable**. Puis il a été **entièrement recréé avec Claude Code et GitHub** — un changement de méthode majeur : passer d'un outil qui génère à un environnement où on lit, modifie et versionne réellement son code." },
          { kind: "p", text: "La 3D repose sur **Three.js / WebGL**. Les difficultés réelles n'ont pas été de faire tourner des sphères, mais tout ce qui vient autour : les performances (une scène 3D peut vider une batterie de téléphone en quelques minutes), les échelles (le Système solaire à l'échelle réelle est illisible — il faut le truquer intelligemment), et les contrôles (une caméra 3D mal réglée rend un site inutilisable)." },
          { kind: "p", text: "**Ce que ce projet m'a appris** : Three.js, WebGL, Git et GitHub, l'optimisation de performances — et surtout la différence entre assembler un site et le construire." },
        ],
      },
      {
        n: 5,
        slug: "resultats",
        title: "Résultats et suite",
        blocks: [
          { kind: "p", text: "**Statut** : en ligne." },
          { kind: "p", text: "Cosmos n'a pas d'objectif commercial, et c'est justement ce qui lui donne sa valeur : c'est la **preuve technique** de l'écosystème. Un partenaire ou un recruteur qui veut vérifier un niveau de développement n'a pas besoin d'un CV — il ouvre Cosmos." },
          { kind: "p", text: "Les compétences acquises ici servent tous les autres projets, y compris le site que vous lisez en ce moment." },
        ],
      },
    ],
    todos: [
      "Chapitre 4 · Les coulisses — Le passage de Lovable à Claude Code + GitHub : ce que ça a changé pour toi. C'est un excellent argument face à un collaborateur, parce que ça montre une progression technique réelle et datée.",
      "Chapitre 5 · Résultats et suite — **La suite** : `[À COMPLÉTER]`",
    ],
  },
  {
    slug: "pawvolt",
    name: "PawVolt",
    categories: ["E-commerce"],
    status: "En ligne",
    accent: "#FF7A18",
    url: "https://www.pawvolt.eu/",
    tagline: "Promenez 2 chiens. Zéro nœud. Zéro chaos.",
    chapters: [
      {
        n: 1,
        slug: "vue-densemble",
        title: "Vue d'ensemble",
        blocks: [
          { kind: "p", text: "PawVolt est une marque construite autour d'un produit phare : une **laisse double intelligente**, pensée pour promener deux chiens sans nœuds ni emmêlements." },
          { kind: "p", text: "L'ambition n'est pas d'ouvrir une boutique de plus, mais de bâtir une vraie marque : un produit précis, une promesse claire, une garantie, une histoire. Livraison gratuite dès 39 €, garantie 30 jours." },
          { kind: "p", text: "**Pour qui** : les propriétaires de deux chiens ou plus — un public précis, avec un problème précis, qu'il vit tous les jours." },
        ],
      },
      {
        n: 2,
        slug: "probleme",
        title: "Le problème",
        blocks: [
          { kind: "p", text: "Promener deux chiens avec deux laisses séparées, c'est une lutte quotidienne. Les chiens se croisent, les laisses s'emmêlent, il faut s'arrêter, démêler, recommencer. La promenade, censée être un moment agréable, devient une corvée de gestion." },
          { kind: "p", text: "Le marché des accessoires pour animaux est par ailleurs saturé de produits **génériques** : des articles sans identité, vendus par des dizaines de boutiques identiques, sans marque derrière et sans garantie sérieuse. L'acheteur ne sait pas à qui il achète, et la confiance n'existe pas." },
          { kind: "p", text: "Il y a donc deux problèmes superposés : **un problème d'usage** — les laisses s'emmêlent — et **un problème de confiance** — à qui acheter ?" },
        ],
      },
      {
        n: 3,
        slug: "solution",
        title: "La solution",
        blocks: [
          { kind: "p", text: "**Un produit qui résout précisément le problème** — La laisse double intelligente permet de promener deux chiens sans emmêlement. Une promesse en une phrase : *zéro nœud, zéro chaos*." },
          { kind: "p", text: "**Une marque, pas une boutique** — Une identité, une histoire, une F.A.Q., une page produit soignée. L'acheteur sait à qui il a affaire." },
          { kind: "p", text: "**Des engagements clairs** — Livraison gratuite dès 39 €, garantie 30 jours. Sur un marché où la confiance manque, la garantie n'est pas un détail : c'est l'argument principal." },
          { kind: "p", text: "**Un positionnement premium** — Des produits utiles, modernes et élégants, plutôt qu'un catalogue large et impersonnel. Mieux vaut un produit qu'on assume qu'une liste qu'on subit." },
        ],
      },
      {
        n: 4,
        slug: "coulisses",
        title: "Les coulisses",
        blocks: [
          { kind: "p", text: "PawVolt est construit sur **Shopify**, avec un travail de fond sur le branding, la publicité en ligne et les funnels de conversion." },
          { kind: "p", text: "C'est le projet le plus différent des autres : il n'y a **pas de code**. Toute la difficulté est ailleurs — dans le choix du produit, l'identité de marque, la rédaction des pages, la structure de l'offre et l'acquisition de trafic." },
          { kind: "p", text: "Le choix du produit unique est délibéré. Une marque qui vend cinquante articles ne raconte rien ; une marque qui résout un problème précis est mémorable. C'est aussi beaucoup plus simple à faire connaître : on peut expliquer PawVolt en une phrase." },
          { kind: "p", text: "**Ce que ce projet m'apprend** : la chaîne e-commerce complète — produit, marque, acquisition, conversion — sans écrire une ligne de code." },
        ],
      },
      {
        n: 5,
        slug: "resultats",
        title: "Résultats et suite",
        blocks: [
          { kind: "p", text: "**Statut** : en ligne. La boutique est ouverte, la marque est posée, le produit est défini." },
          { kind: "p", text: "C'est le projet le plus jeune de l'écosystème, et le seul dont le succès se mesurera en ventes plutôt qu'en usages. Il applique directement ce qui a été appris sur EydenDesigns — le premier e-commerce — et ce qui est enseigné dans MindSet & Business Lab en marketing et en funnels." },
        ],
      },
    ],
    todos: [
      "Chapitre 4 · Les coulisses — Comment tu as choisi ce produit, et où en est la préparation (sourcing, premiers tests, date de lancement visée).",
      "Chapitre 5 · Résultats et suite — **La suite** : `[À COMPLÉTER]` — lancement, premiers produits, objectifs.",
    ],
  },
  {
    slug: "eyden-designs",
    name: "EydenDesigns",
    categories: ["Design", "Print-on-Demand"],
    status: "En pause",
    accent: "#EC4899",
    url: "https://eydendesigns.lovable.app/",
    tagline: "Des créations originales, sur les objets du quotidien.",
    chapters: [
      {
        n: 1,
        slug: "vue-densemble",
        title: "Vue d'ensemble",
        blocks: [
          { kind: "p", text: "EydenDesigns est le **tout premier projet e-commerce** de l'écosystème : une vitrine de créations graphiques et de produits personnalisés — t-shirts, pulls, tote bags, mugs, art mural — dont la vente se fait sur Etsy." },
          { kind: "p", text: "Le projet est aujourd'hui en pause, mais il occupe une place particulière : c'est là que tout a commencé côté commerce." },
        ],
      },
      {
        n: 2,
        slug: "probleme",
        title: "Le problème",
        blocks: [
          { kind: "p", text: "Le print-on-demand a démocratisé la vente de produits personnalisés — et l'a aussi noyée sous les mêmes visuels génériques, déclinés à l'infini par des milliers de boutiques identiques." },
          { kind: "p", text: "Le pari d'EydenDesigns : **des créations réellement pensées**, pas des visuels assemblés à la chaîne. Sur un marché saturé, la seule différenciation possible est la qualité du design." },
        ],
      },
      {
        n: 3,
        slug: "solution",
        title: "La solution",
        blocks: [
          { kind: "p", text: "**Des créations originales** — Des designs conçus, pas des visuels génériques recyclés." },
          { kind: "p", text: "**Une gamme volontairement variée** — T-shirts, pulls, tote bags, mugs, art mural : le même univers graphique décliné sur des supports du quotidien." },
          { kind: "p", text: "**Etsy comme place de marché** — Plutôt que de construire une boutique isolée sans trafic, s'installer là où les acheteurs cherchent déjà ce type de produits." },
          { kind: "p", text: "**Une vitrine dédiée** — Un site propre pour présenter l'univers, là où une fiche Etsy seule ne raconte rien." },
        ],
      },
      {
        n: 4,
        slug: "coulisses",
        title: "Les coulisses",
        blocks: [
          { kind: "p", text: "Le site vitrine a été réalisé avec **Lovable**, la vente passe par **Etsy** et un service de print-on-demand." },
          { kind: "p", text: "C'est le projet où tout a été appris pour la première fois : créer une identité, écrire des fiches produit, comprendre comment une place de marché met en avant certains articles, et découvrir que **le design ne suffit pas** — sans acquisition, un beau produit reste invisible." },
          { kind: "p", text: "**Ce que ce projet m'a appris** : les fondamentaux du e-commerce, et l'importance de l'acquisition — leçon appliquée directement à PawVolt." },
        ],
      },
      {
        n: 5,
        slug: "resultats",
        title: "Résultats et suite",
        blocks: [
          { kind: "p", text: "**Statut** : en pause." },
          { kind: "p", text: "EydenDesigns est le point de départ de toute l'aventure commerciale. Sans lui, PawVolt n'existerait pas sous cette forme : les erreurs faites ici ont été évitées là-bas." },
          { kind: "p", text: "Le garder visible sur ce site est délibéré. Un parcours crédible n'est pas une succession de réussites — c'est une progression, avec des projets qu'on met de côté pour avancer ailleurs." },
        ],
      },
    ],
    todos: [
      "Chapitre 4 · Les coulisses — **Pourquoi le projet est en pause** : `[À COMPLÉTER]`. Le dire franchement est un atout, pas une faiblesse. Un projet mis en pause pour concentrer ses efforts ailleurs, c'est une décision d'entrepreneur — et ça se lit comme telle.",
      "Chapitre 5 · Résultats et suite — **La suite** : `[À COMPLÉTER]` — reprise éventuelle, ou arrêt assumé.",
    ],
  },
  {
    slug: "auteur-edition",
    name: "Auteur & Édition",
    categories: ["Édition numérique"],
    status: "En cours",
    accent: "#D9A55B",
    url: "https://mindsetbusinesslab.store/ebooks",
    tagline: "15 e-books, 2 packs. Écrits pour agir.",
    chapters: [
      {
        n: 1,
        slug: "vue-densemble",
        title: "Vue d'ensemble",
        blocks: [
          { kind: "p", text: "Auteur & Édition rassemble la bibliothèque de contenus éducatifs de l'écosystème : **15 e-books et 2 packs de formation**, dont un ouvrage principal d'environ 350 pages." },
          { kind: "p", text: "Business en ligne, marketing, publicité, e-commerce, Etsy, branding, finance, mindset, création de contenu, IA : chaque titre vise l'applicable, jamais la théorie pour la théorie." },
        ],
      },
      {
        n: 2,
        slug: "probleme",
        title: "Le problème",
        blocks: [
          { kind: "p", text: "Deux problèmes se répondent." },
          { kind: "p", text: "Côté lecteur : la plupart des livres business expliquent des principes sans jamais descendre au niveau de l'action. On termine la lecture convaincu, motivé — et incapable de dire ce qu'on doit faire lundi matin." },
          { kind: "p", text: "Côté écosystème : une plateforme de formation ne vaut que ce que vaut son contenu. Sans matière première solide, MindSet & Business Lab ne serait qu'une coquille." },
          { kind: "p", text: "Écrire soi-même règle les deux : le lecteur reçoit des méthodes concrètes, et la plateforme repose sur du contenu maîtrisé de bout en bout." },
        ],
      },
      {
        n: 3,
        slug: "solution",
        title: "La solution",
        blocks: [
          { kind: "p", text: "**Un ouvrage principal** — Environ 350 pages, le socle de la bibliothèque." },
          { kind: "p", text: "**Une série de titres spécialisés** — Chaque livre traite un sujet précis plutôt qu'un survol général : *Le Business IA*, *L'École des Entrepreneurs*, *Les 100 Leçons du Jeune Entrepreneur*, et les titres sur la publicité, le branding, Etsy, la finance, le mindset, la création de contenu." },
          { kind: "p", text: "**2 packs de formation** — Des regroupements cohérents pour ceux qui veulent un parcours complet plutôt qu'un titre isolé." },
          { kind: "p", text: "**Un principe d'écriture constant** — Chaque chapitre doit produire une action possible. Si un passage n'apprend rien à faire, il saute." },
        ],
      },
      {
        n: 4,
        slug: "coulisses",
        title: "Les coulisses",
        blocks: [
          { kind: "p", text: "Écrire 15 e-books demande une méthode plus qu'une inspiration : un plan par ouvrage, un enchaînement de chapitres, une relecture, une mise en page, une couverture, puis la mise en vente." },
          { kind: "p", text: "Les livres ne sortent pas de nulle part : ils viennent directement de ce qui est appris en construisant les autres projets. *Le Business IA* existe parce que Synthesia a été construit ; les titres e-commerce existent parce qu'EydenDesigns et PawVolt ont été menés. **On n'écrit bien que ce qu'on a fait.**" },
          { kind: "p", text: "**Ce que ce projet m'a appris** : structurer une pensée sur la longueur, et transformer une expérience en méthode transmissible." },
        ],
      },
      {
        n: 5,
        slug: "resultats",
        title: "Résultats et suite",
        blocks: [
          { kind: "p", text: "**Statut** : en cours — la bibliothèque continue de s'étendre." },
          { kind: "p", text: "- **15 e-books** écrits et publiés - **2 packs** de formation - **~350 pages** pour l'ouvrage principal - Vendus via MindSet & Business Lab, avec +25 clients et 4,9/5 de note moyenne" },
          { kind: "p", text: "C'est la profondeur éducative de l'écosystème : le projet le moins spectaculaire et l'un des plus solides. Il transforme chaque expérience des autres projets en contenu durable." },
        ],
      },
    ],
    todos: [
      "Chapitre 4 · Les coulisses — Ta méthode d'écriture : comment tu passes de l'idée au livre publié.",
      "Chapitre 5 · Résultats et suite — **La suite** : `[À COMPLÉTER]` — prochains titres, formations vidéo.",
    ],
  },
];

export const chapterOrder = [
  "vue-densemble",
  "probleme",
  "solution",
  "coulisses",
  "resultats",
] as const;

export function getProject(slug: string) {
  return projectDetails.find((p) => p.slug === slug);
}

/** Projet suivant dans l'écosystème, pour garder le visiteur en circulation. */
export function nextProject(slug: string) {
  const i = projectDetails.findIndex((p) => p.slug === slug);
  return i < 0 ? null : projectDetails[(i + 1) % projectDetails.length];
}
