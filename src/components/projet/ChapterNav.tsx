"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { ProjectDetail } from "@/content/project-chapters";

/**
 * Navigation des chapitres, collante sous l'en-tête.
 *
 * Le chapitre actif est souligné à l'accent du projet. Les flèches ← et →
 * changent de chapitre : c'est la seule façon de feuilleter un dossier sans
 * viser un lien à la souris, et ça ne coûte qu'un écouteur.
 */
export function ChapterNav({ projet }: { projet: ProjectDetail }) {
  const chemin = usePathname();
  const actif = projet.chapters.findIndex((c) =>
    chemin.endsWith(`/${c.slug}`),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      // On ne détourne jamais les flèches quand l'utilisateur saisit du texte.
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (t?.isContentEditable) return;

      const i = actif < 0 ? 0 : actif;
      const j = e.key === "ArrowLeft" ? i - 1 : i + 1;
      const cible = projet.chapters[j];
      if (cible) window.location.href = `/projets/${projet.slug}/${cible.slug}`;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actif, projet]);

  return (
    <nav
      aria-label="Chapitres du dossier"
      className="sticky top-[var(--nav-height)] z-30 glass border-y border-[var(--line)]"
    >
      <ol className="container-site flex gap-1 overflow-x-auto py-1">
        {projet.chapters.map((c, i) => {
          const courant = i === actif;
          return (
            <li key={c.slug} className="shrink-0">
              <a
                href={`/projets/${projet.slug}/${c.slug}`}
                aria-current={courant ? "page" : undefined}
                className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3
                            font-mono text-[0.78rem] transition-colors duration-200 ${
                              courant
                                ? "text-ink"
                                : "border-transparent text-ink-faint hover:text-ink-muted"
                            }`}
                style={courant ? { borderBottomColor: projet.accent } : undefined}
              >
                <span className="text-[0.7rem] opacity-70">{c.n}</span>
                {c.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
