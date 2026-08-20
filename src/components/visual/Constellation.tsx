"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { projects } from "@/content/projects";

/**
 * L'unique pièce spectaculaire du site.
 *
 * Chaque projet ayant une position `node` est un point lumineux à son accent,
 * relié aux autres par des lignes fines. Les projets en ligne sont bien
 * visibles, les autres restent discrets.
 *
 * Survol : le nom apparaît et les lignes du nœud s'illuminent.
 * Clic : défilement doux vers la carte du projet.
 */

const nodes = projects.filter((p) => p.node);

// Réseau volontairement incomplet : un maillage total ferait un graphe illisible.
const LINKS: [string, string][] = [
  ["synthesia", "ecoleaf"],
  ["synthesia", "mindset-business-lab"],
  ["ecoleaf", "cosmos"],
  ["mindset-business-lab", "cosmos"],
  ["synthesia", "pawvolt"],
  ["cosmos", "pawvolt"],
];

export function Constellation() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const byslug = Object.fromEntries(nodes.map((n) => [n.slug, n]));

  const go = (slug: string) => {
    document
      .getElementById(`projet-${slug}`)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        {LINKS.map(([a, b], i) => {
          const na = byslug[a];
          const nb = byslug[b];
          if (!na?.node || !nb?.node) return null;
          const lit = active === a || active === b;
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={na.node.x}
              y1={na.node.y}
              x2={nb.node.x}
              y2={nb.node.y}
              stroke="url(#constellation-grad)"
              strokeWidth={lit ? 1 : 0.6}
              vectorEffect="non-scaling-stroke"
              initial={reduced ? { opacity: 0.28 } : { pathLength: 0, opacity: 0 }}
              animate={
                reduced
                  ? { opacity: lit ? 0.85 : 0.28 }
                  : { pathLength: 1, opacity: lit ? 0.85 : 0.28 }
              }
              transition={{
                pathLength: { duration: 0.7, delay: 0.75 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25 },
              }}
            />
          );
        })}
        <defs>
          <linearGradient id="constellation-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5B8CFF" />
            <stop offset="52%" stopColor="#6E56CF" />
            <stop offset="100%" stopColor="#2ED3F6" />
          </linearGradient>
        </defs>
      </svg>

      {nodes.map((p, i) => {
        const isLive = p.status === "live";
        const size = isLive ? 12 : 8;
        return (
          <motion.button
            key={p.slug}
            type="button"
            onClick={() => go(p.slug)}
            onMouseEnter={() => setActive(p.slug)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(p.slug)}
            onBlur={() => setActive(null)}
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: reduced ? 0 : 0.45 + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ left: `${p.node!.x}%`, top: `${p.node!.y}%` }}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2
                       cursor-pointer rounded-full p-3"
            aria-label={`Aller au projet ${p.name}`}
          >
            <span
              aria-hidden
              className={`block rounded-full ${reduced ? "" : "anim-breathe"}`}
              style={{
                width: size,
                height: size,
                background: p.accent,
                opacity: isLive ? 1 : 0.55,
                boxShadow: `0 0 ${isLive ? 24 : 12}px ${isLive ? 3 : 1}px ${p.accent}66`,
                animationDelay: `${i * 1.3}s`,
              }}
            />
            <span
              aria-hidden
              className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2
                          whitespace-nowrap font-mono text-[0.7rem] tracking-wide
                          transition-opacity duration-200
                          ${active === p.slug ? "opacity-100" : "opacity-0"}`}
              style={{ color: p.accent }}
            >
              {p.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
