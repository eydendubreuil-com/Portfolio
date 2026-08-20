"use client";

import { useEffect, useRef, type ElementType } from "react";
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
  /**
   * Réaction au curseur : les mots proches pivotent et avancent vers le lecteur.
   *
   * À réserver aux titres et aux textes courts. Sur un paragraphe de 200 mots il
   * faudrait mesurer 200 positions à chaque `mousemove`, et faire bouger du texte
   * qu'on est en train de lire est une mauvaise idée en soi.
   */
  interactive?: boolean;
  /** Rayon d'influence du curseur, en pixels. */
  radius?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* La révélation est en 3D : le mot bascule autour de son axe horizontal bas
   plutôt que de glisser à plat. `transformPerspective` doit être posé sur
   l'élément qui tourne — une perspective héritée du parent n'aurait pas de
   point de fuite propre et le pivot se lirait comme un simple cisaillement. */
const item: Variants = {
  hidden: { y: "115%", rotateX: -78 },
  visible: {
    y: 0,
    rotateX: 0,
    transition: { duration: 0.62, ease: EASE },
  },
};

/**
 * Révèle un texte unité par unité, chacune basculant depuis sa propre ligne.
 *
 * **Le déclenchement est porté par le conteneur, jamais par les mots.** Chaque
 * mot vit dans un masque `overflow: hidden` et démarre décalé vers le bas : il
 * est donc hors du rectangle d'intersection de son propre parent. Un
 * `whileInView` posé sur le mot ne se déclenche jamais — l'élément se cache
 * lui-même de l'observateur. Les variants remontent l'observation sur le
 * conteneur, non clippé, et n'installent qu'un observateur au lieu d'un par mot.
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
  interactive = false,
  radius = 170,
}: TextAnimationProps) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLSpanElement>(null);
  // Exposé pour que la fin de la révélation puisse déclencher une re-mesure.
  const measureRef = useRef<(() => void) | null>(null);

  /* Suivi du curseur.
     Les transforms sont écrites en style direct : un setState par `mousemove`
     re-rendrait tout l'arbre à 60 Hz pour un effet purement visuel.
     Elles vivent sur un span intérieur dédié, jamais sur celui que Motion
     anime — deux écritures concurrentes sur la même propriété `transform`
     s'annulent l'une l'autre. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || !interactive) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = Array.from(host.querySelectorAll<HTMLElement>("[data-word]"));
    if (!words.length) return;

    let centers: { x: number; y: number }[] = [];
    let raf = 0;
    let mx = -9999;
    let my = -9999;

    /* Positions mesurées une fois, en coordonnées **document** et non viewport.
       Mesurées en viewport, elles se périment à chaque défilement : il faudrait
       re-mesurer sur `scroll`, ce qui force un recalcul de mise en page par mot
       à chaque frame de scroll. En coordonnées document elles restent valides,
       et l'on compare avec `pageX/pageY` du curseur. */
    const measure = () => {
      centers = words.map((w) => {
        const r = w.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 + window.scrollX,
          y: r.top + r.height / 2 + window.scrollY,
        };
      });
    };

    const frame = () => {
      raf = 0;
      for (let i = 0; i < words.length; i++) {
        const c = centers[i];
        if (!c) continue;
        const dx = mx - c.x;
        const dy = my - c.y;
        const d = Math.hypot(dx, dy);
        if (d > radius) {
          if (words[i].style.transform) words[i].style.transform = "";
          continue;
        }
        const f = 1 - d / radius;
        const e = f * f;
        // Amplitude tenue basse : le masque est en overflow hidden, et un mot
        // qui sort trop se ferait couper.
        words[i].style.transform =
          `perspective(420px) translateZ(${(e * 16).toFixed(2)}px)` +
          ` rotateY(${(-(dx / radius) * e * 14).toFixed(2)}deg)` +
          ` rotateX(${((dy / radius) * e * 10).toFixed(2)}deg)`;
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.pageX;
      my = e.pageY;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onLeave = () => {
      mx = -9999;
      my = -9999;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    /* Mesurer au montage ne suffit pas : les mots démarrent décalés de 115 %
       sous leur ligne, donc on enregistrerait leur position de départ. La
       vraie mesure vient de `onAnimationComplete` sur le conteneur, branché
       via cette ref. Le timer n'est qu'un filet si l'animation ne se joue
       jamais (élément révélé hors écran, par exemple). */
    measureRef.current = measure;
    const settle = window.setTimeout(measure, 2600);
    measure();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      measureRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", measure);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [interactive, radius, children]);

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
        ref={hostRef}
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-10%" }}
        variants={container}
        onAnimationComplete={() => measureRef.current?.()}
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
              className="inline-block overflow-hidden pt-[0.24em] pb-[0.16em] align-bottom -mt-[0.24em] -mb-[0.16em]"
            >
              <motion.span
                className="inline-block"
                variants={item}
                style={{ transformPerspective: 620, transformOrigin: "50% 100%" }}
              >
                {/* Span dédié au curseur : Motion écrit sur le parent, ce span
                    est à nous seuls. */}
                <span
                  data-word
                  className="inline-block [transition:transform_180ms_cubic-bezier(0.16,1,0.3,1)]"
                >
                  {unit}
                </span>
              </motion.span>
            </motion.span>
          ),
        )}
      </motion.span>
    </Tag>
  );
}

/** Variante pratique pour les titres : mot à mot, pas plus marqué, interactif. */
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
      interactive
      className={cn(className)}
    >
      {children}
    </TextAnimation>
  );
}
