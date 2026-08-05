import { ArrowUpRight, Mail } from "lucide-react";
import { contact, socials } from "@content/site.config";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-site">
        {/* Verre : un des deux seuls emplacements autorisés, avec la navigation */}
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[var(--radius-xl)] p-10 lg:p-20">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "var(--grad-signature)" }}
            />

            <p className="eyebrow mb-5">{contact.eyebrow}</p>
            <h2 className="max-w-[16ch] text-[length:var(--fs-h2)]">{contact.title}</h2>
            <p className="measure mt-6 text-[length:var(--fs-body-lg)] text-ink-muted">
              {contact.intro}
            </p>

            <a
              href={`mailto:${contact.email}`}
              className="group mt-12 inline-flex items-center gap-3 font-display
                         text-[length:var(--fs-h3)] font-semibold text-ink
                         transition-colors hover:text-primary"
            >
              <Mail size={20} strokeWidth={1.75} className="text-ink-faint" />
              {contact.email}
              <ArrowUpRight
                size={20}
                strokeWidth={1.75}
                className="transition-transform duration-200 group-hover:translate-x-0.5
                           group-hover:-translate-y-0.5"
              />
            </a>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--line)] pt-8">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase
                               tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
                  >
                    {s.label}
                    <ArrowUpRight size={13} strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
