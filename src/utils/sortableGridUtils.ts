/**
 * Isolated grid shift logic. Currently uses Y-axis only (same as vertical direction).
 * Isolated here so it can be upgraded to true 2D per-row/column tracking in the future
 * without touching the main SortableDraggable transform logic.
 */
export function computeGridShift(
  myIndex: number,
  fromIndex: number,
  visualTo: number,
  totalShift: number
): number {
  if (visualTo > fromIndex && myIndex > fromIndex && myIndex <= visualTo) {
    return -totalShift;
  }
  if (visualTo < fromIndex && myIndex >= visualTo && myIndex < fromIndex) {
    return totalShift;
  }
  return 0;
}
