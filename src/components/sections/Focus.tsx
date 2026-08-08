import Image from "next/image";
import { ArrowUpRight, Leaf } from "lucide-react";
import { focus } from "@/content/focus";
import { Reveal } from "@/components/ui/Reveal";
import { GlowBorderCard } from "@/components/ui/GlowBorderCard";
import { accentRamp } from "@/lib/accent-ramp";

/** Étude de cas : le seul projet détaillé au-delà de sa carte. */
export function Focus() {
  return (
    <section id="focus" className="section bg-surface">
      <div className="container-site">
        <header className="mb-16 lg:mb-24">
          <Reveal>
            <p className="eyebrow mb-5">{focus.eyebrow}</p>
          </Reveal>
          <Reveal index={1}>
            <h2 className="text-[length:var(--fs-h2)]">{focus.project}</h2>
          </Reveal>
          <Reveal index={2}>
            <p
              className="mt-4 font-mono text-sm tracking-wide"
              style={{ color: focus.accent }}
            >
              {focus.motto}
            </p>
          </Reveal>
          <Reveal index={3}>
            <p className="lead measure mt-8">{focus.intro}</p>
          </Reveal>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)]">
              <Image
                src="/projets/mindset.webp"
                alt={`Aperçu du site ${focus.project}`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>

          {/* Preuves chiffrées, affichées telles qu'elles sont revendiquées sur le site */}
          <Reveal index={1} className="lg:col-span-5">
            {/* Lueur à l'accent du projet, pas à celui du site : la carte de
                preuves appartient à MindSet, sa couleur doit le dire. */}
            <GlowBorderCard
              fill
              className="h-full"
              borderRadius="var(--radius-lg)"
              gradientColors={accentRamp(focus.accent)}
              animationDuration={18}
              borderWidth="0.7em"
              blurAmount="0.6em"
              glowOpacity={0.7}
              surface="var(--color-card)"
            >
            <div className="flex h-full flex-col justify-between gap-8 p-8">
              <ul className="flex flex-col gap-7">
                {focus.proof.map((p) => (
                  <li key={p.label}>
                    {/* tracking serré : en monospace, l'espace et la virgule
                        prennent une cellule entière (« +214  h », « 4 , 9 »). */}
                    <span className="block font-mono text-[2rem] leading-none tracking-[-0.1em] text-ink">
                      {p.value}
                    </span>
                    <span className="mt-2 block text-sm text-ink-faint">{p.label}</span>
                  </li>
                ))}
              </ul>
              <a
                href={focus.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-primary"
              >
                Voir la plateforme
                <ArrowUpRight size={16} strokeWidth={1.75} />
              </a>
            </div>
            </GlowBorderCard>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {focus.blocks.map((block, i) => (
            <Reveal key={block.title} index={i}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--line)] bg-card p-8">
                <h3 className="text-[length:var(--fs-h3)]">{block.title}</h3>
                <p className="mt-3 text-ink-muted">{block.lead}</p>
                <ul className="mt-7 flex flex-col">
                  {block.items.map((item) => (
                    <li
                      key={item.name}
                      className="border-t border-[var(--line)] py-4 first:border-t-0 first:pt-0"
                    >
                      <span className="block font-medium text-ink">{item.name}</span>
                      <span className="mt-1 block text-sm text-ink-muted">{item.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal index={2}>
          <div className="mt-6 flex flex-col gap-6 rounded-[var(--radius-lg)] border border-[var(--line)] bg-card p-8 md:flex-row md:items-start">
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)]"
              style={{
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.28)",
              }}
            >
              <Leaf size={18} strokeWidth={1.75} className="text-status-live" />
            </span>
            <div>
              <h3 className="text-[length:var(--fs-h3)]">{focus.climate.title}</h3>
              <p className="measure mt-3 text-ink-muted">{focus.climate.body}</p>
            </div>
          </div>
        </Reveal>

        <Reveal index={3}>
          <ul className="mt-10 flex flex-wrap gap-2">
            {focus.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-[var(--line)] px-3 py-1.5 font-mono text-[0.7rem] text-ink-faint"
              >
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
