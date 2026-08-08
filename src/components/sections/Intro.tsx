import { aboutIntro } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";
import TextAnimation from "@/components/ui/staggerText";

/** Bandeau de repères : ouvre le bloc « à propos » sans empiéter sur les 3 sections. */
export function Intro() {
  return (
    <section id="a-propos" className="border-y border-[var(--line)] py-14">
      <div className="container-site">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <TextAnimation as="h2" className="eyebrow" divideBy="word" stagger={0.07} interactive radius={110}>
              {aboutIntro.eyebrow}
            </TextAnimation>

            {/* Les repères montent un à un, comme les mots d'un titre. */}
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {aboutIntro.markers.map((m, i) => (
                <li key={m}>
                  <TextAnimation
                    className="font-mono text-[0.8rem] tracking-[0.08em] text-ink-muted"
                    divideBy="word"
                    stagger={0.05}
                    delay={0.1 + i * 0.07}
                    interactive
                    radius={120}
                  >
                    {m}
                  </TextAnimation>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
