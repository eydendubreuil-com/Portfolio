# Effets — règles de retenue

## Principe

Un effet marquant par section, au maximum. **Un seul effet spectaculaire sur tout le
site** : la constellation du hero. Tous les autres doivent être presque imperceptibles.

## Ce qui est implémenté

| Effet | Règle appliquée | Où |
|---|---|---|
| Séquence d'ouverture | ~1,4 s : eyebrow → titre → nœuds → lignes → texte → boutons → pastilles | `sections/Hero.tsx` |
| Constellation | Un nœud par projet à son accent ; les 4 en ligne bien visibles, PawVolt discret. Survol : le nom apparaît et les lignes s'illuminent. Clic : défilement vers la carte. | `visual/Constellation.tsx` |
| AnimatedRays | Aurora en fond de hero, masque radial ancré en haut à droite. Composant intégré **verbatim**, sans modification. | `ui/animated-rays.tsx` |
| Ruban vrillé 3D | Bandeau de fond du hero. Projection perspective maison, tri en profondeur, éclairage par normale. **La souris pilote la caméra** (lacet et tangage) et la direction de la lumière. Tenu en texture : flou 2px, opacité 0,5. | `ui/twisting-ribbon.tsx` |
| Champ d'étoiles | Canvas, ≤ 60 particules, `requestAnimationFrame` **mis en pause hors viewport** via IntersectionObserver | `visual/Starfield.tsx` |
| Liseré de carte | 2px à l'accent du projet, au survol seulement | `sections/Projects.tsx` |
| Segment de parcours | Dégradé qui progresse au scroll | `sections/Timeline.tsx` |
| Compteurs | Joués une seule fois à l'entrée dans le viewport | `sections/Stats.tsx` |
| Scroll reveal | `opacity` + `translateY 16px`, décalage 60 ms, une seule fois | `ui/Reveal.tsx` |
| Révélation mot à mot 3D | Toute la section « À propos ». Chaque mot bascule en `rotateX` depuis sa ligne, avec sa propre perspective. **Les titres, eyebrows et citations réagissent au curseur** : les mots proches avancent et pivotent. Pas sur les réponses — voir plus bas. | `ui/staggerText.tsx` |
| Bordure lumineuse 3D | Dégradé conique en rotation. **La carte s'incline sous le curseur** (`matrix3d` réelle, perspective 1200px) et la couronne s'incline 1,35× plus fort — l'écart de parallaxe fait le relief. L'angle du dégradé suit le curseur, ce qui le fait lire comme une source de lumière. **Trois emplacements, pas un de plus** : la carte de preuves de l'étude de cas (à l'accent de MindSet), le bloc de statistiques et la carte de contact. Animation coupée hors viewport. | `ui/GlowBorderCard.tsx` |

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

## Le ruban de fond — ce qu'il a fallu régler

1. **Le contraste du texte.** Les lobes clairs du ruban passaient sous la colonne de
   texte et faisaient tomber l'eyebrow à **4,05:1**, sous le seuil AA. Un voile
   dégradé côté gauche le remonte à 6,26:1 et laisse le ruban entier à droite, là
   où il n'y a rien à lire. Mesuré au pixel, texte masqué, pas jugé à l'œil.

2. **Un `fill()` par segment est trop cher.** La couleur ne change qu'aux paliers de
   la palette et aux bascules de face, soit ~60 fois pour 400 segments. Regrouper les
   segments consécutifs de même couleur en un seul tracé fait passer le hero de
   48 à 56 fps en headless.

3. **Quatre calques animés dans le hero.** Ruban, étoiles, constellation, halo au
   curseur. C'est au-delà de ce que ce document recommande. Le ruban est donc tenu
   en fond — flou de 2px, opacité 0,4 — pour rester une texture et laisser la
   constellation seule au premier plan. À surveiller si un cinquième arrive.

## AnimatedRays — trois dépendances à fournir

Le composant est repris tel quel. Il s'appuie sur trois choses qu'il ne fournit pas,
et c'est le site qui les apporte — pas lui qu'on modifie :

1. **La classe `dark` sur `<html>`.** Le composant lit
   `document.documentElement.classList.contains("dark")` pour choisir son filtre.
   Sans elle il prend sa branche claire, `invert(100%)`, et devient un aplat blanc
   sur le fond bleu nuit. La classe est constante : le site n'a qu'un thème. Vérifié
   au préalable qu'aucune utilitaire `dark:` n'existe ailleurs — l'ajout est sans
   effet de bord.

2. **`--stripe-color`.** Consommée dans le `repeating-linear-gradient` des rayures.
   Une couleur non définie rend la déclaration entière invalide : la couche de
   rayures disparaît et il ne reste que l'arc-en-ciel. Contrôlé après coup —
   `background-image` compte bien **deux** gradients.

3. **L'animation `animate-aurora-bg`.** La classe est appliquée par le composant mais
   l'animation n'existait pas. C'est le défilement de `background-position` qui fait
   dériver les rayons.

**Ordre des calques.** Placés sous le bandeau du ruban, les rayons se coupaient net
sur toute la moitié droite : le voile de ce bandeau se termine en fond opaque à sa
hauteur exacte, produisant une couture horizontale franche. Les rayons passent donc
au-dessus, et seul leur propre masque radial les adoucit.

**Contraste.** Sous les rayons, l'eyebrow tombe de 6,34 à **4,77:1** — au-dessus du
seuil AA, mais la marge est mince. À surveiller si les rayons gagnent en opacité.

## Passage en 3D interactif — ce que la mesure a montré

1. **Le tri en profondeur fait la 3D du ruban.** Sans lui, les segments se dessinent
   dans l'ordre de l'index et les parties lointaines passent par-dessus les proches
   quand la bande se croise — l'illusion tombe. Le tri se fait par tranches de
   ~8 segments plutôt que segment par segment : trier finement casserait le rendu
   par lots, qui est ce qui tient le budget de frame.

2. **Trop de profondeur tue la 3D.** À `zAmp = 0.55 × hauteur`, le ruban partait si
   loin qu'après division perspective il ne restait presque rien à l'écran : 950
   pixels peints contre 3 100 en 2D. Ramené à 0,3, on garde le raccourci perspectif
   *et* la présence.

3. **Les positions des mots doivent être mesurées après la révélation.** Mesurées au
   montage, elles enregistrent la position de départ — les mots sont alors décalés de
   115 % sous leur ligne. Conséquence mesurée : le `translateZ` plafonnait à 5,9 px
   au lieu de 16. La re-mesure est branchée sur `onAnimationComplete`.

4. **Les positions sont en coordonnées document, pas viewport.** En viewport, elles se
   périment à chaque défilement et il faudrait re-mesurer sur `scroll` — un recalcul
   de mise en page par mot à chaque frame de scroll. En coordonnées document elles
   restent valides et l'on compare avec `pageX/pageY`.

5. **Deux écritures concurrentes sur `transform` s'annulent.** Motion pilote la
   transform du mot pendant la révélation ; l'effet curseur vit donc sur un span
   intérieur dédié. Même raison pour la carte : l'inclinaison passe par des custom
   properties écrites en direct, jamais par un `setState` — un re-rendu de l'arbre
   à 60 Hz pour un effet purement visuel.

**Ce qui n'est volontairement pas interactif :** les réponses de la section « À
propos ». 200 mots à mesurer à chaque `mousemove`, et surtout : on ne fait pas bouger
un texte pendant qu'on le lit.

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

## Barre de navigation « spotlight »

`src/components/ui/spotlight-navbar.tsx`. Deux lumières distinctes sur une pastille
de verre : un halo large qui suit le curseur, et un trait de 2 px sous l'onglet de la
section courante. Les deux positions transitent par des variables CSS
(`--spotlight-x`, `--ambience-x`) écrites en JS ; c'est ce qui évite de repeindre du
React à chaque `mousemove`.

### Ce que le composant attend de son hôte

Comme `AnimatedRays`, il lit chez le site des choses qu'il ne définit pas :

| Attendu | Fourni par | Sans ça |
| --- | --- | --- |
| `.spotlight-nav`, `.spotlight-nav-bg`, `.glass-border`, `.spotlight-nav-shadow` | `globals.css`, `@layer components` | Pastille transparente, sans bord ni verre |
| `--spotlight-color`, `--ambience-color` | idem, branche `.dark` | Lumières noires de la démo, invisibles sur le fond bleu |
| Classe `.dark` sur `<html>` | `layout.tsx` | Voir le piège n° 1 |

La démo d'origine portait ces règles dans un `<style jsx>` local et dans une feuille
annexe absente du dépôt. Tout est remonté dans `globals.css`, là où vit déjà le reste
du CSS d'effet.

### Pièges rencontrés

1. **`dark:` ne suit pas la classe `.dark` par défaut.** En Tailwind v4, la variante
   `dark:` est branchée sur `prefers-color-scheme`, pas sur une classe. Le composant
   écrit `text-black dark:text-white` : sur un OS réglé en clair, seul `text-black`
   s'appliquait — du texte noir sur du bleu nuit. Corrigé par
   `@custom-variant dark (&:where(.dark, .dark *))`. Vérifié avant l'ajout qu'aucune
   autre utilitaire `dark:` n'existait dans le projet, donc sans effet de bord.

2. **`e.preventDefault()` tuait la navigation.** Le gestionnaire de clic fourni
   annulait l'action par défaut du lien sans rien mettre à la place : cliquer sur un
   onglet ne menait plus nulle part. Retiré — l'ancre native fait déjà le bon travail,
   `scroll-behavior: smooth` et `scroll-padding-top` étant posés dans `globals.css`.
   Mesuré : un clic pose le haut de section à 96 px, exactement la marge déclarée.

3. **Le halo d'onglet actif mentait.** L'index actif n'était mis à jour qu'au clic :
   en lisant « Projets », la lumière restait sous le premier onglet. Un indicateur qui
   se trompe en permanence est pire que pas d'indicateur. `Nav.tsx` calcule donc la
   section courante au défilement et la passe en `activeIndex`. La valeur `-1`
   (aucune section, on est dans le hero) éteint la lumière — sans ce cas, la variable
   `--ambience-x` gardait sa dernière position et la lumière restait allumée sous
   « À propos » après un retour en haut de page.

4. **`isDark` était un état mort.** Le composant observait la classe `.dark` avec un
   `MutationObserver` pour alimenter un état jamais lu dans le rendu — les couleurs
   venaient en réalité du CSS. Observateur et état retirés.

5. **`framer-motion` n'est pas une dépendance déclarée.** Elle n'est présente que
   comme dépendance transitive de `motion`. L'import passe par `motion/react`, qui
   exporte le même `animate`.

### Bug de fond découvert au passage

`backdrop-filter` était **mort sur tout le site**, `.glass` compris — en-tête et menu
mobile. La source déclarait la propriété standard *puis* son doublon `-webkit-`;
Lightning CSS fusionnait les deux et ne gardait que la version préfixée, que Chromium
ne reconnaît pas (`CSS.supports('-webkit-backdrop-filter', 'blur(4px)') === false`).
Le doublon manuel a été retiré : le minifieur préfixe seul selon les cibles, et émet
désormais bien les deux. Vérifié après correction : `backdropFilter: "blur(16px)"`.

### Points de rupture

La pastille n'est rendue qu'à partir de `lg` (1024 px). En dessous, les cinq libellés
français débordent sur la marque ; le menu burger reprend la main, avec son piège à
focus et son verrou de défilement inchangés. Mesuré à 1440 / 1280 / 1024 / 1023 / 800
/ 390 px : aucun débordement horizontal, et jamais les deux navigations en même temps.

### Contraste mesuré

Sur les pixels rendus, texte sur le verre de la pastille : onglet actif **17,25:1**,
onglet inactif **6,68:1**. Les deux tiennent AA largement.

À noter : les libellés inactifs utilisent `text-neutral-400`, un gris **neutre**, là
où le reste du site emploie `--color-ink-muted` (`#b8c2d9`), légèrement bleuté. Le
contraste est bon, mais la teinte n'est pas celle de la palette. Laissé tel quel dans
le composant pour qu'il reste réutilisable ; à basculer sur le token du site si
l'écart se voit.

## Répartition des effets

Un effet par endroit, et un seul effet qui traverse tout le site.

| Section | Effet |
| --- | --- |
| Hero | Boutons magnétiques (la constellation a été retirée) |
| Positionnement | Rayons animés (angle haut droit) |
| À propos | Révélation mot à mot |
| Parcours | Ruban vrillé (moitié droite) |
| Focus | Bordure lumineuse (carte de preuve) |
| Compétences | Bandeau défilant |
| Statistiques | Parallaxe à trois plans + bordure lumineuse |
| Vision | Poussière d'étoiles |
| Contact | Bordure lumineuse + bouton d'envoi magnétique |
| **Tout le site** | **Grille d'onde révélée par la souris**, **curseur contextuel** |

Le hero ne porte plus de pièce décorative : la constellation occupait sa moitié
droite, elle est retirée et la colonne de texte reprend cette largeur (52 % →
59 % de la section, mesuré). Il ne reste que la grille d'onde, comme partout.

Le hero portait au départ le ruban, les rayons, les étoiles ET la constellation :
quatre pièces empilées au même endroit, cinq avec la grille. Le reste du site
n'avait rien. Elles ont été redistribuées — chaque section en porte une, aucune
n'en porte quatre.

Le placement suit le propos, pas la seule esthétique : un ruban qui serpente
derrière une frise chronologique, un ciel derrière la section qui parle
d'ambition et de long terme.

### Ce que déplacer un effet a coûté

- **Hero.** Le voile côté texte et le fondu du bandeau existaient uniquement à
  cause du ruban. Partis avec lui.
- **Rayons.** Leur masque interne est un `radial-gradient(ellipse at 100% 0%)`,
  calibré pour s'éteindre loin de ce coin. Sur une boîte pleine section, il n'a
  pas la place de s'éteindre et l'arc-en-ciel barre tout le bloc, texte compris.
  Contraints à un quart de section en haut à droite, plus un masque radial et une
  opacité de 0,5 posés sur le conteneur — jamais sur le composant.
  À savoir : leur calque interne est en `background-attachment: fixed`, donc
  ancré au viewport. Un conteneur plus petit le **recadre** au lieu de le
  réduire ; c'est pourquoi il faut un masque, et pas seulement une boîte.
- **Ruban.** Ses fondus passent de `--color-bg` à `--color-surface`, la section
  d'accueil n'ayant pas le même fond que le hero.
- **Étoiles.** Mesuré : une étoile tombant sous l'eyebrow de « Vision » le
  faisait descendre à 2,12:1. Le champ est ramené à 18 % côté texte par un masque,
  et garde toute son intensité à droite où il n'y a rien à lire. Résultat 4,64:1 —
  la marge la plus fine de la page.

### Un piège de mesure, pas de conception

Une série de relevés donnait « Vision · eyebrow » en échec à 2,92:1 même après
correction. La cause n'était pas la page : `scrollIntoViewIfNeeded` cale l'élément
au ras du haut du viewport, donc **sous l'en-tête fixe**. La capture photographiait
le verre de la barre et le texte blanc du menu au lieu du fond de section. En
redescendant l'élément sous la barre avant de mesurer : 4,64:1, conforme.

Vérifié après répartition, quinze relevés : le pire est 4,64:1, aucun sous 4,5:1.

## Les quatre interactions ajoutées

### Bouton magnétique — `Magnetic.tsx`

Sur les deux appels du hero et sur l'envoi du formulaire. C'est la seule
interaction du site qui agit directement sur le taux de clic : la cible devient
littéralement plus facile à atteindre.

Deux garde-fous, tous deux mesurés :

- **Déplacement plafonné à 12 px.** Au-delà, la cible fuit le curseur au lieu de
  l'attirer et l'effet s'inverse. Relevé : 12,00 px exactement au plus près.
- **Le contenu glisse moins que l'enveloppe** (facteur 0,35 — relevé 4,20 px pour
  12,00 px). C'est ce décalage qui se lit comme une attraction ; sans lui, on voit
  une boîte qui bouge.

Le clic reste fonctionnel malgré le déplacement : vérifié, il pose le haut de
`#projets` à 96 px, la marge de défilement déclarée.

### Parallaxe à trois plans — `Parallax.tsx`

Derrière les chiffres. Trois plans à trois amplitudes (relevées : 19, 45, 77 px
d'écart entre les deux extrêmes du cadre). Aucune perspective n'est calculée —
le cerveau lit la différence de vitesse comme de la distance, ce qui rend l'effet
quasi gratuit puisque seules des `translate` sont animées.

Piloté par le **pointeur**, jamais par le défilement : une parallaxe liée au
scroll désolidarise le contenu du geste et donne le mal des transports.

Les trois plans ne portent que des valeurs déjà affichées dans le bloc (`7`, `04`,
`PROJETS`). Rien n'y est ajouté qui ne soit vérifiable deux centimètres plus bas.

**Le piège qui a coûté le plus :** le composant posait `position: relative` en
ligne. Cela **écrasait** le `absolute` passé en classe par l'appelant, `inset-0`
cessait de s'appliquer, et l'hôte tombait à **1440×0**. Un élément de hauteur
nulle n'intersecte jamais rien : l'`IntersectionObserver` ne le signalait jamais
visible, le pointeur était ignoré, et l'effet restait monté, câblé et
parfaitement immobile. C'est le placement qui appartient à l'appelant, pas au
composant.

### Bandeau défilant — `Marquee.tsx`

Sous les compétences, avec le même contenu que les colonnes : les colonnes se
lisent, le bandeau se regarde. Aucune information n'est réservée au seul bandeau,
et la seconde copie est en `aria-hidden` pour ne pas doubler la lecture vocale.

La boucle n'est invisible **que si** la translation vaut exactement la largeur
d'une copie. Mesuré : 4 038 px contre 4 038 px, **écart nul**. La largeur est
mesurée au montage, au redimensionnement et après `document.fonts.ready` — les
métriques changent quand la police se substitue, et une durée figée en CSS
donnerait une vitesse différente selon que la police de secours est encore
affichée.

Vitesse relevée : 84,7 px en 2 s, soit les 42 px/s réglés.

### Curseur contextuel — `ContextCursor.tsx`

Une pastille qui suit le pointeur et annonce l'action sur les zones portant
`data-curseur`. Aujourd'hui : les cartes projet (« Voir », ou « Bientôt » quand
le projet n'a pas encore d'URL).

C'est l'effet le plus facile à rendre nuisible, puisqu'il touche à l'outil de
navigation lui-même. Quatre règles, toutes vérifiées :

1. **Le curseur système n'est jamais masqué globalement**, seulement sur la zone
   survolée. Relevé sur un champ de saisie : `cursor: text`, zéro zone masquée.
2. **Retour au natif quand la souris quitte la fenêtre**, sinon la pastille reste
   collée au dernier point et le site paraît figé.
3. **Rien sans pointeur fin ni en mouvement réduit.** En mobile, la pastille rend
   `display: none`.
4. `aria-hidden` et `pointer-events: none` : décorative, jamais annoncée, jamais
   cliquable.

Relevé : 10 px hors carte → 66 px avec le mot « Voir » sur la carte → retour à
11,3 px en 0,3 s puis 10 px en sortant.

**Un piège de classe à connaître :** la pastille portait `hidden` *et* `grid`.
Les deux posent `display`, et c'est l'ordre dans la feuille compilée qui tranche,
pas l'ordre dans l'attribut. Écrire les deux, c'est tirer à pile ou face. Corrigé
en `hidden lg:grid`.

### Deux fausses alertes, à ne pas rejouer

Deux relevés annonçaient une panne qui n'existait pas :

- Le bandeau mesuré à **0 px/s** — il était simplement **sous le viewport**, donc
  en pause. C'est le comportement voulu, pas un défaut.
- La pastille bloquée à **66 px** au-dessus d'un champ — la lecture tombait juste
  après un défilement, avant que le `pointermove` suivant n'ait eu lieu.

Dans les deux cas la conclusion « c'est cassé » venait du cadrage de la mesure.
Avant de corriger un effet qui ne bouge pas, vérifier qu'il est bien dans le
viewport et qu'un événement de pointeur a réellement été émis.

## Cerveau 3D du hero

`src/lib/brain-core.js` (géométrie et rendu) + `src/components/visual/Brain3D.tsx`
(cycle de vie). Nuage de points et connexions courtes, en canvas 2D. Pas de
librairie 3D : Three.js pour cet objet coûterait plus que tout le reste du site.

**La forme vient d'un profil, pas d'un ellipsoïde.** Le premier essai empilait
deux ellipsoïdes avec des harmoniques douces : ça donnait une sphère de points
avec un fil qui pendait. Ce qui rend la forme lisible, c'est le contour — front
bombé, sommet haut et reculé, occiput qui redescend, plat sous les lobes — plus
des plis d'amplitude suffisante pour se voir. Cervelet et tronc sont des masses
distinctes.

**Il oscille (±0,55 rad), il ne tourne pas.** Une révolution complète présente
le cerveau de face deux fois par tour, où il n'est plus qu'une masse.

**La teinte suit la position dans l'objet (68 %) plus que la profondeur (32 %)**,
sinon tout l'objet porte la même couleur à chaque image et le dégradé ne se voit
jamais.

### Le module est en JavaScript pur, et c'est délibéré

Il sert deux consommateurs : le composant React et le générateur d'aperçu, qui
l'injecte tel quel. Tant qu'il était en TypeScript, l'aperçu devait retirer les
annotations à la volée — **trois erreurs de syntaxe silencieuses** en ont
découlé, chacune produisant une page qui s'affiche et où rien ne bouge :

1. `String.replace` avec une chaîne ne traite que la première occurrence :
   `dansProfil()` était corrigée, `marge()` gardait son annotation.
2. `(e: PointerEvent)` a survécu à un filtre qui ne visait que `: number`.
3. Une expression régulière trop large a cassé autre chose encore.

Le module partagé supprime la transformation. Et le générateur **vérifie la
syntaxe du script produit avant d'écrire le fichier** : mieux vaut un générateur
qui échoue qu'un aperçu publié muet.

### Le piège du rectangle nul

`aim()` reçoit un angle calculé depuis `getBoundingClientRect()`. Quand l'hôte
est masqué — `display: none` sous lg, ou page basculée dans l'aperçu — ce
rectangle fait 0×0 : la division par la largeur donne l'infini, et
`Math.cos(Infinity)` vaut **NaN**. Toute la projection devient NaN, l'indice de
palier aussi, et le tracé plante sur un `Path2D` inexistant. Le garde-fou est
dans `aim()`, une seule fois, plutôt que chez chaque appelant.

## Grille d'onde (fond de site)

`src/components/ui/wave-grid-background.tsx`, montée une seule fois dans
`layout.tsx`. Une grille régulière dont chaque sommet est déplacé par la somme de
trois ondes lentes, plus un renflement gaussien centré sur le curseur.

**C'est le curseur qui allume la grille.** Au repos elle n'est qu'un frémissement
(10 % d'intensité) ; dans le halo de la souris elle monte à pleine valeur. Mesuré :
**×50 d'encre** entre une zone loin du curseur et la même zone sous le curseur.

Deux rayons distincts, et c'est volontaire : `REACH` (260 px) déforme la géométrie,
`GLOW` (420 px) révèle. La bosse doit rester localisée là où la lumière doit
éclairer une zone confortable. La rampe d'opacité est en puissance 1,5, pas
linéaire — c'est elle qui fait « apparaître » la grille au lieu de la faire monter
doucement partout.

Sans pointeur fin (tactile) ou en mouvement réduit, il n'y a pas de curseur pour
révéler quoi que ce soit : la grille reprend une présence uniforme à 55 % plutôt
que de laisser la page nue.

**Le code du composant n'était pas fourni** — seule la démo d'appel l'était.
L'implémentation est donc écrite ici, contre le contrat visible dans cette démo
(`colorBase`, `colorHigh`, `children`), pour qu'une version d'origine puisse s'y
substituer sans toucher au reste.

### Couleurs

La démo utilise `#ffffff` / `#0055ff` : du blanc pur et un bleu électrique, tous
deux hors palette sur un fond bleu nuit. Remplacés par deux tokens :
`--wave-base: #243154` (à peine détaché du fond — la grille ne doit se deviner que
par intermittence) et `--wave-high: #5b8cff`, l'accent primaire du site.

### Tenir derrière toute la page

Trois contraintes découlent du « sur l'intégralité du site » :

1. **`position: fixed`.** Le canvas fait la taille du viewport, pas celle du
   document. Le coût par image ne dépend donc pas de la longueur de la page.

2. **`-z-10`, et surtout pas `z-0`.** Un élément positionné à `z-index: 0` se peint
   *après* le contenu non positionné et recouvrirait toutes les sections. En
   négatif, il passe sous le contenu tout en restant au-dessus du fond de page.

3. **Les sections opaques masquaient tout.** Cinq sections portaient `bg-surface`,
   un aplat plein : la grille n'aurait été visible que dans le hero. Elles passent
   sur `.surface-veil` (`color-mix`, 88 % de `--color-surface`). Les cartes et les
   listes, elles, gardent un fond plein — c'est là que se lit le texte dense.

### Coût par image

Une grille de 1 400 sommets, c'est ~2 800 segments. Un `stroke()` par segment
mettait la page à genoux. Les segments sont donc rangés dans dix paliers de couleur
et tracés en dix `Path2D`, soit **10 appels de tracé par image** au lieu de 2 800.
`devicePixelRatio` est plafonné à 1,5. Les trois `Float32Array` de sommets sont
alloués au redimensionnement et non dans la boucle — soixante allocations par
seconde, c'était de la pression sur le ramasse-miettes pour rien.

Mesuré ici : **60 images/s** halo éteint, **37** halo allumé. Le temps passé dans
`stroke()` est négligeable (1 à 2 ms par seconde) : le coût est dans le remplissage
des pixels semi-transparents, pas dans le JavaScript. Alléger les traits (cellule
plus large, opacité et épaisseur réduites) n'a rien changé à la cadence et a coûté
un tiers de l'intensité — l'essai a été annulé.

**Réserve sur ces chiffres :** la mesure tourne dans un Chromium sans accélération
matérielle (rendu logiciel, `devicePixelRatio` à 1). Sur une machine avec GPU, le
remplissage est composité autrement ; ces valeurs sont un plancher, pas une
prévision.

La boucle s'arrête quand l'onglet passe en arrière-plan (`visibilitychange`) — un
fond animé qui continue de tourner dans un onglet caché, c'est de la batterie
dépensée pour personne.

### Contraste

Méthode : masquer le texte, photographier son rectangle — ce qui reste est le fond
composité, grille comprise — et retenir le pixel **le plus clair**, pas une moyenne.
Une moyenne noierait justement le cas qui pose problème : une crête passant sous une
lettre.

Le cas à tester n'est plus « du texte au-dessus de la grille » mais **du texte
avec le curseur posé dessus**, halo allumé en dessous. C'est la conséquence directe
de la révélation, et c'est là que ça casse : sans voile, une crête atteint presque
`--wave-high` et fait tomber un eyebrow (`--color-ink-faint`, le texte le plus pâle
du site) à **1,58:1**. Illisible.

D'où `.bg-veil` sur toutes les sections qui n'en avaient pas, en plus de
`.surface-veil`. **Aucune section ne laisse passer la grille à pleine intensité.**
Le pourcentage est tout le compromis : à 86 % le texte tenait largement mais la
grille ne se voyait plus, ce qui vidait l'effet de son sens. À 75 % (et 78 % pour
les surfaces) la grille reste franchement lisible sous le curseur et le pire relevé
est **4,84:1**, curseur posé sur le texte. En dessous, l'eyebrow perd sa conformité.

Douze relevés curseur sur le texte : pire 4,84:1. Quinze relevés curseur au loin :
pire 5,99:1. Aucun sous 4,5:1 dans les deux cas.

À noter : une première série de mesures annonçait des échecs partout. Elles étaient
fausses — la méthode devinait les pixels du texte au lieu de les lire, et tombait sur
des traits de la grille. Corrigée avant toute conclusion.

### Accessibilité

- `prefers-reduced-motion` : une seule image peinte, aucune boucle lancée. Vérifié
  identique entre deux relevés espacés de 1,2 s.
- Le renflement ne s'installe que sur pointeur fin. Au doigt il suivrait le dernier
  appui et resterait figé là.
- `aria-hidden` et `pointer-events: none` sur la couche entière.

## Accessibilité

`prefers-reduced-motion: reduce` est traité globalement dans `globals.css` : animations et
transitions tombent à `0.01ms`. En complément, côté JS :

- le champ d'étoiles ne lance pas sa boucle et rend une image fixe ;
- la constellation affiche ses lignes sans les tracer et ses nœuds sans respiration ;
- les compteurs affichent directement leur valeur finale ;
- le défilement déclenché par un clic sur un nœud passe en `behavior: "auto"` ;
- la bordure lumineuse cesse de tourner et se fige sur un angle choisi — la lueur reste,
  seul le mouvement disparaît ;
- la révélation mot à mot rend le texte tel quel, sans aucun fragment ni masque ;
- la barre de navigation garde ses deux lumières mais sans ressort : les transitions
  tombent à `0.01ms` comme le reste, la position reste juste ;
- le ruban rend une image fixe et ne lance pas sa boucle ;
- **aucune interaction curseur ne s'installe** : ni caméra du ruban, ni inclinaison de
  carte, ni réaction des mots. Les écouteurs ne sont même pas attachés, et rien n'est
  attaché non plus sur pointeur grossier (tactile).

## Test de validation

Retire mentalement tous les effets d'une section. Si elle reste belle, lisible et
équilibrée par la seule typographie et le seul espacement, les effets sont bien un
supplément — et non un pansement.
