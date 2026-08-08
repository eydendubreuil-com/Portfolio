"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Mail } from "lucide-react";
import { contact, site } from "@/content/site.config";
import { Reveal } from "@/components/ui/Reveal";

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
    <section id="contact" className="section">
      <div className="container-site">
        <Reveal>
          {/* Verre : un des deux seuls emplacements du site, avec la nav. */}
          <div className="glass relative overflow-hidden rounded-[var(--radius-xl)] p-8 lg:p-16">
            <span aria-hidden className="hairline-gradient absolute inset-x-0 top-0" />

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="eyebrow mb-5">{contact.eyebrow}</p>
                <h2 className="text-[length:var(--fs-h2)]">{contact.title}</h2>
                <p className="lead mt-6">{contact.lead}</p>

                <a
                  href={`mailto:${contact.email}`}
                  className="group mt-10 inline-flex items-center gap-3 font-display
                             text-[length:var(--fs-h3)] font-semibold text-ink
                             transition-colors hover:text-primary"
                >
                  <Mail size={20} strokeWidth={1.75} className="text-ink-faint" />
                  {contact.email}
                </a>

                <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--line)] pt-8">
                  {site.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase
                                   tracking-[0.12em] text-ink-faint transition-colors hover:text-ink"
                      >
                        {s.label}
                        <ArrowUpRight size={13} strokeWidth={1.75} />
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
        </Reveal>
      </div>
    </section>
  );
}
