"use client";

import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ecosysteme, liens, noeuds, type Lien } from "@/content/ecosystem";
import { Reveal } from "@/components/ui/Reveal";

const L = 880;
const H = 620;
const LARGEUR = 190;
const HAUTEUR = 50;

const parId = Object.fromEntries(noeuds.map((n) => [n.id, n]));

/**
 * Courbe entre deux nœuds.
 *
 * Elle part du bord droit et arrive au bord gauche, sauf quand le lien remonte
 * le courant (MindSet → PawVolt) : là elle sort par la gauche et revient par la
 * droite, pour qu'on voie au premier coup d'œil que ce lien va à contresens.
 * La poignée de Bézier est proportionnelle à la distance — une valeur fixe
 * donnerait des boucles sur les liens courts et des lignes plates sur les longs.
 */
function courbe(a: string, b: string) {
  const d = parId[a];
  const f = parId[b];
  const recule = f.x < d.x;
  const x1 = recule ? d.x - LARGEUR / 2 : d.x + LARGEUR / 2;
  const x2 = recule ? f.x + LARGEUR / 2 : f.x - LARGEUR / 2;
  const poignee = Math.max(70, Math.abs(x2 - x1) * 0.55);
  const c1 = recule ? x1 - poignee : x1 + poignee;
  const c2 = recule ? x2 + poignee : x2 - poignee;
  return `M ${x1} ${d.y} C ${c1} ${d.y}, ${c2} ${f.y}, ${x2} ${f.y}`;
}

export function Ecosystem() {
  // Index plutôt qu'objet : deux liens partagent la même citation (une phrase
  // nomme deux projets), les comparer par valeur les confondrait.
  const [actif, setActif] = useState<number | null>(null);
  const uid = useId();
  const lien: Lien | null = actif === null ? null : liens[actif];
  const allumes = lien ? new Set([lien.de, lien.vers]) : null;

  // L'ancre n'est pas `ecosysteme` : une des questions « À propos » porte déjà
  // cet identifiant, et deux `id` identiques font que l'ancre du navigateur
  // comme `getElementById` ne désignent plus que le premier des deux.
  return (
    <section id="dependances" className="section bg-veil">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">{ecosysteme.eyebrow}</p>
        </Reveal>
        <Reveal index={1}>
          <h2 className="mt-4 max-w-[18ch] text-[length:var(--fs-h2)] font-black leading-[0.98]">
            {ecosysteme.title}
          </h2>
        </Reveal>
        <Reveal index={2}>
          <p className="lead measure mt-6">{ecosysteme.lead}</p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ---- Le dessin ---- */}
          <Reveal index={3} className="lg:col-span-6">
            {/* Collante : la liste fait trois fois la hauteur du dessin, et
                un lien survolé en bas de liste n'allumerait rien de visible
                si la carte avait déjà défilé hors de l'écran. */}
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
            <svg
              viewBox={`0 0 ${L} ${H}`}
              className="w-full overflow-visible"
              role="img"
              aria-label="Carte des dépendances entre les projets. La liste qui suit donne les mêmes liens en texte."
            >
              <defs>
                {noeuds.map((n) => (
                  <marker
                    key={n.id}
                    id={`${uid}-fleche-${n.id}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={n.accent} />
                  </marker>
                ))}
              </defs>

              {liens.map((l, i) => {
                const vif = actif === null || actif === i;
                return (
                  <path
                    key={`${l.de}-${l.vers}-${i}`}
                    data-arete={i}
                    d={courbe(l.de, l.vers)}
                    fill="none"
                    stroke={parId[l.de].accent}
                    strokeWidth={actif === i ? 2.4 : 1.2}
                    strokeOpacity={vif ? (actif === i ? 0.95 : 0.3) : 0.07}
                    markerEnd={actif === i ? `url(#${uid}-fleche-${l.de})` : undefined}
                    className="transition-all duration-300"
                  />
                );
              })}

              {noeuds.map((n) => {
                const vif = !allumes || allumes.has(n.id);
                return (
                  <g
                    key={n.id}
                    data-noeud={n.id}
                    className="transition-opacity duration-300"
                    opacity={vif ? 1 : 0.25}
                  >
                    <rect
                      x={n.x - LARGEUR / 2}
                      y={n.y - HAUTEUR / 2}
                      width={LARGEUR}
                      height={HAUTEUR}
                      rx={12}
                      fill="var(--color-surface)"
                      stroke={allumes?.has(n.id) ? n.accent : "var(--line)"}
                      strokeWidth={allumes?.has(n.id) ? 1.5 : 1}
                      className="transition-all duration-300"
                    />
                    <circle cx={n.x - LARGEUR / 2 + 16} cy={n.y} r={3.5} fill={n.accent} />
                    <text
                      x={n.x - LARGEUR / 2 + 29}
                      y={n.y}
                      dominantBaseline="middle"
                      fill="var(--color-ink)"
                      className="font-display"
                      fontSize={n.nom.length > 18 ? 13 : 15}
                      fontWeight={600}
                    >
                      {n.nom}
                    </text>
                  </g>
                );
              })}
            </svg>
            </div>
          </Reveal>

          {/* ---- Les liens, qui pilotent le dessin ---- */}
          <Reveal index={4} className="lg:col-span-6">
            <ul data-liens className="flex flex-col divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {liens.map((l, i) => (
                <li key={`${l.de}-${l.vers}-${i}`}>
                  <button
                    type="button"
                    // `focus` autant que `hover` : au clavier, survoler n'existe pas.
                    onMouseEnter={() => setActif(i)}
                    onFocus={() => setActif(i)}
                    onMouseLeave={() => setActif(null)}
                    onBlur={() => setActif(null)}
                    onClick={() => setActif(actif === i ? null : i)}
                    aria-expanded={actif === i}
                    // La citation voyage aussi en attribut. L'aperçu du site en
                    // un seul fichier n'a pas React : il rejoue cette section en
                    // JavaScript nu, et il doit pouvoir lire la phrase quelque
                    // part. La relire depuis le DOM évite d'en garder une
                    // deuxième copie qui finirait par diverger.
                    data-citation={l.citation}
                    data-source={l.source.titre}
                    data-source-href={`/projets/${l.source.slug}/${l.source.chapitre}`}
                    className="flex w-full items-baseline gap-3 py-3 text-left transition-colors
                               hover:bg-white/[0.02] focus-visible:bg-white/[0.02]"
                  >
                    <span
                      aria-hidden
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: parId[l.de].accent }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink-faint">
                        {parId[l.de].nom}
                        <ArrowRight
                          size={11}
                          strokeWidth={2}
                          aria-hidden
                          className="mx-1.5 inline align-[-1px]"
                        />
                        {parId[l.vers].nom}
                      </span>
                      <span className="mt-1 block text-[0.95rem] text-ink">{l.quoi}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Hauteur réservée : sans elle, la citation pousse la page à chaque
                survol et la liste fuit sous le curseur. */}
            <div data-citation-hote className="mt-8 min-h-[12rem]">
              {lien ? (
                <figure>
                  <blockquote
                    className="measure border-l-2 pl-5 text-ink-muted"
                    style={{ borderColor: parId[lien.de].accent }}
                  >
                    {lien.citation}
                  </blockquote>
                  <figcaption className="mt-4 pl-5">
                    <a
                      href={`/projets/${lien.source.slug}/${lien.source.chapitre}`}
                      className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase
                                 tracking-[0.12em] text-ink-faint transition-colors hover:text-ink"
                    >
                      {lien.source.titre}
                      <ArrowRight size={12} strokeWidth={2} aria-hidden />
                    </a>
                  </figcaption>
                </figure>
              ) : (
                <p className="measure pl-5 text-ink-faint">
                  {ecosysteme.note}
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
