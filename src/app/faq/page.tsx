import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { faq } from "@/content/faq";
import { aboutSections } from "@/content/about";
import { site } from "@/content/site.config";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { ButtonPrimary } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Comment j'apprends, le rôle de l'IA dans ma façon de travailler, comment je choisis un projet, et ce qu'on peut faire ensemble.",
  alternates: { canonical: "/faq" },
};

/**
 * Balisage FAQPage : c'est le seul type de données structurées qui donne un
 * gain visible en recherche pour ce genre de page. Les réponses y sont
 * reconstituées en texte simple, sans balise — Google rejette le HTML ici.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer.join(" ") },
  })),
};

export default function FaqPage() {
  return (
    <main className="pt-[var(--nav-height)]">
      <section className="section bg-veil">
        <div className="container-site">
          <Reveal>
            <a
              href="/#a-propos"
              className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase
                         tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
              Retour à « À propos »
            </a>
          </Reveal>

          <Reveal index={1}>
            <h1 className="mt-8 max-w-[16ch] text-[length:var(--fs-h1)] font-black leading-[0.95]">
              Le reste des questions.
            </h1>
          </Reveal>

          <Reveal index={2}>
            <p className="lead measure mt-6">
              Les trois grandes questions — mon déclic, pourquoi plusieurs projets, où je
              veux aller — sont développées sur la page d&apos;accueil. Voici les six
              autres.
            </p>
          </Reveal>

          {/* Une question par bloc, séparée par un filet. Pas d'accordéon : le
              contenu est court, et masquer six réponses derrière des clics ne
              sert que la mise en page, jamais le lecteur. */}
          <div className="mt-20 border-t border-[var(--line)]">
            {faq.map((item, i) => (
              <Reveal key={item.id} index={i}>
                <article
                  id={item.id}
                  className="grid gap-6 border-b border-[var(--line)] py-12 scroll-mt-32
                             lg:grid-cols-12 lg:gap-16"
                >
                  <h2 className="text-[length:var(--fs-h3)] font-bold leading-snug lg:col-span-5">
                    <span className="mr-3 font-mono text-[0.7rem] font-medium text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.question}
                  </h2>
                  <div className="flex flex-col gap-4 lg:col-span-7">
                    {item.answer.map((p, k) => (
                      <p key={k} className="measure text-ink-muted">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-6">
              <Magnetic>
                <ButtonPrimary href="/#contact">Me contacter</ButtonPrimary>
              </Magnetic>
              <p className="text-ink-faint">
                Je réponds à tous les messages —{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink-muted underline decoration-[var(--line-strong)]
                             underline-offset-4 transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </p>
            </div>
          </Reveal>

          {/* Rappel des trois questions restées sur l'accueil : la page se
              suffit à elle-même sans dupliquer des réponses de 200 mots. */}
          <Reveal>
            <nav aria-label="Questions développées sur l'accueil" className="mt-16">
              <p className="eyebrow">Développé sur l&apos;accueil</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {aboutSections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`/#${s.id}`}
                      className="inline-flex rounded-full border border-[var(--line)] px-4 py-2
                                 font-mono text-[0.72rem] text-ink-muted transition-colors
                                 hover:border-[var(--line-strong)] hover:text-ink"
                    >
                      {s.question}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
