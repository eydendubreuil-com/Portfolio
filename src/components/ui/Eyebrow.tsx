import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <header className="mb-16 lg:mb-24">
      <Reveal>
        <p className="eyebrow mb-5">{eyebrow}</p>
      </Reveal>
      <Reveal index={1}>
        <h2 id={id} className="max-w-[22ch] text-[length:var(--fs-h2)]">
          {title}
        </h2>
      </Reveal>
      {children ? (
        <Reveal index={2}>
          <div className="lead measure mt-6">{children}</div>
        </Reveal>
      ) : null}
    </header>
  );
}
