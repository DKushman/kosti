"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";

type Role = "Kollaboration" | "Frage";

const ROLES: Role[] = ["Kollaboration", "Frage"];

export default function ContactForm() {
  const [role, setRole] = useState<Role | null>(null);
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role) {
      return;
    }
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const org = String(fd.get("org") ?? "").trim();
    const timeframe = String(fd.get("timeframe") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const chosenRole = role;

    const subject = `Kontakt: ${chosenRole}${name ? ` — ${name}` : ""}`;
    const lines = [
      `Rolle: ${chosenRole}`,
      name && `Name: ${name}`,
      email && `E-Mail: ${email}`,
      org && `Organisation: ${org}`,
      timeframe && `Zeitrahmen: ${timeframe}`,
      "",
      message || "(Keine Nachricht)",
    ].filter(Boolean);

    const body = lines.join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-name">
          Wie heißt du?
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          className="contact-form__input"
          autoComplete="name"
          placeholder="Vor- und Nachname"
          required
        />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-email">
          Deine E-Mail-Adresse
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          className="contact-form__input"
          autoComplete="email"
          placeholder={SITE.email}
          required
        />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-org">
          Organisation <span className="contact-form__optional">(optional)</span>
        </label>
        <input
          id="contact-org"
          name="org"
          type="text"
          className="contact-form__input"
          autoComplete="organization"
          placeholder="Unternehmen, Initiative, Verein …"
        />
      </div>

      <fieldset className="contact-form__field contact-form__field--roles">
        <legend className="contact-form__label">Worum geht es?</legend>
        <div className="contact-form__pills" role="group" aria-label="Rolle">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              className={`contact-form__pill${role === r ? " is-active" : ""}`}
              aria-pressed={role === r}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <input type="hidden" name="role" value={role ?? ""} />
      </fieldset>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-timeframe">
          Gibt es einen Zeitrahmen? <span className="contact-form__optional">(optional)</span>
        </label>
        <input
          id="contact-timeframe"
          name="timeframe"
          type="text"
          className="contact-form__input"
          placeholder="z. B. Herbst 2026"
        />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-message">
          Erzähl mir von deiner Idee oder deiner Frage
        </label>
        <textarea
          id="contact-message"
          name="message"
          className="contact-form__input contact-form__input--area"
          rows={4}
          placeholder="Projekt, Kooperation, Netzwerk — alles, womit Berlin weiterkommt."
          required
        />
      </div>

      <div className="contact-form__actions">
        <button type="submit" className="btn-fill">
          Nachricht senden
        </button>
      </div>
    </form>
  );
}
