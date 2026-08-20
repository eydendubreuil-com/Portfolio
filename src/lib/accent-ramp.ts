/**
 * Volontairement hors de GlowBorderCard.tsx, qui est un module "use client" :
 * un composant serveur (Focus.tsx) ne peut pas appeler une fonction exportée
 * par un module client — le build échoue au prerender.
 */

/**
 * Construit une rampe de 10 teintes autour d'un accent projet.
 *
 * La leçon des essais précédents : le flou moyenne les stops adjacents. Des
 * teintes trop pâles donnent du blanc, alterner clair et foncé donne du gris.
 * On fait donc varier **la teinte seulement** (± 14°), en verrouillant
 * saturation et luminosité dans une plage saturée et médiane. La moyenne reste
 * ainsi colorée quel que soit l'angle, et proche de l'accent d'origine. Un écart
 * plus large dérive vers une autre couleur : à ± 24°, l'or de MindSet virait au
 * vert-jaune.
 */
export function accentRamp(hex: string): string[] {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  h = (h * 60 + 360) % 360;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  // Verrouillage : assez saturé pour survivre au flou, assez clair pour se voir
  // sur le fond bleu nuit, pas au point de blanchir.
  const S = Math.min(0.92, Math.max(0.62, s));
  const L = Math.min(0.62, Math.max(0.5, l));

  const offsets = [0, 7, 14, 7, 0, -7, -14, -7, 0, 7];
  return offsets.map((o) => hslToHex((h + o + 360) % 360, S, L));
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0]
    : h < 120 ? [x, c, 0]
    : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c]
    : h < 300 ? [x, 0, c]
    : [c, 0, x];
  const to = (v: number) =>
    Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/**
 * `signature` reprend les accents de docs/STYLE.md et c'est le seul preset à
 * utiliser sur ce site : les autres sont conservés pour réemploi ailleurs, mais
 * un vert pomme ou un orange saturé casserait la palette bleu nuit.
 */
