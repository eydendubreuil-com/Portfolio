import { ArrowUp } from "lucide-react";
import { site } from "@/content/site.config";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="container-site grid gap-10 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-2xl font-bold tracking-tight">{site.name}</p>
          <p className="mt-3 text-ink-faint">{site.tagline}</p>
        </div>

        <nav aria-label="Navigation de pied de page" className="lg:col-span-3">
          <ul className="flex flex-col gap-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <ul className="flex flex-col gap-3">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-site flex flex-col gap-4 border-t border-[var(--line)] py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-ink-faint">© 2026 {site.name}</p>
        <a
          href="#top"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-faint transition-colors hover:text-ink"
        >
          <ArrowUp size={13} strokeWidth={1.75} />
          Retour en haut
        </a>
      </div>
    </footer>
  );
}
