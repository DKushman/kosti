"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { setFillOrigin } from "@/lib/set-fill-origin";

/** External (or plain) anchor with `.btn-fill` hover choreography. */
export default function FillAnchor({
  className,
  onMouseEnter,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = ["btn-fill", className].filter(Boolean).join(" ");

  return (
    <a
      className={cls}
      onMouseEnter={(e) => {
        setFillOrigin(e.currentTarget, e.clientX, e.clientY);
        onMouseEnter?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
