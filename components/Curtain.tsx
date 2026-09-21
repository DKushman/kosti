"use client";

import { useEffect, useRef } from "react";
import { registerPagePanels, resetPanels } from "@/lib/curtain";

/**
 * Page-transition curtain: gold → slate → navy rise from the bottom,
 * then lift away top-most first once the next route is ready.
 */
export default function Curtain() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panels = Array.from(el.children) as HTMLElement[];
    resetPanels(panels, "bottom");
    return registerPagePanels(panels);
  }, []);

  return (
    <div className="curtain" ref={root} aria-hidden="true">
      <div className="curtain__panel curtain__panel--gold" />
      <div className="curtain__panel curtain__panel--slate" />
      <div className="curtain__panel curtain__panel--navy" />
    </div>
  );
}
