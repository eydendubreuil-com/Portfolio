import { positioning } from "@/content/positioning";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Eyebrow";
import { AnimatedRays } from "@/components/ui/animated-rays";

export function Positioning() {
  return (
    <section id="positionnement" className="section surface-veil relative overflow-hidden">
      {/* Les rayons vivent ici plutôt que dans le hero.
          Contraints à l'angle haut droit, et pas étalés sur toute la section :
          leur masque interne est un `radial-gradient(ellipse at 100% 0%)`,
          calibré pour éteindre l'effet loin de ce coin. Sur une boîte pleine
          section, le dégradé n'a pas la place de s'éteindre et l'arc-en-ciel
          barre tout le bloc, texte compris. Dans un quart de section, il fait
          ce pour quoi il est écrit.
          Le fondu qui suit ramène le bord gauche au fond de section, sinon la
          coupure du conteneur se voit en trait net. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-[60%] w-[55%] md:block"
        style={{
          // Le calque interne du composant est en `background-attachment: fixed`,
          // donc ancré au viewport : un conteneur plus petit le RECADRE au lieu
          // de le réduire, et les bords se coupent net. Ce masque éteint les
          // quatre bords d'un coup, ce que quatre dégradés empilés faisaient
          // moins bien et plus cher.
          maskImage: "radial-gradient(ellipse at 100% 0%, #000 15%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at 100% 0%, #000 15%, transparent 72%)",
          // Une aurore d'angle, pas un aplat : à pleine opacité, les couleurs du
          // composant écrasent la section entière.
          opacity: 0.5,
        }}
      >
        <AnimatedRays />
      </div>

      <div className="container-site relative">
        <SectionHeader eyebrow={positioning.eyebrow} title={positioning.title}>
          {positioning.lead}
        </SectionHeader>

        {/* Grille de filets : la séparation vient des lignes, pas des ombres. */}
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)]
                        border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          {positioning.pillars.map((p, i) => (
            <Reveal key={p.label} index={i} className="bg-surface">
              <article className="h-full p-8 lg:p-10">
                <p className="eyebrow">{p.label}</p>
                <h3 className="mt-4 text-[length:var(--fs-h3)] leading-snug">{p.title}</h3>
                <p className="mt-4 text-ink-muted">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
