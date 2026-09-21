/** Circle fill center for `.btn-fill` (exact pointer position on enter). */
export function setFillOrigin(
  el: HTMLElement,
  clientX: number,
  clientY: number
): void {
  const rect = el.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  el.style.setProperty("--fill-x", `${x}%`);
  el.style.setProperty("--fill-y", `${y}%`);
}
