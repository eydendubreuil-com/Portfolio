"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site.config";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobile : verrou du défilement, Échap pour fermer, focus piégé dans le panneau.
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const list = [...focusables, toggleRef.current].filter(Boolean) as HTMLElement[];
      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] transition-colors duration-300 ${
        scrolled || open ? "glass" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Navigation principale" className="container-site flex h-full items-center justify-between">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-display text-[1.05rem] font-bold tracking-tight"
        >
          {site.name}
        </a>

        <ul className="hidden items-center gap-10 md:flex">
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
          <li>
            <a
              href="#contact"
              className="rounded-[var(--radius-sm)] border border-[var(--line)] px-4 py-2 text-sm
                         text-ink transition-colors hover:border-[var(--line-strong)] hover:bg-white/[0.03]"
            >
              Contact
            </a>
          </li>
        </ul>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 grid h-11 w-11 place-items-center text-ink md:hidden"
        >
          {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </nav>

      {open ? (
        <div
          id="menu-mobile"
          ref={panelRef}
          className="glass absolute inset-x-0 top-[var(--nav-height)] md:hidden"
        >
          <ul className="container-site flex flex-col py-4">
            {[...site.nav, { label: "Contact", href: "#contact" }].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-2xl font-semibold"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
