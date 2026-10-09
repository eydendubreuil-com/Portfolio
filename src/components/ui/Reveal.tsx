"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * L'effet universel : opacity 0→1 + translateY 16px→0, une seule fois.
 * Décalage de 60ms entre éléments d'une même série via `index`.
 */
export function Reveal({
  children,
  index = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.42,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.06,
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
