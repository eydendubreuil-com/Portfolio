"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface WaveGridBackgroundProps {
    /** Couleur des lignes au repos. Par défaut : le token `--wave-base`. */
    colorBase?: string;
    /** Couleur des crêtes et du halo sous le curseur. Par défaut : `--wave-high`. */
    colorHigh?: string;
    /** Espacement de la grille, en pixels CSS. */
    cell?: number;
    /** Opacité globale de la couche. */
    opacity?: number;
    className?: string;
    children?: ReactNode;
}

/** #rgb / #rrggbb -> [r, g, b]. Renvoie null si la chaîne n'est pas lisible. */
function parseHex(hex: string): [number, number, number] | null {
    const s = hex.trim().replace("#", "");
    if (s.length === 3) {
        const [r, g, b] = [...s].map((c) => Number.parseInt(c + c, 16));
        return [r, g, b].some(Number.isNaN) ? null : [r, g, b];
    }
    if (s.length === 6) {
        const v = [0, 2, 4].map((i) => Number.parseInt(s.slice(i, i + 2), 16));
        return v.some(Number.isNaN) ? null : (v as [number, number, number]);
    }
    return null;
}

/**
 * Grille d'onde réactive au curseur.
 *
 * Une grille régulière dont chaque sommet est déplacé par la somme de trois
 * ondes lentes, plus un renflement gaussien centré sur la souris. La couleur
 * d'un segment interpole entre `colorBase` et `colorHigh` selon son élévation
 * et sa proximité au curseur.
 *
 * Pensé pour tenir derrière **toute** la page, ce qui impose trois choses :
 *
 * 1. Le coût par image ne doit pas dépendre de la longueur du document. Le
 *    canvas fait la taille du viewport, pas celle de la page.
 * 2. Les segments sont regroupés par palier de couleur (`BUCKETS`) et tracés
 *    en un `stroke()` par palier. Un trait par segment, c'est ~3 000 appels
 *    par image ; ici c'est 10.
 * 3. La boucle s'arrête dès que l'onglet passe en arrière-plan.
 */
export function WaveGridBackground({
    colorBase,
    colorHigh,
    cell = 34,
    opacity = 1,
    className,
    children,
}: WaveGridBackgroundProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = hostRef.current;
        if (!canvas || !host) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const styles = getComputedStyle(host);
        const base =
            parseHex(colorBase ?? styles.getPropertyValue("--wave-base")) ?? [36, 49, 84];
        const high =
            parseHex(colorHigh ?? styles.getPropertyValue("--wave-high")) ?? [91, 140, 255];

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Le renflement ne s'installe que sur pointeur fin : au doigt, il
        // suivrait le dernier appui et resterait figé là.
        const finePointer = window.matchMedia("(pointer: fine)").matches;

        // Paliers de couleur : au-delà d'une dizaine l'œil ne distingue plus
        // rien, mais le nombre de `stroke()` par image, lui, grimpe.
        const BUCKETS = 10;

        let w = 0;
        let h = 0;
        let cols = 0;
        let rows = 0;
        let dpr = 1;

        const resize = () => {
            // Plafonné à 1,5 : au-delà on paie le quadruple de pixels pour des
            // traits d'un pixel que personne ne regarde de près.
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = host.clientWidth;
            h = host.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / cell) + 2;
            rows = Math.ceil(h / cell) + 2;
        };
        resize();

        // Position visée par le curseur, et position réellement suivie : le
        // lissage évite que le renflement ne saute d'un bord à l'autre quand la
        // souris revient dans la fenêtre.
        let targetX = w / 2;
        let targetY = h / 2;
        let mx = targetX;
        let my = targetY;
        let targetPull = 0; // 0 = souris absente, 1 = souris sur la page
        let pull = 0;

        const onMove = (e: PointerEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
            targetPull = 1;
        };
        const onLeave = () => {
            targetPull = 0;
        };

        if (finePointer && !reduced) {
            window.addEventListener("pointermove", onMove, { passive: true });
            document.addEventListener("pointerleave", onLeave);
        }
        window.addEventListener("resize", resize);

        // Rayon de déformation du curseur, en pixels : le renflement géométrique.
        const REACH = 260;
        const REACH2 = REACH * REACH;

        // Rayon de RÉVÉLATION, plus large que la déformation : c'est lui qui
        // allume la grille. Volontairement dissocié — la bosse doit rester
        // localisée là où le halo, lui, doit éclairer une zone confortable.
        const GLOW = 420;
        const GLOW2 = GLOW * GLOW;

        // Présence de la grille loin du curseur. À 0 elle disparaîtrait
        // complètement entre deux mouvements, ce qui donne une page morte dès
        // que la souris s'arrête ; à 0,10 il reste un frémissement.
        const REPOS = 0.1;

        // Sans pointeur fin (tactile) ou en mouvement réduit, il n'y a pas de
        // curseur pour révéler quoi que ce soit. La grille reprend alors une
        // présence uniforme plutôt que de laisser la page nue.
        const revelationUniforme = !finePointer || reduced ? 0.55 : 0;

        // Tampons de chemins, un par palier : réalloués une fois, pas par image.
        const paths: Path2D[] = [];

        // Positions et niveaux des sommets. Alloués au redimensionnement, jamais
        // dans la boucle : trois Float32Array de ~1 400 flottants créés soixante
        // fois par seconde, c'est de la pression sur le ramasse-miettes pour
        // rien, et ça se payait en saccades.
        let hx = new Float32Array(0);
        let hy = new Float32Array(0);
        let lvl = new Float32Array(0);

        const allouer = () => {
            const n = cols * rows;
            if (hx.length !== n) {
                hx = new Float32Array(n);
                hy = new Float32Array(n);
                lvl = new Float32Array(n);
            }
        };
        allouer();

        const draw = (t: number) => {
            ctx.clearRect(0, 0, w, h);

            mx += (targetX - mx) * 0.08;
            my += (targetY - my) * 0.08;
            pull += (targetPull - pull) * 0.05;

            const time = t * 0.00042;

            const cellsX = cols;
            const cellsY = rows;
            allouer();

            for (let j = 0; j < cellsY; j++) {
                for (let i = 0; i < cellsX; i++) {
                    const idx = j * cellsX + i;
                    const px = i * cell - cell;
                    const py = j * cell - cell;

                    const u = px * 0.006;
                    const v = py * 0.006;

                    const wave =
                        0.5 * Math.sin(u * 1.6 + time) +
                        0.32 * Math.sin(v * 1.25 - time * 0.8) +
                        0.24 * Math.sin((u + v) * 1.05 + time * 1.35);

                    // Renflement gaussien sous le curseur.
                    const dx = px - mx;
                    const dy = py - my;
                    const d2 = dx * dx + dy * dy;
                    const bump = d2 < REACH2 ? Math.exp(-d2 / (2 * (REACH / 2.2) ** 2)) * pull : 0;

                    const elev = wave + bump * 1.9;

                    // Déplacement : discret sur les axes, franc en vertical, pour
                    // que la grille ondule sans se déchirer.
                    const amp = 5 + bump * 16;
                    hx[idx] = px + Math.sin(v * 2.1 + time * 0.9) * amp * 0.45 + dx * bump * -0.16;
                    hy[idx] = py + elev * amp + dy * bump * -0.16;

                    // Révélation : c'est le curseur qui allume la grille.
                    // Loin de lui elle retombe à REPOS, quasi invisible.
                    const halo = d2 < GLOW2 ? Math.exp(-d2 / (2 * (GLOW / 2.4) ** 2)) * pull : 0;
                    const revelation =
                        revelationUniforme || REPOS + (1 - REPOS) * halo;

                    // Le niveau porte à la fois la crête (couleur) et la
                    // révélation (présence) : un seul nombre, donc un seul
                    // classement en paliers, donc toujours dix tracés par image.
                    const crete = Math.min(1, Math.max(0, elev * 0.42 + 0.34 + bump * 0.75));
                    lvl[idx] = crete * revelation;
                }
            }

            for (let k = 0; k < BUCKETS; k++) paths[k] = new Path2D();

            const push = (a: number, b: number) => {
                const k = Math.min(
                    BUCKETS - 1,
                    Math.max(0, Math.round(((lvl[a] + lvl[b]) / 2) * (BUCKETS - 1))),
                );
                const p = paths[k];
                p.moveTo(hx[a], hy[a]);
                p.lineTo(hx[b], hy[b]);
            };

            for (let j = 0; j < cellsY; j++) {
                for (let i = 0; i < cellsX; i++) {
                    const idx = j * cellsX + i;
                    if (i < cellsX - 1) push(idx, idx + 1);
                    if (j < cellsY - 1) push(idx, idx + cellsX);
                }
            }

            for (let k = 0; k < BUCKETS; k++) {
                const f = k / (BUCKETS - 1);
                const r = Math.round(base[0] + (high[0] - base[0]) * f);
                const g = Math.round(base[1] + (high[1] - base[1]) * f);
                const b = Math.round(base[2] + (high[2] - base[2]) * f);
                // Rampe volontairement raide (puissance 1,5) et non linéaire :
                // c'est elle qui fait que la grille « apparaît » sous la souris
                // au lieu de monter doucement partout. Le palier 0 est à peine
                // au-dessus du noir, le dernier est franc.
                const alpha = 0.035 + 0.86 * f ** 1.5;
                ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
                ctx.lineWidth = 0.5 + f * 0.8;
                ctx.stroke(paths[k]);
            }
        };

        let raf = 0;
        let running = true;

        const loop = (t: number) => {
            if (!running) return;
            draw(t);
            raf = requestAnimationFrame(loop);
        };

        const onVisibility = () => {
            if (document.hidden) {
                running = false;
                cancelAnimationFrame(raf);
            } else if (!reduced && !running) {
                running = true;
                raf = requestAnimationFrame(loop);
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        if (reduced) {
            // Mouvement réduit : une seule image, figée sur un temps arbitraire.
            running = false;
            draw(0);
        } else {
            raf = requestAnimationFrame(loop);
        }

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [colorBase, colorHigh, cell]);

    return (
        <div ref={hostRef} className={cn("relative h-full w-full", className)}>
            <canvas
                ref={canvasRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 block h-full w-full"
                style={{ opacity }}
            />
            {children}
        </div>
    );
}

export default WaveGridBackground;
