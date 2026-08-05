/**
 * Mêmes valeurs que globals.css, exportées pour le TS (SVG, styles inline, meta).
 * docs/STYLE.md fait autorité : toute divergence se corrige ici, pas dans un composant.
 */

export const colors = {
  bg: "#050816",
  surface: "#0E1122",
  card: "#171B31",
  cardElevated: "#1E2440",
  line: "rgba(184,194,217,0.10)",
  lineStrong: "rgba(184,194,217,0.20)",
  ink: "#F4F6FB",
  inkMuted: "#B8C2D9",
  inkFaint: "#6C7590",
  primary: "#5B8CFF",
  secondary: "#6E56CF",
  accent: "#2ED3F6",
} as const;

export const projectAccents = {
  synthesia: "#6D5DFB",
  ecoleaf: "#34D399",
  mindset: "#C9A227",
  pawvolt: "#FF7A18",
} as const;

export const statusColors = {
  live: "#34D399",
  building: "#F5A524",
  planned: "#6C7590",
} as const;

export const gradientSignature =
  "linear-gradient(120deg, #5B8CFF 0%, #6E56CF 52%, #2ED3F6 100%)";

export const motionTokens = {
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.65, 0, 0.35, 1],
  durFast: 0.16,
  durBase: 0.42,
  durSlow: 0.9,
} as const;

export type ProjectAccent = keyof typeof projectAccents;
export type StatusKey = keyof typeof statusColors;
