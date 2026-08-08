import { about } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";

/** Format « interview » : la question en Satoshi, la réponse en corps de texte. */
export function About() {
  return (
    <section id="a-propos" className="section bg-surface">
      <div className="container-site">
        <Reveal>
          {/* L'eyebrow est le titre de section : h2 réel, stylé en label. */}
          <h2 className="eyebrow mb-5">{about.eyebrow}</h2>
        </Reveal>

        <Reveal index={1}>
          <ul className="mb-16 flex flex-wrap gap-x-6 gap-y-2 lg:mb-24">
            {about.markers.map((m) => (
              <li key={m} className="font-mono text-[0.75rem] tracking-[0.1em] text-ink-faint">
                {m}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="flex flex-col gap-16 lg:gap-24">
          {about.questions.map((q, i) => (
            <Reveal key={q.question} index={i} as="div">
              <article className="grid gap-6 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <p className="eyebrow mb-3">{q.title}</p>
                  <h3 className="text-[length:var(--fs-h2)] leading-[1.1]">{q.question}</h3>
                </div>
                <p className="measure text-ink-muted lg:col-span-7 lg:col-start-6">
                  {q.answer}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
