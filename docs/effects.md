# Effets — règles de retenue

> Récupéré depuis les pièces jointes du README d'origine, et ce qui est réellement
> implémenté dans le code.

## Principe

Un effet marquant par section, au maximum. **Un seul effet spectaculaire sur tout le
site** : la constellation du hero. Tous les autres doivent être presque imperceptibles.

## Ce qui est implémenté

| Effet | Règle | Où |
|---|---|---|
| Aurora | Derrière la constellation uniquement, opacité ≤ 0.30, dérive sur 28s | `hero/Constellation.tsx` |
| Champ d'étoiles | ≤ 60 points de 1px, opacité basse, animation coupée hors viewport | `hero/Constellation.tsx` |
| Mouse glow | Halo radial très diffus, hero uniquement, désactivé au tactile | `hero/Hero.tsx` |
| Constellation | Quatre nœuds aux accents projets, traits tracés au montage | `hero/Constellation.tsx` |
| Liseré de carte | 2px à l'accent du projet, au survol seulement | `sections/Projects.tsx` |
| Bordure dégradée | **Une seule** carte mise en avant, jamais les quatre | `sections/Projects.tsx` |
| Scroll reveal | `opacity` + `translateY`, une seule fois, décalage 60ms | `ui/Reveal.tsx` |

## Ce qui a été écarté

- **Boutons magnétiques** : coûteux en attention, rien d'essentiel n'est perdu sans eux.
- **Floating cards** : une grille entière qui flotte désoriente. Non utilisé.
- **Parallax** : jamais sur du texte, ça nuit à la lisibilité. Non utilisé.
- **Zustand, GSAP** : aucun état global ni besoin d'animation avancée sur un site statique.

## Test de validation

Retire mentalement tous les effets d'une section. Si elle reste belle, lisible et
équilibrée par la seule typographie et le seul espacement, les effets sont bien un
supplément — et non un pansement.

## Accessibilité

`prefers-reduced-motion: reduce` est traité globalement dans `globals.css` : toutes les
animations et transitions tombent à `0.01ms`. Le mouse glow et la constellation se
désactivent aussi via `matchMedia` côté JS.
