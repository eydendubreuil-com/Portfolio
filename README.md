# Portfolio — Eyden Dubreuil

Site portfolio personnel. Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Motion.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run typecheck
```

## Où se trouve quoi

| Chemin | Rôle |
|---|---|
| `content/site.config.ts` | **Tout le contenu du site.** Bio, projets, stats, liens. Aucun texte n'est en dur dans les composants. |
| `docs/STYLE.md` | La bible visuelle : palette, typo, ombres, motion. Fait autorité. |
| `docs/effects.md` | Quels effets sont implémentés, lesquels ont été écartés, et pourquoi. |
| `src/app/globals.css` | Les tokens de `STYLE.md` traduits en CSS. |
| `src/styles/animations.css` | Les keyframes (aurora, respiration, tracé, flottement). |
| `src/lib/theme.ts` | Les mêmes valeurs exportées en TypeScript, pour le SVG et les styles inline. |
| `src/components/` | `ui/` primitives, `layout/` nav et pied de page, `hero/`, `sections/`. |

## À compléter

Les entrées marquées `TODO` dans `content/site.config.ts` sont des textes provisoires,
écrits faute d'avoir le dossier `portfolio-eyden/` d'origine. À remplacer :

- la biographie et la phrase d'accroche ;
- les descriptions réelles des quatre projets ;
- les chiffres de la section statistiques ;
- les URL des projets, des dépôts et des réseaux sociaux ;
- le domaine dans `site.url` (utilisé par les métadonnées Open Graph).

Éditer ce seul fichier suffit : aucun composant n'a besoin d'être touché.

## Police Satoshi

`STYLE.md` demande Satoshi pour les titres. Elle n'est pas distribuée par Google Fonts.
Pour l'activer, déposer les fichiers dans `public/fonts/` et ajouter une règle
`@font-face`. Inter assure le rendu des titres d'ici là.

## Déploiement

Le site est entièrement statique (`○ (Static)` au build) et se déploie tel quel sur
Vercel : importer le dépôt, aucune variable d'environnement n'est requise.
