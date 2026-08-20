import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, projectDetails } from "@/content/project-chapters";
import { site } from "@/content/site.config";
import { RichText, plainText } from "@/components/ui/RichText";
import { Reveal } from "@/components/ui/Reveal";

type Params = { slug: string; chapitre: string };

/** 7 projets × 5 chapitres = 35 pages, toutes rendues à la construction. */
export async function generateStaticParams() {
  return projectDetails.flatMap((p) =>
    p.chapters.map((c) => ({ slug: p.slug, chapitre: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, chapitre } = await params;
  const projet = getProject(slug);
  const chap = projet?.chapters.find((c) => c.slug === chapitre);
  if (!projet || !chap) return {};

  // Description : la première phrase du chapitre, débarrassée du balisage.
  const premier = plainText(chap.blocks[0]?.text ?? projet.tagline);
  return {
    title: `${projet.name} — ${chap.title}`,
    description: premier.length > 158 ? `${premier.slice(0, 155)}…` : premier,
    alternates: { canonical: `/projets/${slug}/${chapitre}` },
    openGraph: {
      title: `${projet.name} — ${chap.title}`,
      description: premier.slice(0, 200),
      type: "article",
    },
  };
}

export default async function ChapitrePage({ params }: { params: Promise<Params> }) {
  const { slug, chapitre } = await params;
  const projet = getProject(slug);
  if (!projet) notFound();
  const i = projet.chapters.findIndex((c) => c.slug === chapitre);
  if (i < 0) notFound();

  const chap = projet.chapters[i];
  const precedent = projet.chapters[i - 1];
  const suivant = projet.chapters[i + 1];

  // Fil d'Ariane : Accueil → Projets → {Projet} → {Chapitre}
  const fil = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
      { "@type": "ListItem", position: 2, name: "Projets", item: `${site.url}/projets` },
      { "@type": "ListItem", position: 3, name: projet.name, item: `${site.url}/projets/${slug}` },
      {
        "@type": "ListItem",
        position: 4,
        name: chap.title,
        item: `${site.url}/projets/${slug}/${chapitre}`,
      },
    ],
  };

  return (
    <article className="py-16 lg:py-24">
      <Reveal>
        <p className="eyebrow">
          Chapitre {chap.n} sur {projet.chapters.length}
        </p>
      </Reveal>
      <Reveal index={1}>
        <h2 className="mt-4 text-[length:var(--fs-h2)] font-black leading-[0.98]">
          {chap.title}
        </h2>
      </Reveal>

      <div className="mt-10 flex max-w-[68ch] flex-col gap-6">
        {chap.blocks.map((b, k) => (
          <Reveal key={k} index={Math.min(k, 4)}>
            {b.kind === "transition" ? (
              // Phrase de bascule vers le chapitre suivant : mise à part, avec
              // un filet à l'accent du projet.
              <p
                className="border-l-2 pl-5 text-[length:var(--fs-lead)] text-ink"
                style={{ borderColor: projet.accent }}
              >
                <RichText text={b.text} />
              </p>
            ) : (
              <p className="text-ink-muted">
                <RichText text={b.text} />
              </p>
            )}
          </Reveal>
        ))}
      </div>

      <nav
        aria-label="Chapitre précédent et suivant"
        className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8"
      >
        {precedent ? (
          <a
            href={`/projets/${slug}/${precedent.slug}`}
            className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.75}
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            {precedent.title}
          </a>
        ) : (
          <span />
        )}
        {suivant ? (
          <a
            href={`/projets/${slug}/${suivant.slug}`}
            className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            {suivant.title}
            <ArrowRight
              size={16}
              strokeWidth={1.75}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        ) : (
          <span />
        )}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fil) }}
      />
    </article>
  );
}
