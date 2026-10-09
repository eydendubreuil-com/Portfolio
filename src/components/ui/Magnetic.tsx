"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  /** Rayon d'attraction en pixels. Au-delà, l'élément reprend sa place. */
  reach?: number;
  /** Déplacement maximal de l'enveloppe, en pixels. */
  max?: number;
  className?: string;
}

/**
 * Enveloppe magnétique : l'élément se déplace vers le curseur qui l'approche.
 *
 * C'est la seule interaction du site qui agit directement sur le taux de clic —
 * la cible devient littéralement plus facile à atteindre. D'où deux garde-fous :
 *
 * 1. **Le déplacement est plafonné à `max` (12 px par défaut).** Au-delà, la
 *    cible fuit le curseur au lieu de l'attirer, et le clic devient plus
 *    difficile. L'effet s'inverse.
 * 2. **Le contenu glisse plus que l'enveloppe** (facteur 0,35). C'est ce
 *    décalage qui se lit comme une attraction ; sans lui, on voit juste une
 *    boîte qui bouge.
 *
 * Rien ne s'installe sans pointeur fin ni en mouvement réduit : au doigt il n'y
 * a pas de survol, l'élément resterait figé de travers après le dernier appui.
 */
export function Magnetic({ children, reach = 170, max = 12, className }: MagneticProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const inner = innerRef.current;
    if (!host || !inner) return;

    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist > reach) {
        tx = 0;
        ty = 0;
      } else {
        const force = 1 - dist / reach;
        tx = Math.max(-max, Math.min(max, dx * 0.32 * force));
        ty = Math.max(-max, Math.min(max, dy * 0.32 * force));
      }
      start();
    };

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      host.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      inner.style.transform = `translate(${(cx * 0.35).toFixed(2)}px, ${(cy * 0.35).toFixed(2)}px)`;
      // On coupe la boucle une fois le repos atteint : un rAF qui tourne en
      // permanence par bouton, sur quatre boutons, c'est du budget pour rien.
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05 && Math.abs(tx) < 0.05) {
        running = false;
        host.style.transform = "";
        inner.style.transform = "";
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reach, max]);

  return (
    <span ref={hostRef} className={className} style={{ display: "inline-block", willChange: "transform" }}>
      <span ref={innerRef} style={{ display: "inline-block", willChange: "transform" }}>
        {children}
      </span>
    </span>
  );
}
