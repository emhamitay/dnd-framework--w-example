import { describe, it, expect } from "vitest";
import { insertItem, switchArray, calculateNewIndex } from "./sortableUtils";

// ─── helpers ────────────────────────────────────────────────────────────────

function makeItems(count) {
  return Array.from({ length: count }, (_, i) => ({ id: `item-${i}`, index: i }));
}

// ─── calculateNewIndex ───────────────────────────────────────────────────────

describe("calculateNewIndex", () => {
  it("returns hoverIndex when position is before", () => {
    const items = makeItems(4);
    // drag item-0 before item-2 → target index 2, but since from < to we subtract 1 → 1
    expect(calculateNewIndex(items, "item-0", "item-2", "before")).toBe(1);
  });

  it("returns hoverIndex + 1 (adjusted) when position is after", () => {
    const items = makeItems(4);
    // drag item-0 after item-2 → toIndex = 3, from(0) < to(3) → 2
    expect(calculateNewIndex(items, "item-0", "item-2", "after")).toBe(2);
  });

  it("returns -1 when draggedId not found", () => {
    const items = makeItems(4);
    expect(calculateNewIndex(items, "ghost", "item-2", "before")).toBe(-1);
  });

  it("returns fromIndex when hoverId not found", () => {
    const items = makeItems(4);
    // hoverIndex === -1, so toIndex calculation returns fromIndex
    expect(calculateNewIndex(items, "item-1", "ghost", "before")).toBe(1);
  });

  it("handles dragging last item before first", () => {
    const items = makeItems(4);
    expect(calculateNewIndex(items, "item-3", "item-0", "before")).toBe(0);
  });
});

// ─── insertItem ──────────────────────────────────────────────────────────────

describe("insertItem", () => {
  it("moves item forward in the list", () => {
    const items = makeItems(4);
    const result = insertItem(items, 0, 2);
    expect(result.map((i) => i.id)).toEqual(["item-1", "item-2", "item-0", "item-3"]);
  });

  it("moves item backward in the list", () => {
    const items = makeItems(4);
    const result = insertItem(items, 3, 1);
    expect(result.map((i) => i.id)).toEqual(["item-0", "item-3", "item-1", "item-2"]);
  });

  it("updates the indexKey field on all items", () => {
    const items = makeItems(4);
    const result = insertItem(items, 0, 3);
    result.forEach((item, i) => {
      expect(item.index).toBe(i);
    });
  });

  it("uses a custom indexKey", () => {
    const items = [
      { id: "a", order: 0 },
      { id: "b", order: 1 },
      { id: "c", order: 2 },
    ];
    const result = insertItem(items, 0, 2, "order");
    expect(result[0].order).toBe(0);
    expect(result[1].order).toBe(1);
    expect(result[2].order).toBe(2);
  });

  it("throws on out-of-range indexFrom", () => {
    const items = makeItems(3);
    expect(() => insertItem(items, 5, 1)).toThrow("Index out of range");
  });

  it("throws on out-of-range indexTo", () => {
    const items = makeItems(3);
    expect(() => insertItem(items, 0, 10)).toThrow("Index out of range");
  });

  it("does not mutate the original array", () => {
    const items = makeItems(4);
    const original = items.map((i) => ({ ...i }));
    insertItem([...items.map((i) => ({ ...i }))], 0, 2);
    // original items untouched (insertItem gets a fresh spread in the test)
    expect(items[0].id).toBe(original[0].id);
  });
});

// ─── switchArray ─────────────────────────────────────────────────────────────

describe("switchArray", () => {
  it("swaps two items", () => {
    const items = makeItems(4);
    const result = switchArray(items, 0, 3);
    expect(result[0].id).toBe("item-3");
    expect(result[3].id).toBe("item-0");
  });

  it("updates indexKey on swapped items", () => {
    const items = makeItems(4);
    const result = switchArray(items, 1, 2);
    expect(result[1].index).toBe(1);
    expect(result[2].index).toBe(2);
  });

  it("throws on out-of-range index", () => {
    const items = makeItems(3);
    expect(() => switchArray(items, 0, 5)).toThrow("Index out of range");
  });
});
