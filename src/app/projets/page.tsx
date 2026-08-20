import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { projectDetails } from "@/content/project-chapters";
import { projects } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Les projets",
  description:
    "Sept projets, chacun en cinq chapitres : vue d'ensemble, problème, solution, coulisses, résultats.",
  alternates: { canonical: "/projets" },
};

/** Index des dossiers. Chaque carte ouvre le chapitre 1 du projet. */
export default function ProjetsPage() {
  return (
    <main className="pt-[var(--nav-height)]">
      <section className="section bg-veil">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow">Les projets</p>
          </Reveal>
          <Reveal index={1}>
            <h1 className="mt-6 max-w-[18ch] text-[length:var(--fs-h1)] font-black leading-[0.95]">
              Sept dossiers, cinq chapitres chacun.
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p className="lead measure mt-6">
              Vue d&apos;ensemble, problème, solution, coulisses, résultats. Un client
              survole le premier chapitre ; un partenaire lit les coulisses.
            </p>
          </Reveal>

          <div className="mt-20 flex flex-col">
            {projectDetails.map((p, i) => {
              const carte = projects.find((c) => c.slug === p.slug);
              return (
                <Reveal key={p.slug} index={Math.min(i, 4)}>
                  <a
                    href={`/projets/${p.slug}`}
                    data-curseur="Ouvrir"
                    className="group grid items-center gap-8 border-t border-[var(--line)] py-10
                               transition-colors hover:bg-white/[0.02] lg:grid-cols-12 lg:gap-12"
                  >
                    <div className="lg:col-span-3">
                      <div
                        className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)]
                                   border border-[var(--line)]"
                        style={
                          carte?.image
                            ? undefined
                            : { background: `linear-gradient(150deg, ${p.accent}22, transparent 70%)` }
                        }
                      >
                        {carte?.image ? (
                          <Image
                            src={carte.image}
                            alt={`Aperçu du site ${p.name}`}
                            fill
                            sizes="(min-width: 1024px) 22vw, 100vw"
                            className="object-cover object-top transition-transform duration-500
                                       group-hover:scale-[1.03]"
                          />
                        ) : (
                          <span
                            className="absolute inset-0 grid place-items-center font-mono text-[0.7rem]
                                       uppercase tracking-[0.14em]"
                            style={{ color: `${p.accent}D0` }}
                          >
                            {p.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="eyebrow" style={{ color: p.accent }}>
                          {p.categories.join(" · ")}
                        </span>
                        {carte ? <StatusBadge status={carte.status} /> : null}
                      </div>
                      <h2 className="mt-3 font-display text-[1.6rem] font-bold leading-tight">
                        {p.name}
                      </h2>
                      <p className="measure mt-3 text-ink-muted">{p.tagline}</p>
                      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                        {p.chapters.map((c) => (
                          <li
                            key={c.slug}
                            className="font-mono text-[0.7rem] text-ink-faint"
                          >
                            <span className="opacity-60">{c.n}</span> {c.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="lg:col-span-2 lg:justify-self-end">
                      <span className="inline-flex items-center gap-2 font-mono text-sm text-ink-muted
                                       transition-colors group-hover:text-ink">
                        Ouvrir
                        <ArrowRight
                          size={16}
                          strokeWidth={1.75}
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </a>
                </Reveal>
              );
            })}
            <div className="border-t border-[var(--line)]" />
          </div>
        </div>
      </section>
    </main>
  );
}
