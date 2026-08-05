import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-16 lg:mb-24">
      <Reveal>
        <p className="eyebrow mb-5">{eyebrow}</p>
      </Reveal>
      <Reveal index={1}>
        <h2 className="text-[length:var(--fs-h2)] max-w-[20ch]">{title}</h2>
      </Reveal>
      {children ? (
        <Reveal index={2}>
          <div className="measure mt-6 text-[length:var(--fs-body-lg)] text-ink-muted">
            {children}
          </div>
        </Reveal>
      ) : null}
    </header>
  );
}
