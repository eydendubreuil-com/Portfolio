import type { ReactNode } from "react";

/**
 * Rend `**gras**` et `*italique*` sans passer par `dangerouslySetInnerHTML`.
 *
 * Le contenu est stocké en texte brut avec ces deux marqueurs. Y stocker du
 * HTML aurait deux défauts : la chaîne ne serait plus réutilisable telle quelle
 * dans une métadonnée ou un JSON-LD (qui refusent les balises), et le rendu
 * passerait par une injection dont ce site n'a aucun besoin.
 *
 * Volontairement limité à deux marqueurs. Un analyseur Markdown complet ici
 * serait une dépendance de plus pour du gras et de l'italique.
 */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  // Un seul passage, alternance gras / italique : les deux ne s'imbriquent
  // jamais dans ce contenu, inutile de gérer un arbre.
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <strong key={k++} className="font-semibold text-ink">
          {m[1]}
        </strong>,
      );
    } else {
      out.push(
        <em key={k++} className="not-italic text-ink">
          {m[2]}
        </em>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));

  return <>{out}</>;
}

/** Même texte, débarrassé des marqueurs — pour les métadonnées et le JSON-LD. */
export function plainText(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}
