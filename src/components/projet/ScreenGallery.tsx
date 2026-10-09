"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Ecran } from "@/content/screens";

/**
 * Les écrans réels d'un projet, et leur agrandissement.
 *
 * Une capture de page web à 300 px de large ne montre rien : on devine une mise
 * en page, on ne lit aucun texte. La vignette sert donc d'index, et le plein
 * écran est le vrai mode de lecture — c'est lui qui porte le travail.
 *
 * Pas de bibliothèque de « lightbox » : il faut un dialogue modal, une touche
 * Échap, les flèches, et le focus rendu à la vignette d'origine. C'est quarante
 * lignes, et aucune dépendance qui décidera un jour de changer d'API.
 */
export function ScreenGallery({
  ecrans,
  accent,
  nom,
}: {
  ecrans: Ecran[];
  accent: string;
  nom: string;
}) {
  const [ouvert, setOuvert] = useState<number | null>(null);
  const dialogue = useRef<HTMLDivElement>(null);
  // La vignette d'où l'on vient : sans ça, fermer le dialogue renvoie le focus
  // en haut du document et l'utilisateur au clavier repart de zéro.
  const origine = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (ouvert === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOuvert(null);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setOuvert((i) => {
          if (i === null) return i;
          const j = i + (e.key === "ArrowRight" ? 1 : -1);
          return j < 0 ? ecrans.length - 1 : j >= ecrans.length ? 0 : j;
        });
        return;
      }
      // Le focus ne doit pas pouvoir sortir du dialogue : derrière, la page est
      // inerte à l'œil mais pas au clavier.
      if (e.key === "Tab") {
        const cibles = dialogue.current?.querySelectorAll<HTMLElement>("button");
        if (!cibles?.length) return;
        const premier = cibles[0];
        const dernier = cibles[cibles.length - 1];
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogue.current?.querySelector("button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      origine.current?.focus();
    };
  }, [ouvert, ecrans.length]);

  if (!ecrans.length) return null;
  const courant = ouvert === null ? null : ecrans[ouvert];

  return (
    <section className="mt-16" aria-labelledby="titre-ecrans">
      <h2
        id="titre-ecrans"
        className="eyebrow"
        style={{ color: accent }}
      >
        Les écrans
      </h2>
      <p className="measure mt-3 text-ink-muted">
        Captures du site en ligne, pas des maquettes. Cliquez pour agrandir.
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {ecrans.map((e, i) => (
          <li key={e.src}>
            <button
              type="button"
              data-curseur="Agrandir"
              onClick={(ev) => {
                origine.current = ev.currentTarget;
                setOuvert(i);
              }}
              className="group block w-full text-left"
            >
              <span
                className="relative block aspect-[16/9] overflow-hidden rounded-[var(--radius-md)]
                           border border-[var(--line)] transition-colors
                           group-hover:border-[var(--line-strong)]"
              >
                <Image
                  src={e.src}
                  alt={`${nom} — ${e.legende}`}
                  fill
                  sizes="(min-width: 640px) 560px, 100vw"
                  className="object-cover object-top transition-transform duration-500
                             group-hover:scale-[1.02]"
                />
              </span>
              <span className="mt-3 block font-mono text-[0.78rem] text-ink-faint
                               transition-colors group-hover:text-ink-muted">
                {e.legende}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {courant ? (
        <div
          ref={dialogue}
          role="dialog"
          aria-modal="true"
          aria-label={`${nom} — ${courant.legende}`}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={(e) => {
            // Clic dans le vide = fermer. Le clic sur l'image remonte jusqu'ici,
            // d'où le test sur la cible exacte.
            if (e.target === e.currentTarget) setOuvert(null);
          }}
        >
          <figure className="w-full max-w-[1200px]">
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-md)]
                         border border-white/10"
            >
              <Image
                src={courant.src}
                alt={`${nom} — ${courant.legende}`}
                fill
                sizes="1200px"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-[0.8rem] text-white/70">
                {courant.legende}
              </span>
              <span className="flex items-center gap-1">
                {ecrans.map((e, i) => (
                  <button
                    key={e.src}
                    type="button"
                    aria-label={e.legende}
                    aria-current={i === ouvert ? "true" : undefined}
                    onClick={() => setOuvert(i)}
                    className="h-9 w-9 shrink-0 rounded-full font-mono text-[0.72rem] transition-colors"
                    style={
                      i === ouvert
                        ? { background: accent, color: "#07090f" }
                        : { color: "rgba(255,255,255,.55)" }
                    }
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setOuvert(null)}
                  aria-label="Fermer"
                  className="ml-2 grid h-9 w-9 place-items-center rounded-full
                             text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={17} strokeWidth={1.75} aria-hidden />
                </button>
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  );
}
