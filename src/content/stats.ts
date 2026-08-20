export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  isDecimal?: boolean;
}

/** Chiffres réels uniquement. Un chiffre non vérifié ne figure pas ici. */
export const stats: Stat[] = [
  { value: 7, label: "Projets construits" },
  { value: 5, label: "Projets en ligne" },
  { value: 25, suffix: "+", label: "Clients (MindSet)" },
  { value: 15, label: "E-books écrits" },
  { value: 2, label: "Packs de formation" },
  { value: 4.9, label: "Note moyenne", isDecimal: true },
];
