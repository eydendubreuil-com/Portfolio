"use client";

import { useEffect, useRef } from "react";

/**
 * Barre de progression de lecture, 2 px, à l'accent du projet.
 *
 * Pilotée par `scaleX` et non par `width` : une largeur animée déclenche une
 * mise en page à chaque image, une transformation reste sur le compositeur.
 */
export function ReadingBar({ accent }: { accent: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const maj = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      // Page plus courte que l'écran : aucune progression à montrer.
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / total));
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    maj();
    window.addEventListener("scroll", maj, { passive: true });
    window.addEventListener("resize", maj);
    return () => {
      window.removeEventListener("scroll", maj);
      window.removeEventListener("resize", maj);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-[var(--nav-height)] z-40 h-[2px] bg-transparent"
    >
      <div
        ref={ref}
        className="h-full origin-left"
        style={{ background: accent, transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
