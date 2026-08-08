# Effets — règles de retenue

## Principe

Un effet marquant par section, au maximum. **Un seul effet spectaculaire sur tout le
site** : la constellation du hero. Tous les autres doivent être presque imperceptibles.

## Ce qui est implémenté

| Effet | Règle appliquée | Où |
|---|---|---|
| Séquence d'ouverture | ~1,4 s : eyebrow → titre → nœuds → lignes → texte → boutons → pastilles | `sections/Hero.tsx` |
| Constellation | Un nœud par projet à son accent ; les 4 en ligne bien visibles, PawVolt discret. Survol : le nom apparaît et les lignes s'illuminent. Clic : défilement vers la carte. | `visual/Constellation.tsx` |
| Champ d'étoiles | Canvas, ≤ 60 particules, `requestAnimationFrame` **mis en pause hors viewport** via IntersectionObserver | `visual/Starfield.tsx` |
| Liseré de carte | 2px à l'accent du projet, au survol seulement | `sections/Projects.tsx` |
| Segment de parcours | Dégradé qui progresse au scroll | `sections/Timeline.tsx` |
| Compteurs | Joués une seule fois à l'entrée dans le viewport | `sections/Stats.tsx` |
| Scroll reveal | `opacity` + `translateY 16px`, décalage 60 ms, une seule fois | `ui/Reveal.tsx` |
| Révélation mot à mot | Toute la section « À propos » : repères, eyebrows, questions, citations et réponses. Le pas décroît du titre vers le corps. | `ui/staggerText.tsx` |
| Bordure lumineuse | Dégradé conique en rotation. **Trois emplacements, pas un de plus** : la carte de preuves de l'étude de cas (à l'accent de MindSet), le bloc de statistiques et la carte de contact. Animation coupée hors viewport. | `ui/GlowBorderCard.tsx` |

## Ce qui a été écarté

- **Aurora en fond de hero** — le fond par défaut de tous les sites IA. Le champ d'étoiles
  et la constellation disent quelque chose de vrai : des projets distincts qui forment un
  réseau. La forme porte le message.
- **Boutons magnétiques** — coûteux en attention, rien d'essentiel n'est perdu sans eux.
- **Cartes flottantes** — une grille entière qui flotte désoriente.
- **Parallax** — jamais sur du texte, ça nuit à la lisibilité.
- **Zustand, GSAP** — aucun état global ni besoin d'animation avancée sur un site statique.

## La bordure lumineuse — trois pièges rencontrés

1. **`@property` est indispensable.** Un angle de `conic-gradient` passé par une variable
   CSS ordinaire n'est pas interpolable : l'animation saute de 0° à 360° au lieu de
   tourner. La déclaration `@property --glow-angle` doit rester au premier niveau du CSS,
   jamais dans un `@layer`.

2. **Le preflight Tailwind pose `border: 0 solid` sur tout élément.** Une `border-width`
   sans `border-color` explicite hérite donc de `currentColor` — ici `#F4F6FB`. Le composant
   d'origine dessinait ainsi un cadre blanc de 21px qui masquait entièrement le dégradé :
   la « lueur » visible n'était que cette bordure blanche floutée. D'où `border: 0` explicite.

3. **`animation-play-state` doit passer en style inline.** `.glow-conic` vit hors
   `@layer`, donc son raccourci `animation` — qui réinitialise `play-state` à
   `running` — l'emporte sur l'utilitaire Tailwind `[animation-play-state:paused]`,
   elle layered. La classe s'appliquait bien, sans aucun effet. Même piège de
   cascade que le reset non-layered.

4. **`accentRamp()` ne peut pas vivre dans le module du composant.**
   `GlowBorderCard.tsx` est `"use client"` ; un composant serveur qui appelle une
   fonction exportée par un module client fait échouer le build au prerender.
   D'où `src/lib/accent-ramp.ts`, module neutre.

5. **Le flou moyenne les stops adjacents.** Des couleurs trop pâles donnent un halo blanc ;
   alterner clair et foncé donne du gris. Il faut dix teintes saturées de luminance voisine,
   sur une plage restreinte (bleu → violet → cyan), pour que la moyenne reste colorée quel
   que soit l'angle. Même contrainte pour `accentRamp()`, qui dérive une rampe d'un accent
   projet : l'écart de teinte est limité à ± 14°, au-delà l'or de MindSet virait au
   vert-jaune.

La carte de contact est en surface opaque et non en verre, contrairement à la règle des
« deux éléments en verre ». Le dégradé qui tourne derrière transparaîtrait sinon à travers
toute la carte, derrière le formulaire. Le verre reste sur la barre de navigation.

## La révélation mot à mot — deux pièges

1. **Le déclencheur doit être sur le conteneur, jamais sur les mots.** Chaque mot vit
   dans un masque `overflow: hidden` et démarre décalé de 115 % vers le bas : il est
   donc hors du rectangle d'intersection de son propre parent. Un `whileInView` posé
   sur le mot ne se déclenche jamais — l'élément se cache lui-même de l'observateur,
   et **toute la section reste blanche**. Les variants remontent l'observation sur le
   conteneur, non clippé, et n'installent qu'un observateur au lieu d'un par mot.

2. **Le masque coupe les diacritiques.** Un padding bas suffit pour les jambages
   (g, j, p, y), mais pas pour les accents des capitales : « À PROPOS » s'affichait
   « A PROPOS ». Il faut du padding en haut *et* en bas, annulé par des marges
   négatives pour ne pas décaler la ligne.

Le pas est plafonné par `maxStaggerTotal`. Sans ce garde-fou, la révélation devient
inutilisable dès que le texte s'allonge : les réponses font près de 200 mots, soit
quarante secondes d'attente à 0,2 s le mot.

**Compromis assumé :** le texte apparaît deux fois dans le DOM — une copie `sr-only`
lue par les lecteurs d'écran, et les fragments animés en `aria-hidden`. Sans ça, un
lecteur d'écran énoncerait le texte mot par mot avec une pause entre chaque.

## Accessibilité

`prefers-reduced-motion: reduce` est traité globalement dans `globals.css` : animations et
transitions tombent à `0.01ms`. En complément, côté JS :

- le champ d'étoiles ne lance pas sa boucle et rend une image fixe ;
- la constellation affiche ses lignes sans les tracer et ses nœuds sans respiration ;
- les compteurs affichent directement leur valeur finale ;
- le défilement déclenché par un clic sur un nœud passe en `behavior: "auto"` ;
- la bordure lumineuse cesse de tourner et se fige sur un angle choisi — la lueur reste,
  seul le mouvement disparaît ;
- la révélation mot à mot rend le texte tel quel, sans aucun fragment ni masque.

## Test de validation

Retire mentalement tous les effets d'une section. Si elle reste belle, lisible et
équilibrée par la seule typographie et le seul espacement, les effets sont bien un
supplément — et non un pansement.
