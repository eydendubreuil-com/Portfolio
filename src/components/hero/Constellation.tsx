"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@content/site.config";
import { projectAccents } from "@/lib/theme";

/**
 * La seule pièce spectaculaire du site (docs/effects.md).
 * Quatre nœuds — un par projet — reliés par des traits qui se tracent au montage.
 * Le champ d'étoiles et l'aurora s'arrêtent quand le hero quitte le viewport.
 */

/* Cantonnés à la moitié droite : la colonne de texte occupe la gauche. */
const NODES = [
  { x: 58, y: 20 },
  { x: 81, y: 12 },
  { x: 90, y: 54 },
  { x: 66, y: 70 },
] as const;

const LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [0, 2],
] as const;

const STAR_COUNT = 52;

type Star = { x: number; y: number; o: number; d: number };

export function Constellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [stars, setStars] = useState<Star[]>([]);

  // Généré côté client uniquement : des positions aléatoires au rendu serveur
  // provoqueraient une divergence d'hydratation.
  useEffect(() => {
    setStars(
      Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        o: 0.15 + Math.random() * 0.35,
        d: Math.random() * 7,
      })),
    );
  }, []);

  // Économie de batterie : on coupe les animations hors écran.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const accents = projects.map((p) => projectAccents[p.slug]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Aurora — opacité tenue basse, sinon l'effet « template IA » apparaît */}
      <div
        className={`absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2
                    opacity-[0.30] blur-[100px] ${visible ? "anim-aurora" : ""}`}
        style={{
          background:
            "radial-gradient(40% 50% at 30% 40%, rgba(91,140,255,0.55) 0%, transparent 70%)," +
            "radial-gradient(35% 45% at 70% 35%, rgba(110,86,207,0.45) 0%, transparent 70%)," +
            "radial-gradient(30% 40% at 60% 70%, rgba(46,211,246,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Champ d'étoiles — 1px, opacité basse, dérive très lente */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className={`absolute h-px w-px rounded-full bg-ink ${
              visible ? "anim-breathe" : ""
            }`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: s.o,
              animationDelay: `${s.d}s`,
            }}
          />
        ))}
      </div>

      {/* Constellation — masquée en dessous de md, où le texte occupe toute la largeur */}
      <div className="absolute inset-0 hidden md:block">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="constellation-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5B8CFF" />
            <stop offset="52%" stopColor="#6E56CF" />
            <stop offset="100%" stopColor="#2ED3F6" />
          </linearGradient>
        </defs>

        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="url(#constellation-line)"
            strokeWidth={0.15}
            opacity={0.5}
            vectorEffect="non-scaling-stroke"
            className="anim-draw"
            style={{ ["--dash" as string]: "120", animationDelay: `${0.3 + i * 0.12}s` }}
          />
        ))}
      </svg>

      {/* Nœuds — un par projet, à son accent */}
      {NODES.map((n, i) => (
        <span
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${
            visible ? "anim-breathe" : ""
          }`}
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: 8,
            height: 8,
            background: accents[i],
            boxShadow: `0 0 20px 2px ${accents[i]}55`,
            animationDelay: `${i * 1.1}s`,
          }}
        />
      ))}
      </div>
    </div>
  );
}
