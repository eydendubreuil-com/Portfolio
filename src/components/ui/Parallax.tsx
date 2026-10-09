"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ParallaxProps {
  /** Amplitude en pixels, du plan le plus lointain au plus proche. */
  depths?: number[];
  children: ReactNode[];
  className?: string;
}

/**
 * Profondeur par différence de vitesse, pas par 3D.
 *
 * Chaque enfant est un plan qui répond au pointeur avec sa propre amplitude.
 * Aucune perspective n'est calculée : le cerveau lit l'écart de vitesse entre
 * les plans comme de la distance. C'est ce qui rend l'effet quasi gratuit —
 * seules des `translate` sont animées, donc tout reste sur le compositeur.
 *
 * Piloté par le **pointeur** et non par le défilement : une parallaxe liée au
 * scroll désolidarise le contenu du geste de l'utilisateur et provoque du mal
 * des transports. Rien ne s'installe non plus sans pointeur fin ni en mouvement
 * réduit.
 */
export function Parallax({ depths = [10, 26, 46], children, className }: ParallaxProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

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
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      start();
    };

    const tick = () => {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      layersRef.current.forEach((el, i) => {
        if (!el) return;
        const d = depths[i] ?? depths[depths.length - 1];
        // Amplitude verticale volontairement réduite : à parts égales, le
        // décalage vertical fait « flotter » le bloc au lieu de le creuser.
        el.style.transform = `translate(${(-cx * d).toFixed(2)}px, ${(-cy * d * 0.5).toFixed(2)}px)`;
      });
      if (Math.abs(tx - cx) < 0.001 && Math.abs(ty - cy) < 0.001) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (!visible) {
          tx = 0;
          ty = 0;
          start();
        }
      },
      { threshold: 0 },
    );
    io.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [depths]);

  return (
    /* Aucun `position` imposé ici : l'appelant place l'hôte lui-même.
       Un `position: relative` en ligne écrasait le `absolute` passé en classe,
       `inset-0` cessait de s'appliquer, et l'hôte tombait à une hauteur de 0 —
       un élément de hauteur nulle n'intersecte jamais rien, donc
       l'IntersectionObserver ne le signalait jamais visible et le pointeur
       était ignoré. L'effet était monté, câblé, et parfaitement immobile. */
    <div ref={hostRef} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            layersRef.current[i] = el;
          }}
          style={{ position: "absolute", inset: 0, willChange: "transform" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
