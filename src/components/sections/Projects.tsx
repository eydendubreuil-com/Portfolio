"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Code } from "lucide-react";
import {
  projects,
  statusLabels,
  type Project,
} from "@content/site.config";
import { projectAccents, statusColors } from "@/lib/theme";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

function StatusPill({ status }: { status: Project["status"] }) {
  const color = statusColors[status];
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      {statusLabels[status]}
    </span>
  );
}

/** Monogramme : cohérent et clairement volontaire, plutôt qu'un faux logo générique. */
function Monogram({ name, accent }: { name: string; accent: string }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]
                 font-display text-lg font-bold"
      style={{
        background: `${accent}1F`,
        border: `1px solid ${accent}40`,
        color: accent,
      }}
    >
      {name.charAt(0)}
    </span>
  );
}

function CardBody({ project, accent }: { project: Project; accent: string }) {
  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Monogram name={project.name} accent={accent} />
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-faint">
              {project.category}
            </p>
            <h3 className="mt-1 text-[length:var(--fs-h3)]">{project.name}</h3>
          </div>
        </div>
        <span className="font-mono text-xs text-ink-faint">{project.year}</span>
      </div>

      <p className="measure mt-6 text-ink-muted">{project.description}</p>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <StatusPill status={project.status} />
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[var(--line)] px-3 py-1
                         font-mono text-[0.7rem] text-ink-faint"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      {project.href || project.repo ? (
        <div className="mt-8 flex flex-wrap gap-6 border-t border-[var(--line)] pt-6">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink
                         transition-colors hover:text-primary"
            >
              Voir le projet
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </a>
          ) : null}
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted
                         transition-colors hover:text-ink"
            >
              <Code size={16} strokeWidth={1.75} />
              Code source
            </a>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = projectAccents[project.slug];

  // Bordure en dégradé : réservée à la carte mise en avant, jamais aux quatre.
  if (project.featured) {
    return (
      <Reveal index={index} className="lg:col-span-2">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[var(--radius-lg)] p-px"
          style={{ background: "var(--grad-signature)" }}
        >
          <article className="h-full rounded-[calc(var(--radius-lg)-1px)] bg-card p-8">
            <CardBody project={project} accent={accent} />
          </article>
        </motion.div>
      </Reveal>
    );
  }

  return (
    <Reveal index={index}>
      <motion.article
        whileHover={{ y: -2 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-full overflow-hidden rounded-[var(--radius-lg)]
                   border border-[var(--line)] bg-card p-8
                   transition-colors duration-200 hover:border-[var(--line-strong)]
                   hover:bg-card-elevated"
      >
        {/* La lueur reste un liseré de 2px, jamais un halo */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px] opacity-0
                     transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: accent }}
        />
        <CardBody project={project} accent={accent} />
      </motion.article>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="projets" className="section">
      <div className="container-site">
        <SectionHeader eyebrow="Projets" title="Quatre produits, quatre problèmes.">
          Chaque projet est né d&apos;un besoin concret. Les statuts sont réels : ce qui est
          en développement est annoncé comme tel.
        </SectionHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
