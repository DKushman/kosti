"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { waitForRouteReady } from "@/lib/page-enter";
import { scrollToTarget } from "@/lib/lenis-store";
import { withBasePath } from "@/lib/site-path";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Netzwerk", href: "/netzwerk" },
  { label: "Sectors", href: "/#sectors" },
  { label: "Work", href: "/#work" },
  { label: "Studio", href: "/#studio" },
  { label: "Contact", href: "/#contact" },
];

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
};

function parseHref(href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) {
    return { path: href, hash: "" };
  }
  return {
    path: href.slice(0, hashIndex) || "/",
    hash: href.slice(hashIndex),
  };
}

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const root = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const pendingScroll = useRef<string | null>(null);
  const isNavigating = useRef(false);
  const targetPath = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const dismiss = useCallback(() => {
    isNavigating.current = false;
    targetPath.current = null;
    pendingScroll.current = null;
    onClose();
  }, [onClose]);

  const navigateFromMenu = (href: string) => {
    const { path, hash } = parseHref(href);

    if (path === pathname) {
      pendingScroll.current = hash || null;
      onClose();
      return;
    }

    isNavigating.current = true;
    targetPath.current = path;
    router.push(href);
  };

  useEffect(() => {
    if (!open) return;
    LINKS.forEach((link) => {
      const { path } = parseHref(link.href);
      if (path !== pathname) router.prefetch(path);
    });
  }, [open, pathname, router]);

  useEffect(() => {
    if (!isNavigating.current || pathname !== targetPath.current) return;

    let cancelled = false;

    void waitForRouteReady().then(() => {
      if (cancelled || !isNavigating.current) return;
      isNavigating.current = false;
      targetPath.current = null;
      onClose();
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, onClose]);

  useGSAP(
    () => {
      if (!root.current) return;
      const links = gsap.utils.toArray<HTMLElement>("[data-menu-link]");

      if (open) {
        wasOpen.current = true;
        const tl = gsap.timeline();
        tl.set(root.current, { visibility: "visible" })
          .to(root.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            ease: "power4.inOut",
          })
          .from(
            links,
            {
              yPercent: 110,
              opacity: 0,
              duration: 0.7,
              stagger: 0.06,
              ease: "power4.out",
              clearProps: "all",
            },
            "-=0.35"
          );
      } else if (wasOpen.current) {
        gsap.to(root.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.65,
          ease: "power4.inOut",
          onComplete: () => {
            gsap.set(root.current, { visibility: "hidden" });

            if (pendingScroll.current) {
              const hash = pendingScroll.current;
              pendingScroll.current = null;
              requestAnimationFrame(() => scrollToTarget(hash));
            }
          },
        });
      } else {
        gsap.set(root.current, {
          visibility: "hidden",
          clipPath: "inset(0% 0% 100% 0%)",
        });
      }
    },
    { scope: root, dependencies: [open] }
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  return (
    <nav
      className="menu"
      id="site-menu"
      ref={root}
      aria-label="Main navigation"
      aria-hidden={!open}
    >
      <button
        type="button"
        className="menu__close"
        aria-label="Menü schließen"
        onClick={dismiss}
        tabIndex={open ? 0 : -1}
      >
        <span className="menu__close-icon" aria-hidden="true" />
      </button>

      <ul className="menu__list" role="list">
        {LINKS.map((link, i) => (
          <li key={link.href}>
            <a
              className="menu__link display"
              data-menu-link
              href={withBasePath(link.href)}
              onClick={(event) => {
                event.preventDefault();
                navigateFromMenu(link.href);
              }}
              tabIndex={open ? 0 : -1}
            >
              <span className="menu__num">0{i + 1}</span>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="menu__meta">
        <span>Berlin — 52.51° N, 13.40° E</span>
        <a href="mailto:hello@halle.studio" tabIndex={open ? 0 : -1}>
          hello@halle.studio
        </a>
        <span>Est. 2004</span>
      </div>
    </nav>
  );
}
