import { skills } from "@/content/skills";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Eyebrow";

/** Listes en mono, sans barres ni pourcentages : un niveau chiffré ne veut rien dire. */
export function Skills() {
  return (
    <section id="competences" className="section bg-surface">
      <div className="container-site">
        <SectionHeader eyebrow="Compétences" title="Ce que je sais faire, concrètement." />

        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]
                        border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.title} index={i} className="bg-surface">
              <div className="h-full p-8">
                <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint">
                  {group.title}
                </h3>
                <ul className="mt-6 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
