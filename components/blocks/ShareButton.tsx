"use client";

import { useState } from "react";
import { setFillOrigin } from "@/lib/set-fill-origin";

type Props = {
  title: string;
  url: string;
  /** Compact icon control for article meta row. */
  variant?: "button" | "icon";
};

function ShareIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M8.5 10.8 15.2 6.5M8.5 13.2l6.7 4.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Web Share API with clipboard fallback. */
export default function ShareButton({ title, url, variant = "button" }: Props) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setState("copied");
      window.setTimeout(() => setState("idle"), 2000);
    } catch {
      // user cancelled
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        className="article__share"
        aria-label={state === "copied" ? "Link kopiert" : "Beitrag teilen"}
        title={state === "copied" ? "Link kopiert" : "Teilen"}
        onClick={share}
      >
        <ShareIcon />
        <span className="visually-hidden">
          {state === "copied" ? "Link kopiert" : "Teilen"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn-fill btn-fill--sm"
      onMouseEnter={(e) =>
        setFillOrigin(e.currentTarget, e.clientX, e.clientY)
      }
      onClick={share}
    >
      {state === "copied" ? "Link kopiert" : "Teilen"}
    </button>
  );
}
