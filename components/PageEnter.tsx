"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { clearPending, getMenuHandlers, peekPending, revealPage } from "@/lib/curtain";
import { jumpToTarget, unlockScroll } from "@/lib/lenis-store";
import { dispatchPageEnter, waitForRouteReady } from "@/lib/page-enter";

type PageEnterProps = {
  children: React.ReactNode;
};

/**
 * Runs once per route change. If a curtain transition is pending, wait
 * for the new page to be ready, place the scroll position, then lift
 * the curtain (menu panels or page panels) to reveal the page.
 */
export default function PageEnter({ children }: PageEnterProps) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const pending = peekPending();
    if (!pending || pending.source === "menu") return;

    let cancelled = false;

    void (async () => {
      await waitForRouteReady({ timeoutMs: 1200 });
      if (cancelled) return;

      const again = peekPending();
      if (!again || again.source === "menu") return;

      jumpToTarget(again.hash || 0);
      ScrollTrigger.refresh();

      let entered = false;
      const fireEnter = () => {
        if (entered) return;
        entered = true;
        dispatchPageEnter(pathname);
      };

      await revealPage({ onRevealMid: fireEnter });
      clearPending();
      fireEnter();

      unlockScroll();
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  /* safety net: never leave the user behind a stuck curtain */
  useEffect(() => {
    const id = window.setInterval(() => {
      const p = peekPending();
      if (p && Date.now() - p.startedAt > 8000) {
        clearPending();
        document.documentElement.classList.remove("is-menu-navigating");
        void revealPage();
        void getMenuHandlers()?.exit();
        unlockScroll();
        dispatchPageEnter(window.location.pathname);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="page-transition" ref={root}>
      {children}
    </div>
  );
}
