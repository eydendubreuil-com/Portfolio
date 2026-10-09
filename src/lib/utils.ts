type ClassValue = string | number | null | false | undefined | ClassValue[];

/**
 * Concatène des classes conditionnelles.
 *
 * Version minimale volontaire : pas de `clsx` ni `tailwind-merge`, pour ne pas
 * alourdir un bundle déjà au-dessus du budget du brief. Conséquence à connaître :
 * en cas de classes Tailwind concurrentes (`p-4` passé par-dessus un `p-8` de
 * base), la dernière déclarée dans le CSS gagne, pas la dernière passée ici.
 * Si ce comportement devient nécessaire, installer `tailwind-merge`.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    out.push(String(value));
  };

  inputs.forEach(walk);
  return out.join(" ");
}
