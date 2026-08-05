import { stack } from "@content/site.config";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Stack() {
  return (
    <section id="stack" className="section">
      <div className="container-site">
        <SectionHeader eyebrow="Stack" title="Les outils, pas la vitrine.">
          Ce que j&apos;utilise réellement pour construire. Une technologie qui n&apos;a pas
          servi sur un projet ne figure pas ici.
        </SectionHeader>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]
                        border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((group, i) => (
            <Reveal key={group.group} index={i} className="bg-bg">
              <div className="h-full p-8">
                <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint">
                  {group.group}
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
