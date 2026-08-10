"use client";

import { useCallback, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import Marquee from "@/components/Marquee";
import MenuOverlay from "@/components/MenuOverlay";

/**
 * Fixed site header: ticker tagline + menu toggle.
 * Gets a solid ink background once the hero is scrolled past.
 */
export default function Header() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.72,
        onEnter: () => root.current?.classList.add("is-solid"),
        onLeaveBack: () => root.current?.classList.remove("is-solid"),
      });
    },
    { scope: root }
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header" ref={root}>
        <div className="header__marquee">
          <Marquee text="Berlin · Stadtentwicklung · Nachhaltigkeit · Technologie · Sport" />
        </div>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-btn__icon" aria-hidden="true" />
          <span className="visually-hidden">{open ? "Close" : "Menu"}</span>
        </button>
      </header>
      <MenuOverlay open={open} onClose={closeMenu} />
    </>
  );
}
