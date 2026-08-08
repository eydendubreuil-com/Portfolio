"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { stats, type Stat } from "@/content/stats";
import { SectionHeader } from "@/components/ui/Eyebrow";

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
    <span className="font-mono text-[clamp(2.25rem,4vw,3rem)] font-medium leading-none tracking-[-0.05em] text-ink tabular-nums">
      {display}
      {stat.suffix ?? ""}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="statistiques" className="section bg-surface">
      <div className="container-site">
        <SectionHeader eyebrow="En chiffres" title="Des faits, pas des promesses." />

        <div
          ref={ref}
          className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <Counter stat={s} run={inView} />
              <p className="mt-3 text-sm text-ink-faint">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
