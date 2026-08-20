"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Props du composant GlowBorderCard.
 */
export interface GlowBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Largeur de la carte. `undefined` => la carte suit son conteneur. */
  width?: string;
  /** Hauteur explicite. Sans elle, `aspectRatio` s'applique. */
  height?: string;
  /** Ratio, utilisé seulement si ni `height` ni `fill` ne sont fournis. */
  aspectRatio?: string;
  /** Laisse le contenu dicter la hauteur : le bon mode pour un bloc de texte. */
  fill?: boolean;
  borderRadius?: string;
  /** Durée d'un tour complet, en secondes. */
  animationDuration?: number;
  /** Jusqu'à 10 couleurs. Au-delà, les suivantes sont ignorées. */
  gradientColors?: string[];
  /** Épaisseur de la couronne, c'est-à-dire de combien la lueur déborde. */
  borderWidth?: string;
  blurAmount?: string;
  /** Débordement explicite (négatif). Par défaut : `-borderWidth`. */
  inset?: string;
  colorPreset?: ColorPreset;
  /**
   * Opacité de la couronne. À 1, le dégradé flouté vire au blanc et écrase la
   * teinte ; en dessous de ~0,6 il se lit comme une nuance colorée.
   */
  glowOpacity?: number;
  /** Amplitude d'inclinaison 3D sous le curseur, en degrés. 0 pour désactiver. */
  tilt?: number;
  paused?: boolean;
  /** Couleur de la surface interne, qui masque le centre du dégradé. */
  surface?: string;
}

export type ColorPreset = "signature" | "nature" | "ocean" | "sunset" | "aurora";

const colorPresets: Record<ColorPreset, string[]> = {
  /* Dix teintes saturées de luminance voisine, sans creux sombre.
     Le flou moyenne les stops adjacents : alterner clair et foncé produit du
     gris, et des teintes trop pâles produisent du blanc. En restant sur la
     plage bleu → violet → cyan à saturation constante, la moyenne reste
     colorée quel que soit l'angle. */
  signature: [
    "#3D6BFF",
    "#4A5FEA",
    "#5B4FD6",
    "#5458E2",
    "#3F7BF0",
    "#2E9BEE",
    "#1FB6E8",
    "#2E9BEE",
    "#4A6BE0",
    "#5B4FD6",
  ],
  nature: ["#669900", "#88bb22", "#99cc33", "#aaddaa", "#ccee66", "#006699", "#228888", "#3399cc", "#55aacc", "#669900"],
  ocean: ["#006699", "#1177aa", "#2288bb", "#3399cc", "#44aadd", "#55bbee", "#66ccff", "#44bbee", "#2299cc", "#006699"],
  sunset: ["#ff6600", "#ff7711", "#ff8822", "#ff9900", "#ffaa22", "#ffbb44", "#ffcc00", "#ff9933", "#ff7722", "#ff6600"],
  aurora: ["#00ff87", "#22ffaa", "#44ffcc", "#60efff", "#88ddff", "#bb99ff", "#dd77ee", "#ff68f0", "#ff55cc", "#00ff87"],
};

/**
 * Carte à bordure lumineuse animée, en CSS pur.
 *
 * Un dégradé conique tourne derrière la carte ; la surface interne, opaque,
 * masque son centre. Il ne reste donc que la couronne, adoucie au flou — la
 * lueur « aurore » autour des bords.
 *
 * L'animation passe par `@property --glow-angle` (déclaré dans
 * `src/styles/animations.css`) : c'est ce qui rend l'angle interpolable.
 * Sans lui, l'animation saute au lieu de tourner.
 */
export const GlowBorderCard = React.forwardRef<HTMLDivElement, GlowBorderCardProps>(
  (
    {
      children,
      className,
      width,
      height,
      aspectRatio = "1",
      fill = false,
      borderRadius = "var(--radius-xl)",
      animationDuration = 8,
      gradientColors,
      borderWidth = "1.25em",
      blurAmount = "1.25em",
      inset,
      colorPreset = "signature",
      glowOpacity = 0.55,
      tilt = 7,
      paused = false,
      surface = "var(--color-surface)",
      style,
      ...props
    },
    ref,
  ) => {
    const colors = gradientColors?.length ? gradientColors : colorPresets[colorPreset];

    // Un dégradé conique flouté qui tourne coûte du compositing en continu.
    // Avec plusieurs cartes sur la page, on ne l'anime que dans le viewport.
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [offscreen, setOffscreen] = useState(false);

    useEffect(() => {
      const el = wrapperRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => setOffscreen(!entry.isIntersecting),
        { rootMargin: "120px" },
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);

    /* Inclinaison 3D pilotée à la souris.
       Écrite en styles directs plutôt qu'en state React : un setState par
       mousemove re-rendrait l'arbre à 60 Hz. Ici on n'écrit que deux custom
       properties, et le compositeur fait le reste. */
    useEffect(() => {
      const el = wrapperRef.current;
      if (!el || !tilt) return;

      const fine = window.matchMedia("(pointer: fine)");
      const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (!fine.matches || noMotion.matches) return;

      let raf = 0;
      let tX = 0;
      let tY = 0;
      let curX = 0;
      let curY = 0;
      let live = false;

      const apply = () => {
        curX += (tX - curX) * 0.12;
        curY += (tY - curY) * 0.12;
        el.style.setProperty("--tilt-x", `${curX.toFixed(3)}deg`);
        el.style.setProperty("--tilt-y", `${curY.toFixed(3)}deg`);
        // La lueur suit : l'angle du dégradé conique s'aligne sur le curseur,
        // ce qui la fait lire comme une source de lumière et non comme un décor.
        el.style.setProperty("--glow-offset", `${(curY * 6).toFixed(1)}deg`);
        if (Math.abs(tX - curX) > 0.01 || Math.abs(tY - curY) > 0.01) {
          raf = requestAnimationFrame(apply);
        } else {
          live = false;
        }
      };

      const kick = () => {
        if (live) return;
        live = true;
        raf = requestAnimationFrame(apply);
      };

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        // Inversé sur X : pousser le curseur vers le haut doit incliner le
        // haut de la carte vers l'arrière, pas vers l'avant.
        tX = -ny * tilt * 2;
        tY = nx * tilt * 2;
        kick();
      };

      const onLeave = () => {
        tX = 0;
        tY = 0;
        kick();
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        cancelAnimationFrame(raf);
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    }, [tilt]);

    // Le dégradé remplit toute la boîte ; c'est le débordement hors de la carte
    // qui forme la couronne visible. D'où inset = -borderWidth par défaut.
    const resolvedInset = inset ?? `calc(-1 * ${borderWidth})`;

    const colorVars: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      colorVars[`--glow-color-${i + 1}`] = colors[i % colors.length];
    }

    return (
      <div
        ref={(node) => {
          wrapperRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("relative isolate", className)}
        style={
          {
            // La perspective vit sur le wrapper ; sans elle, rotateX/rotateY
            // produisent un simple cisaillement plat.
            perspective: "1200px",
            transformStyle: "preserve-3d",
            width,
            height: fill ? undefined : height,
            aspectRatio: fill || height ? undefined : aspectRatio,
            borderRadius,
            "--glow-animation-duration": `${animationDuration}s`,
            ...colorVars,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* La couronne lumineuse. aria-hidden : purement décorative. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -z-10 rounded-[inherit]",
            "glow-conic",
          )}
          style={{
            inset: resolvedInset,
            // La couronne s'incline un peu plus que la carte : l'écart de
            // parallaxe entre les deux plans est ce qui donne le relief.
            transform:
              "rotateX(calc(var(--tilt-x, 0deg) * 1.35)) rotateY(calc(var(--tilt-y, 0deg) * 1.35)) translateZ(-40px)",
            // En style inline, pas en classe utilitaire : `.glow-conic` vit hors
            // @layer, et son raccourci `animation` (qui remet play-state à
            // `running`) l'emporterait sur une utilitaire Tailwind, elle layered.
            animationPlayState: paused || offscreen ? "paused" : "running",
            opacity: glowOpacity,
            filter: `blur(${blurAmount})`,
            // Indispensable : le preflight Tailwind pose `border: 0 solid` sur
            // tout élément. Une border-width sans couleur explicite hérite donc
            // de currentColor (#F4F6FB) et dessine un cadre blanc épais qui
            // masque complètement le dégradé.
            border: 0,
          }}
        />

        {/* Surface interne opaque : c'est elle qui masque le centre du dégradé
            et ne laisse voir que la couronne. */}
        <div
          className="relative z-10 h-full w-full overflow-hidden rounded-[inherit] border border-[var(--line)] [transition:transform_120ms_linear]"
          style={{
            background: surface,
            transform:
              "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateZ(0)",
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);

GlowBorderCard.displayName = "GlowBorderCard";

export default GlowBorderCard;
