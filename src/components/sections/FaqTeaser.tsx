import { ArrowRight } from "lucide-react";
import { faq } from "@/content/faq";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { ButtonSecondary } from "@/components/ui/Button";

/**
 * Sortie vers le reste de la FAQ, placée juste après les trois questions
 * développées sur l'accueil.
 *
 * Les questions sont listées en clair avant le bouton, pas seulement annoncées
 * par un « voir plus » : un lecteur clique parce qu'une question précise
 * l'intéresse, pas parce qu'un bouton existe.
 */
export function FaqTeaser() {
  return (
    <section id="questions" className="surface-veil border-y border-[var(--line)] py-16">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow">Questions fréquentes</p>
          </Reveal>
          <Reveal index={1}>
            <h2 className="mt-4 max-w-[20ch] text-[length:var(--fs-h2)] font-black leading-[0.98]">
              Six autres questions, six réponses.
            </h2>
          </Reveal>
          <Reveal index={2}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {faq.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/faq#${item.id}`}
                    className="text-sm text-ink-muted underline decoration-[var(--line)]
                               underline-offset-4 transition-colors
                               hover:text-ink hover:decoration-[var(--line-strong)]"
                  >
                    {item.question}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:justify-self-end">
          <Reveal index={3}>
            <Magnetic>
              <ButtonSecondary href="/faq">
                <span className="inline-flex items-center gap-2">
                  Lire la suite
                  <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
                </span>
              </ButtonSecondary>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
