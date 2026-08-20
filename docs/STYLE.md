# STYLE.md — Bible visuelle

Référence unique pour toute décision de style. Aucune valeur ne s'invente hors de ce
document. L'implémentation vit dans `src/app/globals.css` (tokens) et
`src/styles/animations.css` (keyframes).

Univers bleu nuit profond, premium, technologique. Références de niveau : Linear, Stripe,
Vercel, Anthropic. Sobre = sérieux.

---

## 1. Couleurs

### Surfaces

| Rôle | Hex |
|---|---|
| Fond | `#0B1224` |
| Surface | `#121B33` |
| Carte | `#1A2544` |
| Carte survol | `#223057` |
| Filet | `rgba(184,194,217,0.10)` |
| Filet fort | `rgba(184,194,217,0.20)` |

> Palette éclaircie : le navy quasi noir d'origine (`#050816`) écrasait tout. Le fond monte
> en luminosité et en bleu, et l'échelle des surfaces suit. Conséquence à ne pas oublier :
> **éclaircir le fond fait baisser le contraste du texte discret**, d'où le relèvement de
> `--color-ink-faint` ci-dessous.

### Texte

| Rôle | Hex |
|---|---|
| Principal | `#F4F6FB` — blanc cassé, pas de `#FFF` pur sauf très gros titre |
| Secondaire | `#B8C2D9` |
| Discret | `#939DB6` — relevé de `#6C7590`, qui tombait à 2,8:1 sur une carte survolée avec le fond éclairci |

### Accents

| Rôle | Hex |
|---|---|
| Primaire | `#5B8CFF` |
| Secondaire | `#6E56CF` |
| Cyan | `#2ED3F6` |

Dégradé signature : `linear-gradient(120deg, #5B8CFF 0%, #6E56CF 52%, #2ED3F6 100%)`.

**Règle d'or :** jamais en aplat sur plus de 4px, sauf bouton principal et nœuds de la
constellation. **Jamais sur du texte.**

### Accent par projet

| Projet | Accent |
|---|---|
| Synthesia | `#6D5DFB` |
| EcoLeaf | `#34D399` |
| MindSet & Business Lab | `#C9A227` |
| PawVolt | `#FF7A18` |
| Cosmos | `#4C6EF5` |
| EydenDesigns | `#EC4899` |
| Auteur & Édition | `#D9A55B` |

### Statuts

| Statut | Hex |
|---|---|
| En ligne | `#34D399` |
| En préparation / En cours | `#F5A524` |
| En pause | `#939DB6` |

---

## 2. Typographie

| Rôle | Famille | Poids |
|---|---|---|
| Titres | **Satoshi** | 800 · 600 pour les sous-titres |
| Corps | **Inter** | 400, 500 · line-height 1.65 · max 68 caractères |
| Labels, statuts, chiffres, technos | **JetBrains Mono** | 500 |

Titres serrés (letter-spacing négatif), corps aéré. Ce contraste porte l'effet premium.
La mono ne sert jamais à du texte courant. **Aucun texte en dégradé.**

Échelle : `--fs-hero` `clamp(3.5rem,9vw,8rem)` · `--fs-h1` `clamp(2.5rem,5vw,4rem)` ·
`--fs-h2` `clamp(1.75rem,3vw,2.5rem)` · `--fs-h3` `1.25rem` ·
`--fs-lead` `clamp(1.125rem,1.6vw,1.375rem)` · `--fs-body` `1.0625rem` · `--fs-label` `0.75rem`.

> **Satoshi n'est pas distribué par Google Fonts.** Tant que les fichiers ne sont pas
> déposés dans `public/fonts/` avec une règle `@font-face`, Inter assure le rendu des titres.

---

## 3. Espacement et layout

Conteneur `max-width: 1400px`, padding latéral 24px mobile / 80px desktop.
Rythme vertical entre sections : 120px mobile, 180px desktop — le vide est le budget
premium, dernier réflexe à sacrifier. Grille 12 colonnes. Rayons 10 / 16 / 22 / 28px.

---

## 4. Motion

| Token | Valeur |
|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| Durées | 160 / 420 / 900 ms |

Révélations au scroll : `opacity 0→1` + `translateY 16px→0`, décalage 60ms, une seule fois.
`prefers-reduced-motion` respecté partout. **Un seul moment de mise en scène** :
l'ouverture du hero.

---

## 5. Verre

`background: rgba(18,27,51,0.76); backdrop-filter: blur(16px)`.
**Deux éléments seulement** : la nav collante et la carte de contact. Les cartes projets
restent opaques.

---

## 6. Le principe qui prime

Ne pas entasser aurora + particules + glow + cartes flottantes : c'est exactement ce qui
fait « site généré ». Un seul moment fort (la constellation), le reste au calme.
**Avant de valider une section : retire un effet.**

---

## 7. Note d'implémentation — la cascade

Le reset (`body`, `h1`–`h4`, `p`, `a`, `ul`) est dans `@layer base`, et les utilitaires de
composition (`.container-site`, `.section`, `.eyebrow`, `.glass`, `.measure`) dans
`@layer components`.

**Ce n'est pas cosmétique.** Hors layer, un sélecteur d'élément comme `a { color: inherit }`
l'emporte sur *toutes* les utilitaires Tailwind, parce que le CSS sans layer gagne toujours
contre le CSS en layer. Symptômes observés quand le reset était hors layer : texte de bouton
invisible (`text-bg` ignoré) et marges `mt-*` sans effet. Ne pas sortir ces blocs des layers.
