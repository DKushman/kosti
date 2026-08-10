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

/** Fit a group of labels to one shared size so none overflow their row. */
export function fitSectorNames(els: HTMLElement[]) {
  if (!els.length) return;

  const width =
    els[0].closest(".sectors__link")?.clientWidth ||
    els[0].parentElement?.clientWidth ||
    els[0].clientWidth;
  if (width <= 0) return;

  els.forEach((el) => {
    el.style.fontSize = "";
    el.style.width = "100%";
  });

  let min = 8;
  let max = Math.min(480, Math.ceil(width * 1.2));

  while (min < max) {
    const mid = Math.ceil((min + max) / 2);
    els.forEach((el) => {
      el.style.fontSize = `${mid}px`;
    });

    const fits = els.every((el) => el.scrollWidth <= width + 0.5);
    if (fits) {
      min = mid;
    } else {
      max = mid - 1;
    }
  }

  els.forEach((el) => {
    el.style.fontSize = `${min}px`;
  });
}

/** Fit primary name full-width; secondary line scales relative to it. */
export function fitHeroTitle(primary: HTMLElement, secondary: HTMLElement) {
  fitDisplayText(primary);
  const primarySize = parseFloat(getComputedStyle(primary).fontSize);
  if (Number.isFinite(primarySize)) {
    secondary.style.fontSize = `${Math.round(primarySize * 0.36)}px`;
  }
}
