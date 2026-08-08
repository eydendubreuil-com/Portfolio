"use client";

import type { ElementType } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export type DivideBy = "word" | "character";

export interface TextAnimationProps {
  /** Texte brut. Pas de JSX imbriqué : le composant doit pouvoir le découper. */
  children: string;
  divideBy?: DivideBy;
  /** Délai avant le début de la révélation, en secondes. */
  delay?: number;
  /** Décalage entre deux unités. Resserré automatiquement sur les textes longs. */
  stagger?: number;
  /**
   * Plafond du décalage cumulé, en secondes.
   *
   * Sans lui, un pas fixe rend l'effet inutilisable dès que le texte s'allonge :
   * une réponse de 200 mots à 0,2 s le mot mettrait quarante secondes à
   * s'afficher. Le pas réel vaut `min(stagger, maxStaggerTotal / nb d'unités)`.
   */
  maxStaggerTotal?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const item: Variants = {
  hidden: { y: "115%" },
  visible: { y: 0, transition: { duration: 0.55, ease: EASE } },
};

/**
 * Révèle un texte unité par unité, chacune montant depuis sa propre ligne.
 *
 * **Le déclenchement est porté par le conteneur, jamais par les mots.** Chaque
 * mot vit dans un masque `overflow: hidden` et démarre décalé vers le bas :
 * il est donc hors du rectangle d'intersection de son propre parent. Un
 * `whileInView` posé sur le mot ne se déclenche jamais — l'élément se cache
 * lui-même de l'observateur. Les variants remontent l'observation sur le
 * conteneur, qui n'est pas clippé, et n'installent qu'un seul observateur
 * au lieu d'un par mot.
 *
 * Accessibilité : le texte complet est rendu une fois en `sr-only`, et les
 * fragments animés sont `aria-hidden`. Sans ça, un lecteur d'écran énoncerait
 * le texte mot par mot, avec une pause entre chaque.
 */
export default function TextAnimation({
  children,
  divideBy = "word",
  delay = 0,
  stagger = 0.045,
  maxStaggerTotal = 1.1,
  className,
  as: Tag = "span",
  once = true,
}: TextAnimationProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  // La capture garde les séparateurs, donc les espaces d'origine sont préservés.
  const units =
    divideBy === "word" ? children.split(/(\s+)/) : Array.from(children);

  const animatedCount = units.filter((u) => u.trim() !== "").length;
  const step = Math.min(stagger, maxStaggerTotal / Math.max(animatedCount, 1));

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: step, delayChildren: delay } },
  };

  return (
    <Tag className={className}>
      <span className="sr-only">{children}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-10%" }}
        variants={container}
      >
        {units.map((unit, i) =>
          unit.trim() === "" ? (
            unit
          ) : (
            <motion.span
              key={i}
              /* Masque. Composant motion et non span nu : les variants ne se
                 propagent qu'à travers des composants motion, et c'est lui
                 l'enfant direct que `staggerChildren` cadence.

                 Le padding rend sa place à ce que la coupe mangerait : en bas
                 les jambages (g, j, p, y), en haut les diacritiques des
                 capitales — sans lui, « À PROPOS » s'affiche « A PROPOS ».
                 Les marges négatives annulent l'effet sur la mise en page. */
              className="inline-block overflow-hidden pt-[0.2em] pb-[0.14em] align-bottom -mt-[0.2em] -mb-[0.14em]"
            >
              <motion.span className="inline-block" variants={item}>
                {unit}
              </motion.span>
            </motion.span>
          ),
        )}
      </motion.span>
    </Tag>
  );
}

/** Variante pratique pour les titres : mot à mot, pas un peu plus marqué. */
export function StaggerHeading({
  children,
  className,
  as = "h2",
  delay = 0,
}: {
  children: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  return (
    <TextAnimation
      as={as}
      divideBy="word"
      stagger={0.07}
      maxStaggerTotal={0.9}
      delay={delay}
      className={cn(className)}
    >
      {children}
    </TextAnimation>
  );
}
