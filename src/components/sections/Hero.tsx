"use client";

import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/content/site.config";
import { liveProjects } from "@/content/projects";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Brain3D } from "@/components/visual/Brain3D";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Séquence d'ouverture (~1,4 s) : eyebrow → titre → paragraphe → boutons →
 * pastilles. C'est le seul moment de mise en scène du site.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const step = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: reduced ? 0 : delay, ease: EASE },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-[var(--nav-height)]"
    >
      {/* Le cerveau prend la moitié droite, à la place laissée par la
          constellation. Le ruban est au Parcours, les rayons au Positionnement,
          les étoiles à la Vision : le hero ne porte que cette pièce-là, plus la
          grille d'onde qui traverse tout le site.

          Masqué sous lg : un objet en trois dimensions coincé dans 380 px de
          large ne se lit plus, et le texte a besoin de toute la largeur. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block"
      >
        <Brain3D className="h-full w-full" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="container-site relative z-10 py-24">
        <div className="lg:max-w-[54%]">
          <motion.p {...step(0.1)} className="eyebrow">
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...step(0.25)}
            className="mt-8 text-[length:var(--fs-hero)] font-black leading-[0.9]"
          >
            {hero.title}
          </motion.h1>

          <motion.p {...step(0.95)} className="lead measure mt-8">
            {hero.lead}
          </motion.p>

          <motion.div {...step(1.1)} className="mt-12 flex flex-wrap gap-4">
            <Magnetic>
              <ButtonPrimary href={hero.ctaPrimary.href}>
                {hero.ctaPrimary.label}
              </ButtonPrimary>
            </Magnetic>
            <Magnetic>
              <ButtonSecondary href={hero.ctaSecondary.href}>
                {hero.ctaSecondary.label}
              </ButtonSecondary>
            </Magnetic>
          </motion.div>

          {/* Une pastille par projet en ligne, cliquable vers sa carte. */}
          <motion.ul {...step(1.25)} className="mt-12 flex flex-wrap gap-2">
            {liveProjects.map((p) => (
              <li key={p.slug}>
                <a
                  href={`#projet-${p.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)]
                             px-3 py-1.5 font-mono text-[0.7rem] text-ink-muted
                             transition-colors duration-200
                             hover:border-[var(--line-strong)] hover:text-ink"
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }}
                  />
                  {p.name}
                </a>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
