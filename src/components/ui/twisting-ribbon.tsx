"use client";

import { useEffect, useRef } from "react";

export interface TwistingRibbonProps {
  /** Nombre de quads composant le ruban. */
  segments?: number;
  /** Vitesse de défilement de l'onde, en radians par frame. */
  waveSpeed?: number;
  /** Amplitude de l'onde, en fraction de la hauteur du canvas. */
  waveAmplitude?: number;
  /** Nombre de torsions complètes sur la longueur. */
  twistCycles?: number;
  /** Épaisseur du ruban à plat, en fraction de la hauteur. */
  thickness?: number;
  /** Amplitude de rotation de la caméra à la souris, en radians. */
  mouseTilt?: number;
  /** Arrêtés du dégradé. Par défaut : le dégradé signature du site. */
  colors?: string[];
  opacity?: number;
  className?: string;
}

const TAU = Math.PI * 2;

function hexToRgb(hex: string): number[] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function sampleRamp(stops: number[][], u: number): number[] {
  const n = stops.length - 1;
  const s = Math.min(Math.max(u, 0), 1) * n;
  const i = Math.min(Math.floor(s), n - 1);
  const f = s - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

/**
 * Ruban vrillé en 3D, rendu en canvas 2D avec projection perspective maison.
 *
 * Chaque segment vit dans l'espace : le vecteur d'épaisseur tourne dans le plan
 * YZ (la torsion), la ligne médiane ondule en Y et serpente en Z. Le tout passe
 * par une rotation caméra puis une division perspective.
 *
 * **Le tri en profondeur est ce qui fait la 3D.** Sans lui, le ruban se
 * dessinerait dans l'ordre des segments et les parties lointaines passeraient
 * par-dessus les proches quand la bande se croise. Les segments sont donc
 * groupés en tranches triées de l'arrière vers l'avant — grouper plutôt que
 * trier segment par segment conserve le rendu par lots, qui est ce qui tient
 * le budget de frame.
 *
 * La souris pilote la caméra (lacet et tangage) et la direction de la lumière.
 * Sans souris — tactile, ou `prefers-reduced-motion` — le ruban garde son
 * mouvement propre et une orientation neutre.
 */
export function TwistingRibbon({
  segments = 400,
  waveSpeed = 0.018,
  waveAmplitude = 1,
  twistCycles = 6,
  thickness = 0.42,
  mouseTilt = 0.42,
  colors = ["#5B8CFF", "#6E56CF", "#2ED3F6"],
  opacity = 0.5,
  className,
}: TwistingRibbonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const stops = colors.map(hexToRgb);

    // Tranches : compromis entre exactitude du tri et nombre d'appels de rendu.
    const CHUNKS = 48;
    const perChunk = Math.max(1, Math.floor(segments / CHUNKS));
    const chunkCount = Math.ceil(segments / perChunk);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let t = 0;

    // Cible et valeur amortie de l'orientation caméra.
    let targetYaw = 0;
    let targetPitch = 0;
    let yaw = 0;
    let pitch = 0;

    const px = new Float32Array(segments + 1);
    const py = new Float32Array(segments + 1);
    const tx = new Float32Array(segments + 1);
    const ty = new Float32Array(segments + 1);
    const bx = new Float32Array(segments + 1);
    const by = new Float32Array(segments + 1);
    const nz = new Float32Array(segments + 1);
    const depth = new Float32Array(segments + 1);
    const order = new Int32Array(chunkCount);
    const chunkDepth = new Float32Array(chunkCount);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Normalisé -1..1, sur toute la fenêtre : le ruban réagit même quand le
      // curseur est sous le bandeau.
      const nx = (e.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      targetYaw = Math.max(-1.6, Math.min(1.6, nx * 2)) * mouseTilt;
      targetPitch = Math.max(-1.6, Math.min(1.6, ny * 2)) * mouseTilt * 0.6;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;

      // Amortissement : la caméra suit le curseur sans le coller.
      yaw += (targetYaw - yaw) * 0.06;
      pitch += (targetPitch - pitch) * 0.06;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const span = width * 1.15;
      const half = height * thickness * 0.5;
      const amp = height * 0.15 * waveAmplitude;
      // Profondeur du serpentin en Z. Trop d'amplitude et le ruban part si loin
      // qu'il ne reste presque rien à l'écran une fois la perspective appliquée.
      const zAmp = height * 0.3;
      const focal = Math.max(width, 600) * 0.9;
      const cx = width * 0.5;
      const cy = height * 0.5;

      // Lumière : elle vient d'où pointe le curseur.
      const lightX = Math.sin(-yaw / Math.max(mouseTilt, 0.001) * 0.6);
      const lightZ = 0.9;

      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const twist = u * twistCycles * TAU + t;

        // Ligne médiane dans l'espace.
        let X = (u - 0.5) * span;
        let Y = Math.sin(u * TAU * 1.5 - t * 1.4) * amp;
        let Z = Math.cos(u * TAU * 0.8 + t * 0.55) * zAmp;

        // Vecteur d'épaisseur : il tourne dans le plan YZ, c'est la torsion.
        let hy = Math.cos(twist) * half;
        let hz = Math.sin(twist) * half;

        // Rotation caméra : lacet autour de Y, puis tangage autour de X.
        let x1 = X * cosY + Z * sinY;
        let z1 = -X * sinY + Z * cosY;
        let y1 = Y;
        const y2 = y1 * cosP - z1 * sinP;
        const z2 = y1 * sinP + z1 * cosP;

        // Le vecteur d'épaisseur subit la même rotation (composante X nulle).
        const hz1 = hz * cosY;
        const hx1 = hz * sinY;
        const hy2 = hy * cosP - hz1 * sinP;
        const hz2 = hy * sinP + hz1 * cosP;

        const zc = z2 + focal * 2;
        const s = focal / Math.max(zc, 1);

        px[i] = cx + x1 * s;
        py[i] = cy + y2 * s;

        const hxs = hx1 * s;
        const hys = hy2 * s;
        tx[i] = px[i] + hxs;
        ty[i] = py[i] + hys;
        bx[i] = px[i] - hxs;
        by[i] = py[i] - hys;

        // La normale de la face est colinéaire au vecteur d'épaisseur tourné
        // de 90° : sa composante Z donne l'éclairement.
        const n = -hz2 / Math.max(half, 1);
        nz[i] = n * lightZ + (hx1 / Math.max(half, 1)) * lightX;
        depth[i] = z2;
      }

      for (let c = 0; c < chunkCount; c++) {
        const a = c * perChunk;
        const b = Math.min(segments, a + perChunk);
        let d = 0;
        for (let i = a; i <= b; i++) d += depth[i];
        chunkDepth[c] = d / (b - a + 1);
        order[c] = c;
      }
      // Peintre : du plus lointain au plus proche.
      const idx = Array.from(order).sort((p, q) => chunkDepth[q] - chunkDepth[p]);

      for (const c of idx) {
        const a = c * perChunk;
        const b = Math.min(segments, a + perChunk);
        if (b <= a) continue;

        const mid = (a + b) >> 1;
        const [r, g, bl] = sampleRamp(stops, mid / segments);
        // Éclairement : la face qui s'éloigne s'assombrit, celle qui se
        // présente à la lumière s'éclaircit.
        const lit = 0.45 + 0.55 * Math.min(1, Math.abs(nz[mid]));
        const shade = nz[mid] >= 0 ? lit : lit * 0.5;

        ctx.fillStyle = `rgb(${(r * shade) | 0},${(g * shade) | 0},${(bl * shade) | 0})`;
        ctx.beginPath();
        ctx.moveTo(tx[a], ty[a]);
        for (let i = a + 1; i <= b; i++) ctx.lineTo(tx[i], ty[i]);
        for (let i = b; i >= a; i--) ctx.lineTo(bx[i], by[i]);
        ctx.closePath();
        ctx.fill();
      }

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
    if (fine && !reduced) window.addEventListener("mousemove", onMove, { passive: true });

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [
    segments,
    waveSpeed,
    waveAmplitude,
    twistCycles,
    thickness,
    mouseTilt,
    colors,
    opacity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className ?? "block h-full w-full"}
    />
  );
}

export default TwistingRibbon;
