import type { SortPosition } from "../types";

type WithId = { id: string };
type WithIndex = { [key: string]: unknown };

export function calculateNewIndex<T extends WithId>(
  items: T[],
  draggedId: string,
  hoverId: string,
  position: SortPosition = "before"
): number {
  const fromIndex = items.findIndex((item) => item.id === draggedId);
  const hoverIndex = items.findIndex((item) => item.id === hoverId);
  if (fromIndex === -1 || hoverIndex === -1) return fromIndex;

  let toIndex = position === "before" ? hoverIndex : hoverIndex + 1;
  if (toIndex > fromIndex) toIndex = toIndex - 1;
  toIndex = Math.max(0, Math.min(toIndex, items.length - 1));
  return toIndex;
}

export function switchArray<T extends WithId & WithIndex>(
  objects: T[],
  indexFrom = 0,
  indexTo = 1,
  indexKey = "index"
): T[] {
  if (
    indexFrom < 0 || indexFrom >= objects.length ||
    indexTo < 0 || indexTo >= objects.length
  ) {
    throw new Error("Index out of range");
  }
  [objects[indexFrom], objects[indexTo]] = [objects[indexTo], objects[indexFrom]];
  (objects[indexFrom] as Record<string, unknown>)[indexKey] = indexFrom;
  (objects[indexTo] as Record<string, unknown>)[indexKey] = indexTo;
  return objects;
}

export function insertItem<T extends WithId & WithIndex>(
  objects: T[],
  indexFrom: number,
  indexTo: number,
  indexKey = "index"
): T[] {
  if (
    indexFrom < 0 || indexFrom >= objects.length ||
    indexTo < 0 || indexTo >= objects.length
  ) {
    throw new Error("Index out of range");
  }
  const newArray = [...objects];
  const [movedItem] = newArray.splice(indexFrom, 1);
  newArray.splice(indexTo, 0, movedItem);
  newArray.forEach((item, i) => {
    (item as Record<string, unknown>)[indexKey] = i;
  });
  return newArray;
}
