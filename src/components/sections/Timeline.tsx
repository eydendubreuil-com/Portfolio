"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { timeline } from "@/content/timeline";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Eyebrow";

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
    <section id="parcours" className="section surface-veil">
      <div className="container-site">
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
