import { skills } from "@/content/skills";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";

/** Listes en mono, sans barres ni pourcentages : un niveau chiffré ne veut rien dire. */
export function Skills() {
  return (
    <section id="competences" className="section bg-veil">
      <div className="container-site">
        <SectionHeader eyebrow="Compétences" title="Ce que je sais faire, concrètement." />

        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]
                        border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.title} index={i} className="bg-bg">
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

        {/* Bandeau : les mêmes compétences, en continu. Il ne remplace pas les
            colonnes, il les prolonge — les colonnes se lisent, le bandeau se
            regarde. Contenu identique, donc aucune information n'est réservée
            au seul bandeau. */}
        <Marquee
          items={skills.flatMap((g) => g.items)}
          className="mt-16 border-y border-[var(--line)] py-5"
        />
      </div>
    </section>
  );
}
