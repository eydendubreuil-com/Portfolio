import { vision } from "@/content/site.config";
import { Reveal } from "@/components/ui/Reveal";

/** Aucune décoration : le vide fait le travail. */
export function Vision() {
  const [first, second, third] = vision.sentences;

  return (
    <section id="vision" className="section">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow mb-8">{vision.eyebrow}</p>
        </Reveal>
        <Reveal index={1}>
          {/* Première phrase = titre de section, déjà composée en display. */}
          <h2 className="max-w-[24ch] text-[length:var(--fs-h2)] text-ink-faint">{first}</h2>
        </Reveal>
        <Reveal index={2}>
          {/* Seule phrase en blanc pur du site : c'est le cœur du propos. */}
          <p className="measure mt-10 text-[length:var(--fs-lead)] text-white">{second}</p>
        </Reveal>
        <Reveal index={3}>
          <p className="measure mt-6 text-[length:var(--fs-lead)] text-ink-faint">{third}</p>
        </Reveal>
      </div>
    </section>
  );
}
