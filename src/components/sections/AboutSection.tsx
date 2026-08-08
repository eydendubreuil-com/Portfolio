import type { AboutSection as AboutSectionData } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Une question = une section. La citation en exergue est un extrait littéral
 * de la réponse : elle donne un point d'entrée sans rien reformuler.
 */
export function AboutSection({
  data,
  index,
  surface,
}: {
  data: AboutSectionData;
  index: number;
  surface?: boolean;
}) {
  return (
    <section id={data.id} className={`section ${surface ? "bg-surface" : ""}`}>
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-4">
                {String(index + 1).padStart(2, "0")} — {data.eyebrow}
              </p>
            </Reveal>
            <Reveal index={1}>
              <h2 className="text-[length:var(--fs-h2)]">{data.question}</h2>
            </Reveal>
            <Reveal index={2}>
              <blockquote className="mt-8 border-l-2 border-primary/50 pl-5">
                <p className="font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                  {data.pullQuote}
                </p>
              </blockquote>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal index={3}>
              <p className="measure text-[length:var(--fs-lead)] leading-[1.7] text-ink-muted">
                {data.answer}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
