"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { scheduleRefresh } from "@/lib/st-refresh";
import { clearPending, getMenuHandlers, peekPending } from "@/lib/curtain";
import { jumpToTarget, unlockScroll } from "@/lib/lenis-store";
import { dispatchPageEnter, waitForRouteReady } from "@/lib/page-enter";

/** Menu → page: wait for route, play enter, lift menu + content upward. */
export default function MenuRouteHandoff() {
  const pathname = usePathname();
  const running = useRef(false);

  useEffect(() => {
    const pending = peekPending();
    if (!pending || pending.source !== "menu") return;
    if (running.current) return;

    let cancelled = false;
    const targetPath = pending.path;
    const startedAt = pending.startedAt;
    running.current = true;

    void (async () => {
      try {
        await waitForRouteReady({
          timeoutMs: 5000,
          requireMain: true,
          expectedPath: targetPath,
          sinceMs: startedAt,
        });
        if (cancelled) return;

        const still = peekPending();
        if (!still || still.source !== "menu") return;
        if (still.path !== targetPath) return;

        jumpToTarget(still.hash || 0);
        scheduleRefresh();

        const menu = getMenuHandlers();
        if (menu) await menu.exit();

        clearPending();
        dispatchPageEnter(pathname);

        document.documentElement.classList.remove("is-menu-navigating");
        unlockScroll();
        scheduleRefresh();
      } finally {
        running.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
