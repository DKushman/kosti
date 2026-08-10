export const PAGE_ENTER = "site:page-enter";

export function dispatchPageEnter() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PAGE_ENTER));
}

export function onPageEnter(handler: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PAGE_ENTER, handler);
  return () => window.removeEventListener(PAGE_ENTER, handler);
}

export async function waitForRouteReady(timeoutMs = 1200) {
  await Promise.race([
    (async () => {
      try {
        await document.fonts.ready;
      } catch {
        // ignore
      }

      const heroImg = document.querySelector<HTMLImageElement>(
        ".page-transition [data-hero-img]"
      );
      if (heroImg && !heroImg.complete) {
        await new Promise<void>((resolve) => {
          heroImg.addEventListener("load", () => resolve(), { once: true });
          heroImg.addEventListener("error", () => resolve(), { once: true });
        });
      }

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    })(),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}
