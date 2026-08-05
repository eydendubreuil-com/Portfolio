# STYLE.md — Bible visuelle du portfolio Eyden

Référence unique pour toute décision de style. Aucune valeur ne s'invente hors de ce
document.

> Récupéré depuis les pièces jointes du README d'origine. Fait autorité sur les couleurs,
> les ombres et les animations. L'implémentation vit dans `src/app/globals.css`.

---

## 1. Palette

Univers « bleu nuit profond » : un fond navy-noir, des surfaces qui montent doucement en
luminosité, trois accents lumineux tenus en laisse.

### Surfaces

| Rôle | Hex | Usage |
|---|---|---|
| Background | `#050816` | Fond global, unique |
| Surface | `#0E1122` | Bandes, zones alternées |
| Card | `#171B31` | Cartes, panneaux, champs |
| Card elevated | `#1E2440` | Carte au survol |
| Line | `rgba(184,194,217,0.10)` | Bordures, filets |
| Line strong | `rgba(184,194,217,0.20)` | Bordures au survol |

### Texte

| Rôle | Hex | Usage |
|---|---|---|
| Ink | `#F4F6FB` | Texte principal. Un blanc très légèrement bleuté plutôt que `#FFFFFF` pur : moins agressif sur fond sombre, plus premium. |
| Ink muted | `#B8C2D9` | Texte secondaire, descriptions |
| Ink faint | `#6C7590` | Labels, légendes, métadonnées |

### Accents

| Rôle | Hex | Usage |
|---|---|---|
| Primary | `#5B8CFF` | Accent principal : liens, focus, CTA, ligne active |
| Secondary | `#6E56CF` | Accent secondaire, milieu de dégradé |
| Accent | `#2ED3F6` | Accent lumineux, points de données, fin de dégradé |

Dégradé signature :

```
linear-gradient(120deg, #5B8CFF 0%, #6E56CF 52%, #2ED3F6 100%)
```

**Règle d'or du dégradé :** il ne remplit jamais une surface de plus de 4px d'épaisseur,
sauf le bouton principal et les nœuds de la constellation.

### Accents par projet

| Projet | Accent |
|---|---|
| Synthesia | `#6D5DFB` |
| EcoLeaf | `#34D399` |
| MindSet & Business Lab | `#C9A227` |
| PawVolt | `#FF7A18` |

### Statuts

| Statut | Hex |
|---|---|
| En ligne | `#34D399` |
| En développement | `#F5A524` |
| À venir | `#6C7590` |

---

## 2. Typographie

| Rôle | Famille | Poids |
|---|---|---|
| Display (titres) | **Satoshi** | 800 titres, 600 sous-titres |
| Corps | **Inter** | 400, 500 |
| Utilitaire (labels, statuts, chiffres) | **JetBrains Mono** | 500 |

- Titres serrés (`letter-spacing` négatif), corps aéré.
- Corps : `line-height` 1.65, largeur max 68 caractères.
- La mono ne sert jamais à du texte courant.
- **Aucun texte en dégradé.** C'est le marqueur numéro un du portfolio amateur.

> Satoshi n'est pas distribué par Google Fonts. Tant que les fichiers ne sont pas déposés
> dans `public/fonts/` avec une règle `@font-face`, Inter assure le rendu des titres.

---

## 3. Espacement et layout

- Conteneur : `max-width: 1400px`, padding latéral `24px` mobile / `80px` desktop.
- Rythme vertical entre sections : `120px` mobile, `180px` desktop.
- Grille 12 colonnes desktop, gouttière 24px.
- Rayons : `sm 10px`, `md 16px`, `lg 22px`, `xl 28px`.

---

## 4. Ombres et lueurs

La profondeur vient de **bordures qui s'éclaircissent** et de **lueurs d'accent très
diffuses**, jamais d'ombres portées dures.

| Token | Valeur |
|---|---|
| `--glow-primary` | `0 0 0 1px rgba(91,140,255,0.20), 0 8px 40px -12px rgba(91,140,255,0.25)` |
| `--ring-focus` | `0 0 0 2px #050816, 0 0 0 4px #5B8CFF` |

Interdits : `box-shadow` noire opaque, néon saturé, `text-shadow` lumineux.

---

## 5. Glassmorphism

- **Verre réservé à 2 éléments** : la barre de navigation collante et la carte de contact.
- Recette : `background: rgba(14,17,34,0.72); backdrop-filter: blur(16px); border: 1px solid var(--line)`.
- Les cartes projets sont des surfaces **opaques**.

---

## 6. Motion

| Token | Valeur |
|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--dur-fast` | `160ms` |
| `--dur-base` | `420ms` |
| `--dur-slow` | `900ms` |

- Révélations au scroll : `opacity 0→1` + `translateY 16px→0`, décalage 60ms, une seule fois.
- Une seule pièce spectaculaire : la constellation du hero.
- `prefers-reduced-motion` respecté partout.

---

## 7. Icônes

Lucide React uniquement. Taille 16–20px, trait 1.75. **Jamais d'emoji** dans l'interface.

---

## 8. Le principe qui prime sur tout le reste

Le vrai risque n'est pas de manquer d'effets, c'est d'en mettre trop. Avant de valider une
section, retire un effet.

Un site qui ressemble à Linear ou Stripe n'a presque pas d'effets visibles — il a un fond
sobre, une typo parfaite, un espacement irréprochable, et **un** moment fort.
