import { site } from "@content/site.config";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="container-site flex flex-col gap-4 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono text-xs text-ink-faint">{site.role}</p>
      </div>
    </footer>
  );
}
