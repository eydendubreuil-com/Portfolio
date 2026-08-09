import type { AboutSection as AboutSectionData } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";
import TextAnimation from "@/components/ui/staggerText";

/**
 * Une question = une section. La citation en exergue est un extrait littéral
 * de la réponse : elle donne un point d'entrée sans rien reformuler.
 *
 * Toute la section est révélée mot à mot. Le pas décroît du titre vers le
 * corps — un pas de titre appliqué à 150 mots donnerait une lecture au
 * ralenti, et le composant plafonne de toute façon le décalage cumulé.
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
    <section id={data.id} className={`section ${surface ? "surface-veil" : ""}`}>
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <TextAnimation
                as="p"
                className="eyebrow mb-4"
                divideBy="word"
                stagger={0.06}
                interactive
                radius={110}
              >
                {`${String(index + 1).padStart(2, "0")} — ${data.eyebrow}`}
              </TextAnimation>
            </Reveal>

            {/* Le titre : c'est ici que l'effet doit se voir. */}
            <TextAnimation
              as="h2"
              className="text-[length:var(--fs-h2)]"
              divideBy="word"
              stagger={0.08}
              maxStaggerTotal={0.9}
              delay={0.08}
              interactive
            >
              {data.question}
            </TextAnimation>

            <blockquote className="mt-8 border-l-2 border-primary/50 pl-5">
              <TextAnimation
                as="p"
                className="font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-ink"
                divideBy="word"
                stagger={0.035}
                maxStaggerTotal={0.8}
                delay={0.15}
                interactive
                radius={140}
              >
                {data.pullQuote}
              </TextAnimation>
            </blockquote>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <TextAnimation
              as="p"
              className="measure text-[length:var(--fs-lead)] leading-[1.7] text-ink-muted"
              divideBy="word"
              stagger={0.012}
              maxStaggerTotal={1.2}
            >
              {data.answer}
            </TextAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
