"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Mail } from "lucide-react";
import { contact, site } from "@/content/site.config";
import { Reveal } from "@/components/ui/Reveal";
import { GlowBorderCard } from "@/components/ui/GlowBorderCard";

// Le formulaire embarque react-hook-form + zod : chargé à la demande pour
// tenir le budget JS du premier chargement.
const ContactForm = dynamic(() => import("./ContactForm"), {
  loading: () => (
    <div
      aria-hidden
      className="h-[520px] animate-pulse rounded-[var(--radius-sm)] border border-[var(--line)]"
    />
  ),
});

export function Contact() {
  return (
    <section id="contact" className="section bg-veil">
      <div className="container-site">
        <Reveal>
          {/* Seul emplacement de la bordure lumineuse sur tout le site : c'est le
              dernier bloc de la page, celui où l'on veut que l'œil s'arrête. */}
          <GlowBorderCard fill animationDuration={14} borderWidth="0.9em" blurAmount="0.7em" glowOpacity={0.85}>
            <div className="p-8 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="eyebrow mb-5">{contact.eyebrow}</p>
                <h2 className="text-[length:var(--fs-h2)]">{contact.title}</h2>
                <p className="lead mt-6">{contact.lead}</p>

                <a
                  href={`mailto:${contact.email}`}
                  className="group mt-10 flex items-center gap-3 font-display
                             text-base font-semibold text-ink transition-colors
                             hover:text-primary sm:text-[length:var(--fs-h3)]"
                >
                  <Mail size={20} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                  <span className="min-w-0 break-all">{contact.email}</span>
                </a>

                <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-sm)]
                               border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
                  {site.socials.map((s) => (
                    <li key={s.label} className="bg-surface">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group flex h-full items-center justify-between gap-3 px-4 py-3
                                   transition-colors hover:bg-card"
                      >
                        <span>
                          <span className="eyebrow block">{s.label}</span>
                          <span className="mt-0.5 block font-mono text-sm text-ink">
                            {s.handle}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.75}
                          className="shrink-0 text-ink-faint transition-colors group-hover:text-ink"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <ContactForm />
              </div>
            </div>
            </div>
          </GlowBorderCard>
        </Reveal>
      </div>
    </section>
  );
}
