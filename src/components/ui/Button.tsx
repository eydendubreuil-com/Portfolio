"use client";

import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

const transition = { duration: 0.16, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Principal : fond --ink, texte --bg. Il attire l'œil par le contraste, pas par un effet.
 * Le liseré en dégradé n'apparaît qu'au survol.
 */
export function ButtonPrimary({
  children,
  href,
  ...props
}: { children: ReactNode; href?: string } & ComponentProps<typeof motion.a>) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      transition={transition}
      className="group relative inline-flex h-12 cursor-pointer items-center justify-center
                 rounded-[var(--radius-sm)] bg-ink px-6 text-[0.95rem] font-semibold
                 text-bg transition-shadow duration-200 hover:[box-shadow:var(--glow-primary)]"
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-sm)]
                   opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          padding: 1,
          background: "var(--grad-signature)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </motion.a>
  );
}

/** Secondaire : transparent, bordure --line. */
export function ButtonSecondary({
  children,
  href,
  ...props
}: { children: ReactNode; href?: string } & ComponentProps<"a">) {
  return (
    <a
      href={href}
      className="inline-flex h-12 items-center justify-center rounded-[var(--radius-sm)]
                 border border-[var(--line)] px-6 text-[0.95rem] font-medium text-ink
                 transition-colors duration-200
                 hover:border-[var(--line-strong)] hover:bg-white/[0.03]"
      {...props}
    >
      {children}
    </a>
  );
}
