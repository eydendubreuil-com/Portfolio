"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { timeline } from "@/content/timeline";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Eyebrow";
import { TwistingRibbon } from "@/components/ui/twisting-ribbon";

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);

  // Le segment en dégradé progresse au fil du défilement de la liste.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section id="parcours" className="section surface-veil relative overflow-hidden">
      {/* Le ruban est ici, pas dans le hero : un ruban qui serpente et se
          vrille, derrière une frise, dit la même chose que la section. Il
          n'occupe que la moitié droite — la liste, elle, est à gauche. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block"
      >
        <TwistingRibbon
          segments={400}
          waveSpeed={0.018}
          waveAmplitude={1}
          twistCycles={6}
          opacity={0.4}
          className="block h-full w-full blur-[2px]"
        />
        {/* Fondus haut/bas et vers la gauche : sans eux le bandeau se coupe net
            aux bords de la section et vient buter sur le texte. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)] via-transparent to-[var(--color-surface)]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-surface) 0%," +
              "color-mix(in srgb, var(--color-surface) 55%, transparent) 30%, transparent 60%)",
          }}
        />
      </div>

      <div className="container-site relative">
        <SectionHeader eyebrow="Parcours" title="Comment j'en suis arrivé là." />

        <ol ref={ref} className="relative pl-8">
          {/* Rail complet, très discret */}
          <span
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px"
            style={{ background: "var(--line)" }}
          />
          {/* Segment parcouru, en dégradé signature */}
          <motion.span
            aria-hidden
            className="absolute left-[5px] top-2 w-px origin-top"
            style={{
              bottom: 8,
              background: "var(--grad-signature)",
              scaleY: progress,
            }}
          />

          {timeline.map((entry) => (
            <li key={entry.title} className="relative pb-12 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-8 top-1.5 block h-[11px] w-[11px] rounded-full"
                style={
                  entry.upcoming
                    ? {
                        border: "1px solid var(--line-strong)",
                        background: "var(--color-bg)",
                      }
                    : {
                        background: "var(--color-primary)",
                        boxShadow: "0 0 12px rgba(91,140,255,0.5)",
                      }
                }
              />
              <Reveal>
                <p className="font-mono text-[0.72rem] tracking-[0.12em] text-ink-faint">
                  {entry.year}
                </p>
                <h3 className="mt-1.5 text-[length:var(--fs-h3)]">{entry.title}</h3>
                <p className="measure mt-2 text-ink-muted">{entry.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
