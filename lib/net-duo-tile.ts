import { type MouseEvent, useCallback, useEffect, useRef } from "react";

export type NetDuoTileEl = HTMLAnchorElement & {
  __netDuoRaf?: number;
  __netDuoClientY?: number;
};

function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function contentEl(tile: HTMLElement) {
  return tile.querySelector<HTMLElement>(".net-duo__content");
}

function centerY(tile: HTMLElement) {
  const content = contentEl(tile);
  if (!content) return;
  content.style.setProperty("--net-duo-y", `${tile.offsetHeight / 2}px`);
}

function setContentAtCursor(tile: HTMLElement, clientY: number) {
  const content = contentEl(tile);
  if (!content) return;
  const rect = tile.getBoundingClientRect();
  const half = content.offsetHeight * 0.5;
  const inset = 12;
  const y = clientY - rect.top;
  const minY = half + inset;
  const maxY = rect.height - half - inset;
  const clamped = Math.max(minY, Math.min(maxY, y));
  content.style.setProperty("--net-duo-y", `${clamped}px`);
}

function scheduleCursorY(tile: NetDuoTileEl, clientY: number) {
  tile.__netDuoClientY = clientY;
  if (tile.__netDuoRaf) return;
  tile.__netDuoRaf = requestAnimationFrame(() => {
    tile.__netDuoRaf = 0;
    if (tile.__netDuoClientY == null) return;
    setContentAtCursor(tile, tile.__netDuoClientY);
  });
}

/** Cursor-following content block on `.net-duo__tile` (shared with article next reads). */
export function useNetDuoTiles() {
  const reducedRef = useRef<boolean | null>(null);
  const observersRef = useRef<Map<string, ResizeObserver>>(new Map());

  const reduced = useCallback(() => {
    if (reducedRef.current == null) reducedRef.current = isReducedMotion();
    return reducedRef.current;
  }, []);

  const bindTile = useCallback((id: string, tile: NetDuoTileEl | null) => {
    const prev = observersRef.current.get(id);
    if (prev) {
      prev.disconnect();
      observersRef.current.delete(id);
    }
    if (!tile) return;
    centerY(tile);
    const ro = new ResizeObserver(() => {
      if (!tile.classList.contains("is-cursor-active")) centerY(tile);
    });
    ro.observe(tile);
    observersRef.current.set(id, ro);
  }, []);

  useEffect(() => {
    const observers = observersRef.current;
    return () => {
      observers.forEach((ro) => ro.disconnect());
      observers.clear();
    };
  }, []);

  const onMouseEnter = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (reduced()) return;
      e.currentTarget.classList.add("is-cursor-active");
      setContentAtCursor(e.currentTarget, e.clientY);
    },
    [reduced]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (reduced()) return;
      scheduleCursorY(e.currentTarget as NetDuoTileEl, e.clientY);
    },
    [reduced]
  );

  const onMouseLeave = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    const tile = e.currentTarget as NetDuoTileEl;
    tile.classList.remove("is-cursor-active");
    if (tile.__netDuoRaf) {
      cancelAnimationFrame(tile.__netDuoRaf);
      tile.__netDuoRaf = 0;
    }
    tile.__netDuoClientY = undefined;
    centerY(tile);
  }, []);

  return { bindTile, onMouseEnter, onMouseMove, onMouseLeave };
}
