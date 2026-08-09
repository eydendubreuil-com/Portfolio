"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { stats, type Stat } from "@/content/stats";
import { SectionHeader } from "@/components/ui/Eyebrow";
import { Parallax } from "@/components/ui/Parallax";
import { GlowBorderCard } from "@/components/ui/GlowBorderCard";

/** Compteur joué une seule fois. Valeur finale d'emblée en reduced-motion. */
function Counter({ stat, run }: { stat: Stat; run: boolean }) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? stat.value : 0);
  const done = useRef(false);

  useEffect(() => {
    if (!run || reduced || done.current) return;
    done.current = true;

    const duration = 1100;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutCubic : rapide au début, s'installe doucement
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(stat.value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(stat.value);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduced, stat.value]);

  const display = stat.isDecimal ? value.toFixed(1).replace(".", ",") : Math.round(value);

  return (
    // tracking négatif : en monospace, la virgule occupe une cellule entière
    // et « 4,9 » se lit sinon « 4 , 9 ».
    <span className="font-mono text-[clamp(2.25rem,4vw,3rem)] font-medium leading-none tracking-[-0.1em] text-ink tabular-nums">
      {display}
      {stat.suffix ?? ""}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="statistiques" className="section surface-veil relative overflow-hidden">
      {/* Trois plans derrière les chiffres, à trois amplitudes. Ils ne portent
          que des valeurs déjà affichées dans le bloc — rien n'est ajouté ici
          qui ne soit vérifiable deux centimètres plus bas. */}
      <Parallax
        depths={[12, 28, 48]}
        className="pointer-events-none absolute inset-0 select-none"
      >
        <span
          aria-hidden
          className="absolute right-[4%] top-[8%] font-display text-[26vw] font-black leading-none
                     text-[color-mix(in_srgb,var(--color-primary)_7%,transparent)]"
        >
          7
        </span>
        <span
          aria-hidden
          className="absolute left-[6%] bottom-[10%] font-mono text-[7vw] leading-none
                     text-[color-mix(in_srgb,var(--color-accent)_8%,transparent)]"
        >
          04
        </span>
        <span
          aria-hidden
          className="absolute right-[22%] bottom-[22%] font-mono text-[1.1rem] tracking-[0.3em]
                     text-[color-mix(in_srgb,var(--color-ink)_10%,transparent)]"
        >
          PROJETS
        </span>
      </Parallax>

      <div className="container-site relative">
        <SectionHeader eyebrow="En chiffres" title="Des faits, pas des promesses." />

        {/* Les chiffres sont la preuve du site : la lueur les désigne comme tels. */}
        <GlowBorderCard
          fill
          borderRadius="var(--radius-lg)"
          animationDuration={20}
          borderWidth="0.8em"
          blurAmount="0.7em"
          glowOpacity={0.75}
          surface="var(--color-card)"
        >
          <div
            ref={ref}
            className="grid grid-cols-2 gap-x-8 gap-y-12 p-8 md:grid-cols-3 lg:grid-cols-6 lg:p-12"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <Counter stat={s} run={inView} />
                <p className="mt-3 text-sm text-ink-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </GlowBorderCard>
      </div>
    </section>
  );
}
