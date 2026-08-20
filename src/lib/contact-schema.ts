import { z } from "zod";

/** Partagé par le formulaire client et la route API : une seule règle de validation. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indique ton nom (2 caractères minimum).")
    .max(80, "80 caractères maximum."),
  email: z.string().trim().email("Cette adresse e-mail n'est pas valide."),
  subject: z
    .string()
    .trim()
    .min(3, "Précise un sujet (3 caractères minimum).")
    .max(120, "120 caractères maximum."),
  message: z
    .string()
    .trim()
    .min(20, "Décris ta demande en 20 caractères minimum.")
    .max(4000, "4000 caractères maximum."),
  /** Piège à robots : doit rester vide. Masqué visuellement et aux lecteurs d'écran. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
