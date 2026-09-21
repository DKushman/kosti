"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import {
  CURTAIN,
  coverWith,
  registerMenu,
  resetPanels,
  revealFrom,
} from "@/lib/curtain";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/lenis-store";
import { useNavigation } from "@/lib/navigation";
import { FOOTER_LINKS, MENU_LINKS, SITE } from "@/lib/site";
import { InstagramIcon, LinkedInIcon } from "@/components/SocialIcons";
import TransitionLink from "@/components/TransitionLink";

function MenuNavLink({
  href,
  label,
  menuOpen,
}: {
  href: string;
  label: string;
  menuOpen: boolean;
}) {
  return (
    <TransitionLink
      className="menu__link display"
      href={href}
      source="menu"
      tabIndex={menuOpen ? 0 : -1}
      aria-label={label}
    >
      <span className="menu__link-window" aria-hidden="true">
        <span className="menu__link-roll">
          <span>{label}</span>
          <span>{label}</span>
        </span>
      </span>
    </TransitionLink>
  );
}

export default function MenuOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const actionId = useRef(0);
  const [hydrated, setHydrated] = useState(false);
  const [contentHidden, setContentHidden] = useState(true);

  const { menuOpen, closeMenu, closeMenuSilently, silentClose, pendingHash } =
    useNavigation();

  const panels = useCallback(
    () =>
      panelsRef.current
        ? (Array.from(panelsRef.current.children) as HTMLElement[])
        : [],
    []
  );

  const contentItems = useCallback(
    () =>
      contentRef.current
        ? gsap.utils.toArray<HTMLElement>(
            "[data-menu-item]",
            contentRef.current
          )
        : [],
    []
  );

  const linkRolls = useCallback(
    () =>
      contentRef.current
        ? gsap.utils.toArray<HTMLElement>(
            ".menu__link-roll",
            contentRef.current
          )
        : [],
    []
  );

  const killAll = useCallback(() => {
    const content = contentRef.current;
    gsap.killTweensOf([
      ...panels(),
      ...contentItems(),
      ...linkRolls(),
      ...(content ? [content] : []),
      ...(rootRef.current ? [rootRef.current] : []),
    ]);
  }, [contentItems, linkRolls, panels]);

  const clearContentStyles = useCallback(() => {
    const content = contentRef.current;
    if (content) gsap.set(content, { clearProps: "all" });
    gsap.set(contentItems(), { clearProps: "all", autoAlpha: 1, y: 0 });
    gsap.set(linkRolls(), { clearProps: "transform", autoAlpha: 1 });
  }, [contentItems, linkRolls]);

  const hideMenu = useCallback(() => {
    const ps = panels();
    killAll();
    clearContentStyles();
    setContentHidden(true);
    resetPanels(ps, "top");
    gsap.set(rootRef.current, { visibility: "hidden", pointerEvents: "none" });
  }, [clearContentStyles, killAll, panels]);

  const animateContentIn = useCallback(
    (id: number) => {
      if (actionId.current !== id) return;
      gsap.to(linkRolls(), {
        yPercent: 0,
        duration: 0.92,
        stagger: 0.07,
        ease: "power4.out",
        clearProps: "transform",
      });
      gsap.to(contentItems(), {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.75,
        stagger: 0.045,
        ease: "power4.out",
        delay: 0.08,
        clearProps: "transform",
      });
    },
    [contentItems, linkRolls]
  );

  const openMenuAnim = useCallback(async () => {
    const id = ++actionId.current;
    const ps = panels();
    if (!ps.length) return;

    killAll();
    setContentHidden(true);
    lockScroll();
    wasOpenRef.current = true;

    gsap.set(rootRef.current, { visibility: "visible", pointerEvents: "auto" });
    gsap.set(contentItems(), { autoAlpha: 0, yPercent: 40 });
    gsap.set(linkRolls(), { yPercent: 100, autoAlpha: 0 });

    const { covered } = coverWith(ps, "top");
    await covered;
    if (actionId.current !== id) return;

    setContentHidden(false);
    gsap.set(linkRolls(), { autoAlpha: 1 });
    animateContentIn(id);
  }, [animateContentIn, contentItems, killAll, linkRolls, panels]);

  const closeMenuAnim = useCallback(
    async (fromNavigation = false) => {
      const id = ++actionId.current;
      const ps = panels();
      const content = contentRef.current;
      if (!ps.length) return;

      killAll();
      gsap.set(rootRef.current, { pointerEvents: "none" });
      gsap.to(contentItems(), {
        autoAlpha: 0,
        yPercent: -30,
        duration: 0.35,
        stagger: 0.02,
        ease: "power2.in",
      });
      gsap.to(linkRolls(), {
        yPercent: -100,
        duration: 0.35,
        stagger: 0.02,
        ease: "power2.in",
      });

      await Promise.all([
        revealFrom(ps),
        content
          ? new Promise<void>((resolve) => {
              gsap.to(content, {
                yPercent: -100,
                duration: CURTAIN.reveal.duration,
                ease: CURTAIN.reveal.ease,
                onComplete: resolve,
              });
            })
          : Promise.resolve(),
      ]);

      if (actionId.current !== id) return;

      hideMenu();
      wasOpenRef.current = false;

      if (!fromNavigation) {
        unlockScroll();
        if (pendingHash.current) {
          const hash = pendingHash.current;
          pendingHash.current = null;
          requestAnimationFrame(() =>
            scrollToTarget(hash === "#top" ? 0 : hash)
          );
        }
      }
    },
    [contentItems, hideMenu, killAll, linkRolls, panels, pendingHash]
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  const openRef = useRef(openMenuAnim);
  const closeRef = useRef(closeMenuAnim);
  const hideRef = useRef(hideMenu);
  openRef.current = openMenuAnim;
  closeRef.current = closeMenuAnim;
  hideRef.current = hideMenu;

  useEffect(() => {
    if (!hydrated) return;
    hideRef.current();
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    if (menuOpen) {
      void openRef.current();
      return;
    }

    if (silentClose.current) {
      silentClose.current = false;
      hideRef.current();
      wasOpenRef.current = false;
      unlockScroll();
      return;
    }

    if (wasOpenRef.current) {
      void closeRef.current(false);
    }
  }, [menuOpen, hydrated]);

  const closeNavRef = useRef(closeMenuAnim);
  const silentCloseRef = useRef(closeMenuSilently);
  closeNavRef.current = closeMenuAnim;
  silentCloseRef.current = closeMenuSilently;

  useEffect(() => {
    return registerMenu({
      exit: () =>
        closeNavRef.current(true).then(() => silentCloseRef.current()),
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <div
      className={`menu${contentHidden ? " is-content-hidden" : ""}`}
      id="site-menu"
      ref={rootRef}
      aria-hidden={!menuOpen}
      suppressHydrationWarning
    >
      <div className="menu__panels" ref={panelsRef} aria-hidden="true">
        <div className="menu__panel menu__panel--navy" />
        <div className="menu__panel menu__panel--slate" />
        <div className="menu__panel menu__panel--gold" />
      </div>

      <div className="menu__content" ref={contentRef}>
        <div className="menu__layout">
          <aside className="menu__side" data-menu-item>
            <ul className="menu__socials" role="list">
              <li>
                <a
                  className="menu__social"
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <InstagramIcon size={26} />
                </a>
              </li>
              <li>
                <a
                  className="menu__social"
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <LinkedInIcon size={26} />
                </a>
              </li>
            </ul>
          </aside>

          <nav className="menu__nav" aria-label="Hauptnavigation">
            <ul className="menu__list" role="list">
              {MENU_LINKS.map((link) => (
                <li key={link.href}>
                  <MenuNavLink
                    href={link.href}
                    label={link.label}
                    menuOpen={menuOpen}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <footer className="menu__foot" data-menu-item>
          <nav className="menu__legal" aria-label="Rechtliches">
            {FOOTER_LINKS.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                source="menu"
                className="menu__legal-link"
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>
          <p className="menu__coords">{SITE.location}</p>
        </footer>
      </div>
    </div>
  );
}
