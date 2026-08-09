"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories, projects, type Project, type ProjectCategory } from "@/content/projects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SectionHeader } from "@/components/ui/Eyebrow";

type Filter = "Tous" | ProjectCategory;

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      id={`projet-${project.slug}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.06 }}
      // `data-curseur` : la pastille de ContextCursor s'ouvre et annonce
      // l'action au survol de la carte. Uniquement sur les cartes — pas sur les
      // champs de formulaire ni le texte courant, où masquer le curseur natif
      // rendrait le site inutilisable.
      data-curseur={project.url ? "Voir" : "Bientôt"}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)]
                 border border-[var(--line)] bg-card scroll-mt-32
                 transition-colors duration-200 hover:border-[var(--line-strong)]
                 hover:bg-card-elevated"
    >
      {/* Liseré d'accent, révélé au survol */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-[2px] opacity-0
                   transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: project.accent }}
      />

      {/* Visuel du site, ratio 16:10 */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--line)]">
        {project.image ? (
          <Image
            src={project.image}
            alt={`Aperçu du site ${project.name}`}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover object-top transition-transform duration-500
                       group-hover:scale-[1.03]"
          />
        ) : (
          // Pas de capture disponible : on compose avec l'accroche réelle du projet
          // plutôt qu'un bloc vide. Volontaire, pas une image manquante.
          <div
            className="flex h-full w-full flex-col justify-between p-7"
            style={{
              background:
                `radial-gradient(120% 100% at 15% 0%, ${project.accent}2E 0%, transparent 60%),` +
                `linear-gradient(160deg, ${project.accent}14 0%, transparent 70%)`,
            }}
          >
            <span
              className="font-mono text-[0.7rem] uppercase tracking-[0.14em]"
              style={{ color: `${project.accent}D0` }}
            >
              {project.name}
            </span>
            {project.tagline ? (
              <p
                className="max-w-[14ch] font-display text-[1.6rem] font-extrabold leading-[1.05] tracking-[-0.03em]"
                style={{ color: `${project.accent}` }}
              >
                {project.tagline}
              </p>
            ) : (
              <span
                className="font-display text-5xl font-black"
                style={{ color: `${project.accent}66` }}
              >
                {project.name.charAt(0)}
              </span>
            )}
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-card"
        />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-faint">
          {String(index + 1).padStart(2, "0")} · {project.category}
        </p>

        <h3 className="mt-2 text-[length:var(--fs-h3)]">{project.name}</h3>

        <p className="mt-4 text-ink-muted">{project.description}</p>

        <p className="mt-5 text-sm">
          <span className="eyebrow">Objectif</span>
          <span className="mt-1 block text-ink-muted">{project.goal}</span>
        </p>

        <ul className="mt-5 mb-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-[var(--line)] px-2.5 py-1
                         font-mono text-[0.68rem] text-ink-faint"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* mt-auto colle le pied de carte en bas : toutes les cartes s'alignent */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
          <StatusBadge status={project.status} />
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink
                         transition-colors hover:text-primary"
            >
              Voir le projet
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("Tous");
  const filters: Filter[] = ["Tous", ...categories];
  const shown = filter === "Tous" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projets" className="section bg-veil">
      <div className="container-site">
        <SectionHeader eyebrow="Projets" title="Sept projets, quatre déjà en ligne.">
          Chaque projet fait progresser le suivant. Les statuts sont réels : ce qui est en
          préparation est annoncé comme tel.
        </SectionHeader>

        <div
          role="group"
          aria-label="Filtrer les projets par catégorie"
          className="mb-12 flex flex-wrap gap-2"
        >
          {filters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-2 font-mono text-[0.72rem] uppercase
                            tracking-[0.1em] transition-colors duration-200
                            ${
                              on
                                ? "border-primary/60 bg-primary/10 text-ink"
                                : "border-[var(--line)] text-ink-faint hover:border-[var(--line-strong)] hover:text-ink-muted"
                            }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
