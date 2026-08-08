# Portfolio — Eyden

Site portfolio personnel. Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Motion.

**Sept projets, quatre en ligne.** Synthesia, EcoLeaf, MindSet & Business Lab, Cosmos
(en ligne) · PawVolt (en préparation) · EydenDesigns (en pause) · Auteur & Édition (en cours).

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de production
npm run typecheck
```

## Où se trouve quoi

| Chemin | Rôle |
|---|---|
| `src/content/` | **Tout le contenu du site.** Aucun texte n'est en dur dans un composant. |
| `src/content/projects.ts` | Les 7 projets : description, objectif, techno, statut, lien, accent, position dans la constellation |
| `src/content/about.ts` | Les réponses aux 3 questions — mots exacts, à ne pas réécrire |
| `src/content/site.config.ts` | Identité, navigation, réseaux, hero, vision, contact |
| `src/content/stats.ts` · `skills.ts` · `timeline.ts` | Chiffres, compétences, parcours |
| `docs/STYLE.md` | La bible visuelle. Fait autorité sur toute valeur de style. |
| `docs/effects.md` | Quels effets sont implémentés, lesquels ont été écartés, et pourquoi. |
| `src/app/globals.css` | Les tokens de `STYLE.md` traduits en CSS |
| `src/components/visual/` | Constellation et champ d'étoiles du hero |

## Ce qu'il reste à faire

- **Les années du parcours.** `src/content/timeline.ts` affiche `—` : aucune date n'a été
  inventée. À remplir.
- **La capture de PawVolt.** Aucune image reçue ; la carte affiche un bloc à l'accent orange.
  Déposer le fichier dans `public/projets/` puis renseigner `image` dans `projects.ts`.
- **La police Satoshi.** Voir la note dans `docs/STYLE.md` — Inter assure le rendu d'ici là.
- **Les accents d'EydenDesigns (rose) et d'Auteur & Édition (ambre)** sont des propositions.

## Formulaire de contact

Le formulaire poste sur `/api/contact`. Sans variables d'environnement, la route répond
proprement et invite à écrire à l'adresse affichée — elle n'échoue jamais en silence.

Pour activer l'envoi, dans Vercel (jamais dans le code) :

| Variable | Rôle |
|---|---|
| `RESEND_API_KEY` | Clé API Resend |
| `CONTACT_TO_EMAIL` | Adresse de réception |

Le champ `website` du formulaire est un piège à robots : masqué, il doit rester vide.

## Déploiement

Push GitHub → import du repo sur Vercel → Next.js détecté → Deploy. Chaque push redéploie,
chaque branche donne une URL de preview : c'est là qu'on regarde le rendu, y compris depuis
un téléphone, sans dépendre d'un `npm run dev` local.

Domaine `eyden.dev` : à ajouter dans Vercel → Domains, HTTPS automatique.

## État vérifié

Build statique, `npm run typecheck` et `npm run build` passent. Contrôlé au navigateur en
375 / 768 / 1440 px : aucun débordement horizontal, aucune erreur console, un seul `<h1>`,
toutes les images chargées avec `alt`. Navigation clavier de bout en bout avec focus visible,
menu mobile avec piège à focus et fermeture par Échap.

**Poids JS au premier chargement : 164 kB** (objectif du brief : < 120 kB). L'écart vient de
Motion, présent dans la stack demandée et utilisé par la séquence d'ouverture, la
constellation et les cartes. Le formulaire de contact (react-hook-form + zod) est déjà
chargé à la demande pour sortir du bundle initial.
