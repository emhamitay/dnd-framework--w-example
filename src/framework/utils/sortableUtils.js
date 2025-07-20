/**
 * Calculates the new index of a dragged item based on hover target and position.
 *
 * @param {Array} items - The full list of items.
 * @param {string} draggedId - The ID of the dragged item.
 * @param {string} hoverId - The ID of the item being hovered.
 * @param {'before'|'after'} [position='before'] - Relative drop position.
 * @returns {number} The new index for the dragged item.
 */
export function calculateNewIndex(items, draggedId, hoverId, position = 'before') {
  const fromIndex = items.findIndex(item => item.id === draggedId);
  const hoverIndex = items.findIndex(item => item.id === hoverId);
  if (fromIndex === -1 || hoverIndex === -1) return fromIndex;

  let toIndex = position === 'before' ? hoverIndex : hoverIndex + 1;

  if (toIndex > fromIndex) {
    toIndex = toIndex - 1;
  }

  toIndex = Math.max(0, Math.min(toIndex, items.length - 1));
  return toIndex;
}

/**
 * Returns a new reordered array, updating the specified index field for each item.
 *
 * @param {Array} objects - The original array.
 * @param {number} indexFrom - Index of the item to move.
 * @param {number} indexTo - Target index to insert at.
 * @param {string} [indexKey='index'] - Field name that holds the item's position.
 * @returns {Array} The reordered array.
 */
export function switchArray(objects, indexFrom = 0, indexTo = 1, indexKey = 'index') {
  // Validate indices
  if (
    indexFrom < 0 || indexFrom >= objects.length ||
    indexTo < 0 || indexTo >= objects.length
  ) {
    throw new Error("Index out of range");
  }

  // Swap the objects in the array
  [objects[indexFrom], objects[indexTo]] = [objects[indexTo], objects[indexFrom]];

  // Update their index fields
  objects[indexFrom][indexKey] = indexFrom;
  objects[indexTo][indexKey] = indexTo;

  return objects;
}