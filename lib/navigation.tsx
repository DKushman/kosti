"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { coverPage, peekPending, setPending } from "@/lib/curtain";
import { invalidateRouteCommit } from "@/lib/route-ready";
import { lockScroll, scrollToTarget } from "@/lib/lenis-store";
import { NAV_LINKS } from "@/lib/site";
import MenuRouteHandoff from "@/components/MenuRouteHandoff";

type NavigationState = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  /** Close without running the close animation (curtain already lifted). */
  closeMenuSilently: () => void;
  silentClose: React.MutableRefObject<boolean>;
  /** Navigate with the colour curtain. `source` picks the choreography. */
  navigate: (href: string, source?: "page" | "menu") => void;
  /** Hash to scroll to once the menu finished closing on the same page. */
  pendingHash: React.MutableRefObject<string | null>;
};

const NavigationContext = createContext<NavigationState | null>(null);

export function parseHref(href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return { path: href, hash: "" };
  return {
    path: href.slice(0, hashIndex) || "/",
    hash: href.slice(hashIndex),
  };
}

function normalize(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const silentClose = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const busy = useRef(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeMenuSilently = useCallback(() => {
    silentClose.current = true;
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    NAV_LINKS.forEach((link) => router.prefetch(link.href));
  }, [router]);

  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  /** Route change with menu open (logo, links, etc.) — close overlay; menu handoff handles its own exit. */
  useEffect(() => {
    if (peekPending()?.source === "menu") return;
    if (!menuOpenRef.current) return;
    silentClose.current = true;
    setMenuOpen(false);
  }, [pathname]);

  const navigate = useCallback(
    (href: string, source: "page" | "menu" = "page") => {
      const { path, hash } = parseHref(href);
      const samePage = normalize(path) === normalize(pathname);

      if (samePage) {
        if (menuOpen) {
          pendingHash.current = hash || "#top";
          setMenuOpen(false);
        } else {
          scrollToTarget(hash || 0);
        }
        return;
      }

      if (busy.current) return;
      busy.current = true;
      window.setTimeout(() => (busy.current = false), 2500);

      lockScroll();
      setPending({ source, hash, path: normalize(path) });

      if (source === "menu") {
        invalidateRouteCommit();
        document.documentElement.classList.add("is-menu-navigating");
        router.prefetch(path);
        router.push(href);
        return;
      }

      if (menuOpen) {
        silentClose.current = true;
        setMenuOpen(false);
      }

      /* fetch the route while the curtain is still closing */
      router.prefetch(path);
      const { covered } = coverPage();
      void covered.then(() => router.push(href));
    },
    [menuOpen, pathname, router]
  );

  const value = useMemo<NavigationState>(
    () => ({
      menuOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      closeMenuSilently,
      silentClose,
      navigate,
      pendingHash,
    }),
    [menuOpen, openMenu, closeMenu, toggleMenu, closeMenuSilently, navigate]
  );

  return (
    <NavigationContext.Provider value={value}>
      <MenuRouteHandoff />
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used inside NavigationProvider");
  return ctx;
}
