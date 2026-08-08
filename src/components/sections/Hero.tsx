"use client";

import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/content/site.config";
import { liveProjects } from "@/content/projects";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { Starfield } from "@/components/visual/Starfield";
import { Constellation } from "@/components/visual/Constellation";
import { TwistingRibbon } from "@/components/ui/twisting-ribbon";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Séquence d'ouverture (~1,4 s) : starfield → eyebrow → titre → nœuds →
 * lignes → paragraphe → boutons → pastilles. C'est le seul moment de mise
 * en scène du site.
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
      {/* Ruban de fond, en haut. Volontairement flouté et peu opaque : le hero
          porte déjà la constellation, et deux pièces spectaculaires qui se
          disputent l'attention se lisent comme du bruit. Ici c'est une texture,
          pas un sujet. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[46vh] min-h-[320px] max-h-[460px]"
      >
        <TwistingRibbon
          segments={400}
          waveSpeed={0.018}
          waveAmplitude={1}
          twistCycles={6}
          opacity={0.4}
          className="block h-full w-full blur-[2px]"
        />
        {/* Fondu vers le fond : sans lui, le bandeau se coupe net. */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg" />

        {/* Voile côté texte. Mesuré : sans lui l'eyebrow tombe à 4,05:1 sur les
            lobes clairs du ruban, sous le seuil AA. Le ruban reste entier à
            droite, là où il n'y a rien à lire. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-bg) 0%, var(--color-bg) 30%," +
              "color-mix(in srgb, var(--color-bg) 55%, transparent) 52%, transparent 72%)",
          }}
        />
      </div>

      <Starfield />

      {/* La constellation occupe la moitié droite en desktop ; masquée en
          dessous de lg, où le texte prend toute la largeur. */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Constellation />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="container-site relative z-10 py-24">
        <div className="lg:max-w-[52%]">
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
            <ButtonPrimary href={hero.ctaPrimary.href}>
              {hero.ctaPrimary.label}
            </ButtonPrimary>
            <ButtonSecondary href={hero.ctaSecondary.href}>
              {hero.ctaSecondary.label}
            </ButtonSecondary>
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
