"use client";

import { useEffect, useRef } from "react";
// Module JavaScript volontairement non typé : il est injecté tel quel dans
// l'aperçu autonome, où toute annotation devrait être retirée à la volée.
// TypeScript le résout via allowJs et infère depuis les JSDoc.
import { createBrain } from "@/lib/brain-core.js";

/**
 * Cerveau en trois dimensions, dessiné en canvas 2D.
 *
 * Ce composant n'est qu'une enveloppe : la géométrie et le rendu vivent dans
 * `src/lib/brain-core.js`, partagé avec le générateur d'aperçu. Ici on ne gère
 * que le cycle de vie — dimensionnement, pointeur, boucle, mise en pause.
 *
 * Pas de librairie 3D : Three.js pour cet objet coûterait plus de kilo-octets
 * que tout le reste du site réuni, pour une forme qui tient dans un profil et
 * une fonction de repli.
 */
export function Brain3D({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const hex = (n: string, d: string): number[] => {
      const s = (styles.getPropertyValue(n).trim() || d).replace("#", "");
      const v =
        s.length === 3
          ? [...s].map((c) => Number.parseInt(c + c, 16))
          : [0, 2, 4].map((i) => Number.parseInt(s.slice(i, i + 2), 16));
      return v.some(Number.isNaN) ? [91, 140, 255] : v;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const brain = createBrain(ctx, {
      // Trois arrêts, comme --grad-signature : violet → bleu → cyan.
      rampe: [
        hex("--color-secondary", "#6e56cf"),
        hex("--color-primary", "#5b8cff"),
        hex("--color-accent", "#2ed3f6"),
      ],
      reduced,
      finePointer,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = host.clientWidth;
      const h = host.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      brain.resize(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      brain.aim(
        ((e.clientX - r.left) / r.width - 0.5) * 1.1,
        ((e.clientY - r.top) / r.height - 0.5) * 0.7,
      );
    };
    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    let raf = 0;
    let running = false;
    const loop = (t: number) => {
      if (!running) return;
      brain.draw(t);
      raf = requestAnimationFrame(loop);
    };

    // Hors écran, la boucle s'arrête : le hero sort vite de la vue au défilement.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running && !reduced) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(host);

    if (reduced) brain.draw(0);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden data-cerveau className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
