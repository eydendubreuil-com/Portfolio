"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Curseur contextuel : une pastille qui n'apparaît QUE sur les zones portant
 * `data-curseur="…"`, pour y annoncer l'action avant le clic.
 *
 * Elle ne suit pas le pointeur en permanence. Une pastille toujours visible
 * double le curseur système sans rien apporter, et se fige en point blanc posé
 * au hasard dès qu'on capture la page. Au repos, sa taille est nulle et elle
 * n'est pas peinte.
 *
 * C'est l'effet le plus facile à rater de la liste, parce qu'il touche à
 * l'outil de navigation lui-même. Quatre règles, toutes tenues ici :
 *
 * 1. **Le curseur système n'est jamais masqué globalement.** Il ne l'est que
 *    sur les zones marquées, via la classe `.curseur-cache` appliquée par le
 *    composant. Un champ de formulaire ou du texte sélectionnable garde son
 *    curseur natif — sinon le site devient inutilisable.
 * 2. **Retour au natif dès que la souris quitte la fenêtre.** Sans ça, la
 *    pastille reste collée au dernier point et le site paraît figé.
 * 3. **Rien ne s'installe sans pointeur fin**, ni en mouvement réduit.
 * 4. **`aria-hidden` et `pointer-events: none`** : la pastille est décorative,
 *    elle ne doit jamais intercepter un clic ni être annoncée.
 */
export function ContextCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const dot = dotRef.current;
    if (!dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let size = 0;
    let cSize = 0;
    let raf = 0;

    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cSize += (size - cSize) * 0.18;
      dot.style.width = `${cSize.toFixed(1)}px`;
      dot.style.height = `${cSize.toFixed(1)}px`;
      // Éteinte tant qu'elle n'est pas ouverte : un reliquat d'un pixel se
      // verrait comme un point posé au hasard, surtout sur une capture.
      dot.style.opacity = Math.min(1, Math.max(0, (cSize - 2) / 12)).toFixed(3);
      dot.style.transform = `translate(${(cx - cSize / 2).toFixed(1)}px, ${(cy - cSize / 2).toFixed(1)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;

      const cible = (e.target as Element | null)?.closest?.("[data-curseur]") as HTMLElement | null;
      if (cible) {
        size = 66;
        setLabel(cible.dataset.curseur ?? null);
        setActive(true);
        cible.classList.add("curseur-cache");
      } else {
        size = 0;
        setActive(false);
        setLabel(null);
        document
          .querySelectorAll(".curseur-cache")
          .forEach((el) => el.classList.remove("curseur-cache"));
      }
    };

    const onLeave = () => {
      setActive(false);
      setLabel(null);
      size = 0;
      document
        .querySelectorAll(".curseur-cache")
        .forEach((el) => el.classList.remove("curseur-cache"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document
        .querySelectorAll(".curseur-cache")
        .forEach((el) => el.classList.remove("curseur-cache"));
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      // `hidden lg:grid` sans `grid` nu : les deux utilitaires posent `display`,
      // et c'est l'ordre dans la feuille compilée qui tranche, pas l'ordre
      // dans l'attribut. Écrire les deux, c'est tirer à pile ou face.
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden place-items-center
                 rounded-full transition-[background-color] duration-200 lg:grid"
      style={{
        background: active ? "var(--color-primary)" : "var(--color-ink)",
        mixBlendMode: active ? "normal" : "difference",
        willChange: "transform",
      }}
    >
      <span
        className="whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.12em]
                   text-bg transition-opacity duration-150"
        style={{ opacity: label ? 1 : 0 }}
      >
        {label}
      </span>
    </div>
  );
}
