import { vision } from "@/content/site.config";
import { Reveal } from "@/components/ui/Reveal";
import { Starfield } from "@/components/visual/Starfield";

/**
 * La seule décoration est la poussière d'étoiles, déplacée ici depuis le hero.
 * La section parle d'ambition et de long terme ; c'est le seul endroit où un
 * ciel dit quelque chose plutôt que de faire joli. Le vide fait le reste.
 */
export function Vision() {
  const [first, second, third] = vision.sentences;

  return (
    <section id="vision" className="section relative overflow-hidden">
      {/* Mesuré : sans ce masque, une étoile tombant sous l'eyebrow le faisait
          descendre à 2,12:1. Les étoiles ne sont pas coupées côté texte, elles
          y sont ramenées à 18 % — assez pour que le ciel reste continu, trop
          peu pour qu'un point clair passe sous une lettre. À droite, où il n'y
          a rien à lire, elles gardent toute leur intensité. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(100deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.18) 42%, #000 78%)",
          WebkitMaskImage:
            "linear-gradient(100deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.18) 42%, #000 78%)",
        }}
      >
        <Starfield />
      </div>

      <div className="container-site relative">
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
