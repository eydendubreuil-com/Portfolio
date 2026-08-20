import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

/**
 * Envoi via Resend si RESEND_API_KEY et CONTACT_TO_EMAIL sont définis dans Vercel.
 * Sans ces variables, la route répond proprement au lieu d'échouer en silence :
 * le visiteur est invité à écrire directement à l'adresse affichée.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Formulaire invalide.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot rempli => robot. On répond 200 pour ne rien lui apprendre.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        error:
          "L'envoi n'est pas encore configuré. Écris-moi directement par e-mail en attendant.",
      },
      { status: 503 },
    );
  }

  const { name, email, subject, message } = parsed.data;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `[Portfolio] ${subject}`,
      text: `De : ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessaie, ou écris-moi directement par e-mail." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
