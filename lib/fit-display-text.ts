/** Scale display type to fill the available width on one line. */
export function fitDisplayText(el: HTMLElement) {
  const width = el.parentElement?.clientWidth || el.clientWidth;
  if (width <= 0) return;

  el.style.fontSize = "";
  el.style.width = "100%";

  let min = 8;
  let max = Math.min(480, Math.ceil(width * 1.2));

  while (min < max) {
    const mid = Math.ceil((min + max) / 2);
    el.style.fontSize = `${mid}px`;

    if (el.scrollWidth > width + 0.5) {
      max = mid - 1;
    } else {
      min = mid;
    }
  }

  el.style.fontSize = `${min}px`;
}

/**
 * Fit a group of labels to one shared size so none overflow their row.
 * Text width scales linearly with font-size (letter-spacing is em-based),
 * so one reference measurement gives the answer; a short verify loop then
 * lands on the same integer pixel size the old binary search produced,
 * with ~3 forced layouts instead of ~45.
 */
export function fitSectorNames(els: HTMLElement[]) {
  if (!els.length) return;

  const width =
    els[0].closest(".sectors__link")?.clientWidth ||
    els[0].parentElement?.clientWidth ||
    els[0].clientWidth;
  if (width <= 0) return;

  const REF = 100;
  const MIN = 8;
  const cap = Math.min(480, Math.ceil(width * 1.2));

  const apply = (px: number) => {
    els.forEach((el) => {
      el.style.fontSize = `${px}px`;
    });
  };
  const fits = () => els.every((el) => el.scrollWidth <= width + 0.5);

  els.forEach((el) => {
    el.style.width = "100%";
  });
  apply(REF);
  const widest = Math.max(...els.map((el) => el.scrollWidth));
  if (widest <= 0) return;

  let size = Math.min(cap, Math.max(MIN, Math.floor((REF * width) / widest)));

  apply(size);
  let guard = 0;
  while (!fits() && size > MIN && guard++ < 12) {
    size -= 1;
    apply(size);
  }
  guard = 0;
  while (size < cap && guard++ < 12) {
    apply(size + 1);
    if (!fits()) break;
    size += 1;
  }
  apply(size);
}

/** Fit primary name full-width; secondary line scales relative to it. */
export function fitHeroTitle(primary: HTMLElement, secondary: HTMLElement) {
  fitDisplayText(primary);
  const primarySize = parseFloat(getComputedStyle(primary).fontSize);
  if (Number.isFinite(primarySize)) {
    secondary.style.fontSize = `${Math.round(primarySize * 0.36)}px`;
  }
}
