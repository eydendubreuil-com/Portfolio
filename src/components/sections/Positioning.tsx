import { positioning } from "@/content/positioning";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Eyebrow";

export function Positioning() {
  return (
    <section id="positionnement" className="section bg-surface">
      <div className="container-site">
        <SectionHeader eyebrow={positioning.eyebrow} title={positioning.title}>
          {positioning.lead}
        </SectionHeader>

        {/* Grille de filets : la séparation vient des lignes, pas des ombres. */}
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]
                        border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {positioning.pillars.map((p, i) => (
            <Reveal key={p.label} index={i} className="bg-surface">
              <article className="h-full p-8 lg:p-10">
                <p className="eyebrow">{p.label}</p>
                <h3 className="mt-4 text-[length:var(--fs-h3)] leading-snug">{p.title}</h3>
                <p className="mt-4 text-ink-muted">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
