"use client";

import { useEffect, useRef } from "react";

export interface TwistingRibbonProps {
  /** Nombre de quads composant le ruban. Au-delà de ~500 le gain est nul. */
  segments?: number;
  /** Vitesse de défilement de l'onde, en radians par frame. */
  waveSpeed?: number;
  /** Amplitude de l'onde, en fraction de la hauteur du canvas. */
  waveAmplitude?: number;
  /** Nombre de torsions complètes sur la largeur. */
  twistCycles?: number;
  /** Épaisseur du ruban à plat, en fraction de la hauteur. */
  thickness?: number;
  /** Arrêtés du dégradé. Par défaut : le dégradé signature du site. */
  colors?: string[];
  /** Opacité globale. Bas par défaut : c'est un fond, pas le sujet. */
  opacity?: number;
  className?: string;
}

const TAU = Math.PI * 2;

/** Interpole une rampe de couleurs et renvoie [r,g,b]. */
function sampleRamp(stops: number[][], u: number): number[] {
  const n = stops.length - 1;
  const scaled = Math.min(Math.max(u, 0), 1) * n;
  const i = Math.min(Math.floor(scaled), n - 1);
  const f = scaled - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

function hexToRgb(hex: string): number[] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Ruban qui se vrille, en canvas 2D.
 *
 * Chaque segment est un quad dont la demi-hauteur suit `cos(torsion)` : le
 * ruban s'aplatit jusqu'à disparaître quand il se présente de profil, puis
 * repart en montrant sa face arrière — c'est ce basculement, et non l'onde,
 * qui donne la lecture « ruban » plutôt que « vague ».
 *
 * La boucle rAF est coupée hors viewport, et `prefers-reduced-motion` rend
 * une image fixe.
 */
export function TwistingRibbon({
  segments = 400,
  waveSpeed = 0.018,
  waveAmplitude = 1,
  twistCycles = 6,
  thickness = 0.3,
  colors = ["#5B8CFF", "#6E56CF", "#2ED3F6"],
  opacity = 0.55,
  className,
}: TwistingRibbonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stops = colors.map(hexToRgb);

    // Palette pré-calculée : changer `fillStyle` est le coût dominant d'un
    // rendu par quads. En quantifiant, des segments voisins partagent la même
    // valeur et l'on passe de ~400 changements d'état par frame à quelques
    // dizaines.
    const STEPS = 48;
    const front: string[] = [];
    const back: string[] = [];
    for (let i = 0; i < STEPS; i++) {
      const [r, g, b] = sampleRamp(stops, i / (STEPS - 1));
      front.push(`rgb(${r | 0},${g | 0},${b | 0})`);
      back.push(`rgb(${(r * 0.42) | 0},${(g * 0.42) | 0},${(b * 0.5) | 0})`);
    }

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;

      const half = height * thickness * 0.5;
      const amp = height * 0.16 * waveAmplitude;
      const midY = height * 0.5;

      // Géométrie d'abord, rendu ensuite : on évite de recalculer les bords
      // partagés entre deux quads consécutifs.
      const xs = new Float32Array(segments + 1);
      const tops = new Float32Array(segments + 1);
      const bots = new Float32Array(segments + 1);
      const shade = new Uint8Array(segments + 1);

      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const twist = u * twistCycles * TAU + t;
        const c = Math.cos(twist);
        const y = midY + Math.sin(u * TAU * 1.5 - t * 1.4) * amp;
        xs[i] = u * width;
        tops[i] = y - half * c;
        bots[i] = y + half * c;
        shade[i] = c >= 0 ? 1 : 0;
      }

      // Les segments consécutifs de même couleur sont réunis en un seul tracé.
      // La couleur ne change qu'aux paliers de la palette et aux bascules de
      // face, soit ~60 fois : un fill() par segment en ferait 400 pour le même
      // résultat, et c'est l'appel dominant du rendu.
      const fillAt = (i: number) => {
        const idx = Math.min(STEPS - 1, ((i / segments) * STEPS) | 0);
        return shade[i] ? front[idx] : back[idx];
      };

      let runStart = 0;
      let runFill = fillAt(0);

      const flush = (end: number) => {
        ctx.fillStyle = runFill;
        ctx.beginPath();
        ctx.moveTo(xs[runStart], tops[runStart]);
        for (let k = runStart + 1; k <= end + 1; k++) ctx.lineTo(xs[k], tops[k]);
        for (let k = end + 1; k >= runStart; k--) ctx.lineTo(xs[k], bots[k]);
        ctx.closePath();
        ctx.fill();
      };

      for (let i = 1; i < segments; i++) {
        const f = fillAt(i);
        if (f !== runFill) {
          // `i - 1` ferme la série sur le segment précédent ; le quad courant
          // ouvre la suivante, sans trou puisque les deux partagent le bord i.
          flush(i - 1);
          runStart = i;
          runFill = f;
        }
      }
      flush(segments - 1);

      ctx.globalAlpha = 1;
    };

    const loop = () => {
      t += waveSpeed;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw();

    const onResize = () => {
      resize();
      if (!running) draw();
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [segments, waveSpeed, waveAmplitude, twistCycles, thickness, colors, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? "block h-full w-full"}
    />
  );
}

export default TwistingRibbon;
