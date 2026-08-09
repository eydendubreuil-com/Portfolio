"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { Magnetic } from "@/components/ui/Magnetic";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

const fieldClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-bg px-4 py-3 " +
  "text-ink placeholder:text-ink-faint transition-colors duration-200 " +
  "hover:border-[var(--line-strong)] focus:border-primary";

/**
 * Chargé dynamiquement par Contact.tsx : react-hook-form + zod sortent ainsi
 * du bundle initial (budget < 120 kB au premier chargement).
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ kind: "error", message: body.error ?? "L'envoi a échoué." });
        return;
      }
      reset();
      setStatus({ kind: "sent", message: "Message envoyé. Je te réponds vite." });
    } catch {
      setStatus({
        kind: "error",
        message: "Connexion impossible. Écris-moi directement par e-mail.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Piège à robots : hors flux, invisible, ignoré des lecteurs d'écran. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label htmlFor="name" className="eyebrow mb-2 block">
          Nom
        </label>
        <input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={fieldClass}
          {...register("name")}
        />
        {errors.name ? (
          <p id="name-error" className="mt-2 text-sm text-status-building">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="eyebrow mb-2 block">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={fieldClass}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="mt-2 text-sm text-status-building">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="subject" className="eyebrow mb-2 block">
          Sujet
        </label>
        <input
          id="subject"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={fieldClass}
          {...register("subject")}
        />
        {errors.subject ? (
          <p id="subject-error" className="mt-2 text-sm text-status-building">
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="eyebrow mb-2 block">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-sm text-status-building">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Magnétique : c'est le bouton qui décide de la conversion du site. */}
      <Magnetic>
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="inline-flex h-12 items-center justify-center rounded-[var(--radius-sm)]
                   bg-ink px-6 text-[0.95rem] font-semibold text-bg
                   transition-opacity duration-200 hover:opacity-90
                   disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.kind === "sending" ? "Envoi…" : "Envoyer"}
      </button>
      </Magnetic>

      <p
        aria-live="polite"
        className={`min-h-[1.5rem] text-sm ${
          status.kind === "error" ? "text-status-building" : "text-status-live"
        }`}
      >
        {status.message ?? ""}
      </p>
    </form>
  );
}
