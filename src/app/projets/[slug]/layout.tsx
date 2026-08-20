import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProject, nextProject, projectDetails } from "@/content/project-chapters";
import { projects } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Magnetic } from "@/components/ui/Magnetic";
import { ChapterNav } from "@/components/projet/ChapterNav";
import { ReadingBar } from "@/components/projet/ReadingBar";

/**
 * Coquille d'un dossier projet.
 *
 * En-tête, navigation des chapitres, sorties et « projet suivant » vivent ici :
 * ils sont identiques d'un chapitre à l'autre, seul le corps change. C'est ce
 * qui donne la sensation d'un dossier qu'on feuillette plutôt que de cinq pages
 * sans rapport.
 */
export async function generateStaticParams() {
  return projectDetails.map((p) => ({ slug: p.slug }));
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projet = getProject(slug);
  if (!projet) notFound();

  // Visuel et statut viennent de `projects.ts` : le statut y est une clé typée
  // (`live`, `building`…), alors que le document de référence donne le libellé
  // français. Réutiliser la clé évite d'avoir deux vérités sur le même fait.
  const carte = projects.find((p) => p.slug === slug);
  const visuel = carte?.image ?? null;
  const suivant = nextProject(slug);

  return (
    <main className="pt-[var(--nav-height)]">
      <ReadingBar accent={projet.accent} />

      <header className="section bg-veil pb-0">
        <div className="container-site">
          <a
            href="/projets"
            className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase
                       tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
            Tous les projets
          </a>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="eyebrow" style={{ color: projet.accent }}>
              {projet.categories.join(" · ")}
            </p>
            {carte ? <StatusBadge status={carte.status} /> : null}
          </div>

          <h1 className="mt-5 text-[length:var(--fs-h1)] font-black leading-[0.92]">
            {projet.name}
          </h1>
          <p className="lead measure mt-6">{projet.tagline}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {projet.url ? (
              <Magnetic>
                <a
                  href={projet.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)]
                             bg-ink px-6 text-[0.95rem] font-semibold text-bg
                             transition-opacity duration-200 hover:opacity-90"
                >
                  Voir le site
                  <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
                </a>
              </Magnetic>
            ) : (
              // Jamais de bouton mort : on dit ce qui est, on ne feint pas un lien.
              <p className="font-mono text-[0.8rem] text-ink-faint">
                Ce projet n&apos;est pas encore public.
              </p>
            )}
            <Magnetic>
              <a
                href={`/#contact?projet=${projet.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-[var(--radius-sm)]
                           border border-[var(--line)] px-6 text-[0.95rem] font-medium text-ink
                           transition-colors duration-200
                           hover:border-[var(--line-strong)] hover:bg-white/[0.03]"
              >
                Écrire à propos de {projet.name}
              </a>
            </Magnetic>
          </div>

          {visuel ? (
            <div
              className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)]
                         border border-[var(--line)]"
            >
              <Image
                src={visuel}
                alt={`Aperçu du site ${projet.name}`}
                fill
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover object-top"
                priority
              />
            </div>
          ) : null}
        </div>
      </header>

      <ChapterNav projet={projet} />

      <div className="container-site pb-24">{children}</div>

      {/* Les deux sorties, en bas de chaque chapitre. Un client veut essayer,
          un collaborateur veut parler : leur proposer la même chose, c'est
          perdre l'un des deux. */}
      <section className="surface-veil border-y border-[var(--line)] py-16">
        <div className="container-site grid gap-px overflow-hidden rounded-[var(--radius-lg)]
                        border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
          <div className="bg-surface p-8 lg:p-10">
            <p className="eyebrow">Vous voulez l&apos;utiliser</p>
            {projet.url ? (
              <>
                <p className="mt-4 text-ink-muted">Le produit est en ligne.</p>
                <a
                  href={projet.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-ink
                             underline decoration-[var(--line-strong)] underline-offset-4
                             transition-colors hover:opacity-80"
                  style={{ textDecorationColor: projet.accent }}
                >
                  Voir le site
                  <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
                </a>
              </>
            ) : (
              <p className="mt-4 text-ink-muted">
                Ce projet n&apos;est pas encore public.
              </p>
            )}
          </div>

          <div className="bg-surface p-8 lg:p-10">
            <p className="eyebrow">Vous voulez en parler</p>
            <p className="mt-4 text-ink-muted">
              Un projet, une idée, une collaboration ?
            </p>
            <a
              href={`/#contact?projet=${projet.slug}`}
              className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-ink
                         underline decoration-[var(--line-strong)] underline-offset-4
                         transition-colors hover:opacity-80"
            >
              Écrire
              <ArrowRight size={15} strokeWidth={2} aria-hidden />
            </a>
          </div>
        </div>

        {suivant && suivant.slug !== projet.slug ? (
          <div className="container-site mt-12">
            <a
              href={`/projets/${suivant.slug}`}
              data-curseur="Ouvrir"
              className="group flex items-center justify-between gap-6 rounded-[var(--radius-lg)]
                         border border-[var(--line)] p-8 transition-colors
                         hover:border-[var(--line-strong)] hover:bg-white/[0.02]"
            >
              <span>
                <span className="eyebrow">Projet suivant</span>
                <span className="mt-2 block font-display text-2xl font-bold">
                  {suivant.name}
                </span>
              </span>
              <ArrowRight
                size={22}
                strokeWidth={1.75}
                aria-hidden
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: suivant.accent }}
              />
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
}
