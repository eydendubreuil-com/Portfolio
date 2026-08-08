import { aboutIntro } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";

/** Bandeau de repères : ouvre le bloc « à propos » sans empiéter sur les 3 sections. */
export function Intro() {
  return (
    <section id="a-propos" className="border-y border-[var(--line)] py-14">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h2 className="eyebrow">{aboutIntro.eyebrow}</h2>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {aboutIntro.markers.map((m) => (
                <li
                  key={m}
                  className="font-mono text-[0.8rem] tracking-[0.08em] text-ink-muted"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
