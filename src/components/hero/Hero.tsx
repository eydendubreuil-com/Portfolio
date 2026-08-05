"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hero, stats } from "@content/site.config";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/Button";
import { Constellation } from "./Constellation";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Halo radial diffus qui suit le curseur — hero uniquement, désactivé au tactile. */
function useMouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(fine.matches && !reduced.matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [enabled]);

  return { ref, enabled };
}

export function Hero() {
  const { ref, enabled } = useMouseGlow();

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92svh] items-center overflow-hidden pt-[var(--nav-height)]"
    >
      <Constellation />

      {enabled ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, -999px) var(--my, -999px), rgba(91,140,255,0.10), transparent 70%)",
          }}
        />
      ) : null}

      {/* Fondu vers le fond, pour que la constellation ne coupe pas net */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40
                   bg-gradient-to-b from-transparent to-bg"
      />

      <div className="container-site relative z-10 py-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE }}
          className="eyebrow mb-8"
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="text-[length:var(--fs-h1)]">
          {hero.titleLines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.09 }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE, delay: 0.42 }}
          className="measure mt-8 text-[length:var(--fs-body-lg)] text-ink-muted"
        >
          {hero.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: EASE, delay: 0.52 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <ButtonPrimary href={hero.ctaPrimary.href}>
            {hero.ctaPrimary.label}
          </ButtonPrimary>
          <ButtonSecondary href={hero.ctaSecondary.href}>
            {hero.ctaSecondary.label}
          </ButtonSecondary>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.42, ease: EASE, delay: 0.7 }}
          className="mt-24 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-mono text-[2rem] font-medium leading-none text-ink">
                {s.value}
              </dd>
              <p className="mt-3 text-sm text-ink-faint">{s.label}</p>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
