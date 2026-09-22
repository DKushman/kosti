"use client";

import { useEffect, useRef } from "react";
import { scheduleRefresh } from "@/lib/st-refresh";
import { getLenis } from "@/lib/lenis-store";
import { useNavigation } from "@/lib/navigation";
import { SITE } from "@/lib/site";
import { withBasePath } from "@/lib/site-path";
import MenuOverlay from "@/components/MenuOverlay";
import TransitionLink from "@/components/TransitionLink";

const BRAND_LOGO = withBasePath("/img/logo%20kosti.svg");

function headerSolidThreshold() {
  return window.innerHeight * 0.72;
}

function syncHeaderSolid(el: HTMLElement) {
  const y = getLenis()?.scroll ?? window.scrollY;
  el.classList.toggle("is-solid", y >= headerSolidThreshold());
}

/**
 * Fixed site header: logo (left) · menu (right). Turns solid once the
 * hero is scrolled past; sits above the menu curtain and flips to
 * ink-on-gold while the menu is open.
 */
export default function Header() {
  const root = useRef<HTMLElement>(null);
  const menuOpenRef = useRef(false);
  const { menuOpen, toggleMenu } = useNavigation();

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    if (menuOpen || !root.current) return;
    requestAnimationFrame(() => {
      if (root.current) syncHeaderSolid(root.current);
      scheduleRefresh();
    });
  }, [menuOpen]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const onScroll = () => {
      if (menuOpenRef.current) return;
      syncHeaderSolid(el);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    getLenis()?.on("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <header
        className={`header${menuOpen ? " is-menu-open" : ""}`}
        suppressHydrationWarning
        ref={root}
      >
        <TransitionLink href="/" className="brand" aria-label="Zur Startseite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND_LOGO}
            alt={SITE.name}
            className="brand__logo"
            width={314}
            height={200}
            decoding="async"
            draggable={false}
          />
        </TransitionLink>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
          onClick={toggleMenu}
        >
          <span className="menu-btn__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </header>
      <MenuOverlay />
    </>
  );
}
