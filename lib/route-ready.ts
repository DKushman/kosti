function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

let committedPath = "";
let committedAt = 0;

/** Call before menu router.push so the next commit is unambiguous. */
export function invalidateRouteCommit() {
  committedAt = 0;
  committedPath = "";
}

/** Called from app/template when the target route’s client tree has committed. */
export function commitRoute(pathname: string) {
  committedPath = normalizePath(pathname);
  committedAt = Date.now();
}

const raf = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Wait until `commitRoute` fired for `expectedPath` after navigation started
 * (`sinceMs` = pending.startedAt from setPending).
 */
export async function waitForRouteCommit(
  expectedPath: string,
  _sinceMs: number,
  timeoutMs = 5000
): Promise<void> {
  const want = normalizePath(expectedPath);
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (committedPath === want && committedAt > 0) {
      await raf();
      await raf();
      return;
    }
    await raf();
  }
}
