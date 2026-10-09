"use client";

import { useEffect, useRef } from "react";

interface MarqueeProps {
  items: readonly string[];
  /** Pixels par seconde. */
  speed?: number;
  className?: string;
}

/**
 * Bandeau défilant, boucle invisible.
 *
 * Le contenu est dupliqué **exactement deux fois** et la piste se translate de
 * la largeur d'UNE copie avant de se recaler. C'est la seule condition pour que
 * la boucle ne se voie pas : à un pixel près, le saut est visible à chaque tour.
 * La largeur est donc mesurée au montage et à chaque redimensionnement, jamais
 * estimée.
 *
 * L'animation est en JavaScript et non en `@keyframes` parce que la durée
 * dépend de la largeur réelle du texte, elle-même dépendante de la police
 * chargée : une durée figée en CSS donnerait une vitesse différente selon que
 * la police de secours est encore affichée ou non.
 */
export function Marquee({ items, speed = 42, className }: MarqueeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const track = trackRef.current;
    if (!host || !track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let x = 0;
    let last: number | null = null;
    let raf = 0;
    let running = false;

    const measure = () => {
      // scrollWidth couvre les deux copies : une copie vaut la moitié.
      width = track.scrollWidth / 2;
    };

    const tick = (t: number) => {
      if (!running) return;
      if (last === null) last = t;
      // Plafonné : après un changement d'onglet, le delta peut valoir plusieurs
      // secondes et la piste sauterait d'un bloc.
      const dt = Math.min(48, t - last);
      last = t;
      x -= (dt / 1000) * speed;
      if (width && x <= -width) x += width;
      track.style.transform = `translateX(${x.toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          last = null;
          raf = requestAnimationFrame(tick);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );

    measure();
    io.observe(host);

    // Les métriques changent quand la police se substitue : on remesure.
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [speed, items]);

  const copie = (cle: string) =>
    items.map((item, i) => (
      <span key={`${cle}-${i}`} className="flex shrink-0 items-center whitespace-nowrap px-5">
        <span aria-hidden className="pr-5 text-[var(--color-primary)] opacity-45">
          /
        </span>
        {item}
      </span>
    ));

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        overflow: "hidden",
        // Les bords s'éteignent : sans ça, les mots se coupent net contre la
        // marge et la boucle se devine.
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      {/* Une seule copie est lue ; la seconde n'existe que pour la boucle. */}
      <div ref={trackRef} className="flex w-max font-mono text-[0.9rem] text-ink-muted">
        {copie("a")}
        <span aria-hidden className="flex">
          {copie("b")}
        </span>
      </div>
    </div>
  );
}
