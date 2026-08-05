import { about } from "@content/site.config";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="a-propos" className="section bg-surface">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow mb-5">{about.eyebrow}</p>
            </Reveal>
            <Reveal index={1}>
              <h2 className="text-[length:var(--fs-h2)]">{about.title}</h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="measure space-y-6 text-[length:var(--fs-body-lg)] text-ink-muted">
              {about.paragraphs.map((paragraph, i) => (
                <Reveal key={i} index={i + 2}>
                  <p>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
