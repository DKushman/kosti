import { waitForRouteCommit } from "@/lib/route-ready";

export const PAGE_ENTER = "site:page-enter";

let lastDispatchedPath = "";
let lastDispatchedAt = 0;

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

/** Fired once the new route is visible (after the curtain / menu exit). */
export function dispatchPageEnter(pathname?: string) {
  if (typeof window === "undefined") return;
  lastDispatchedPath = normalizePath(
    pathname ?? window.location.pathname ?? ""
  );
  lastDispatchedAt = Date.now();
  window.dispatchEvent(new CustomEvent(PAGE_ENTER));
}

export function onPageEnter(handler: () => void, pathname?: string) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(PAGE_ENTER, handler);

  const normalized = pathname ? normalizePath(pathname) : "";
  if (
    normalized &&
    lastDispatchedPath === normalized &&
    Date.now() - lastDispatchedAt < 5000
  ) {
    requestAnimationFrame(() => handler());
  }

  return () => window.removeEventListener(PAGE_ENTER, handler);
}

type RouteReadyOpts = {
  timeoutMs?: number;
  /** Wait until #main has swapped in (menu navigations). */
  requireMain?: boolean;
  /** Target pathname (menu nav) — resolve once URL + #main match. */
  expectedPath?: string;
  /** Menu nav: wait until template commit after this timestamp. */
  sinceMs?: number;
};

const raf = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Resolve once fonts, layout, and key media on the new route are ready (capped). */
export async function waitForRouteReady(opts: RouteReadyOpts = {}) {
  const timeoutMs = opts.timeoutMs ?? 1000;
  const requireMain = opts.requireMain ?? false;
  const expectedPath = opts.expectedPath
    ? normalizePath(opts.expectedPath)
    : "";
  const sinceMs = opts.sinceMs ?? 0;

  await Promise.race([
    (async () => {
      if (expectedPath && sinceMs > 0) {
        await waitForRouteCommit(expectedPath, sinceMs, timeoutMs);
      }

      if (expectedPath || requireMain) {
        for (let i = 0; i < 48; i++) {
          const main = document.querySelector("#main");
          const pathOk =
            !expectedPath ||
            normalizePath(window.location.pathname) === expectedPath;
          if (pathOk && main?.childElementCount) break;
          await raf();
        }
      }

      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }

      const heroImg = document.querySelector<HTMLImageElement>(
        ".page-transition [data-hero-img], .page-transition [data-hero-portrait]"
      );
      if (heroImg && !heroImg.complete) {
        await Promise.race([
          new Promise<void>((resolve) => {
            heroImg.addEventListener("load", () => resolve(), { once: true });
            heroImg.addEventListener("error", () => resolve(), { once: true });
          }),
          new Promise<void>((resolve) => window.setTimeout(resolve, 480)),
        ]);
      }

      await raf();
      await raf();
    })(),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}
