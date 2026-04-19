import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSortableDrop, SORT_MODE } from "./useSortableDrop";
import { useDndStore } from "../utils/dndStore";

type Item = { id: string; index: number };

const ITEMS: Item[] = [
  { id: "a", index: 0 },
  { id: "b", index: 1 },
  { id: "c", index: 2 },
];

/** Puts an active drag + hover into the store so the registered handler can act. */
function simulateDrag(
  draggedId: string,
  hoveredId: string,
  position: "before" | "after" = "after"
) {
  useDndStore.setState({
    activeItem: {
      id: draggedId,
      type: "default",
      data: { position },
      draggedElement: null,
      pointerPosition: { x: 0, y: 0 },
    },
    hoverId: hoveredId,
  });
}

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("useSortableDrop — exports", () => {
  it("exports SORT_MODE with Switch and Insert values", () => {
    expect(SORT_MODE.Switch).toBe("switch");
    expect(SORT_MODE.Insert).toBe("insert");
  });
});

describe("useSortableDrop — Insert mode (default)", () => {
  it("calls onSorted with items shifted when drag resolves", () => {
    const onSorted = vi.fn();
    renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted, mode: SORT_MODE.Insert })
    );

    // Drag "a" → after "c": expected result = [b, c, a]
    act(() => { simulateDrag("a", "c", "after"); });
    act(() => { useDndStore.getState().pendingSortHandler?.(); });

    expect(onSorted).toHaveBeenCalledOnce();
    const newItems = onSorted.mock.calls[0][0] as Item[];
    expect(newItems.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("updates index values in the returned array", () => {
    const onSorted = vi.fn();
    renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted, mode: SORT_MODE.Insert })
    );

    act(() => { simulateDrag("a", "c", "after"); });
    act(() => { useDndStore.getState().pendingSortHandler?.(); });

    const newItems = onSorted.mock.calls[0][0] as Item[];
    newItems.forEach((item, i) => {
      expect(item.index).toBe(i);
    });
  });
});

describe("useSortableDrop — Switch mode", () => {
  it("calls onSorted with two items swapped", () => {
    const onSorted = vi.fn();
    renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted, mode: SORT_MODE.Switch })
    );

    // Drag "a" → after "c": swap a(0) and c(2) → [c, b, a]
    act(() => { simulateDrag("a", "c", "after"); });
    act(() => { useDndStore.getState().pendingSortHandler?.(); });

    expect(onSorted).toHaveBeenCalledOnce();
    const newItems = onSorted.mock.calls[0][0] as Item[];
    expect(newItems.map((i) => i.id)).toEqual(["c", "b", "a"]);
  });
});

describe("useSortableDrop — no-op cases", () => {
  it("does not call onSorted when there is no active drag", () => {
    const onSorted = vi.fn();
    renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted })
    );
    // No simulateDrag — store has activeItem: null
    act(() => { useDndStore.getState().pendingSortHandler?.(); });

    expect(onSorted).not.toHaveBeenCalled();
  });

  it("does not call onSorted when dragged item position is unchanged", () => {
    const onSorted = vi.fn();
    renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted })
    );

    // Hover over the same item that is being dragged → fromIndex === toIndex
    act(() => { simulateDrag("b", "b", "before"); });
    act(() => { useDndStore.getState().pendingSortHandler?.(); });

    expect(onSorted).not.toHaveBeenCalled();
  });

  it("does not call onSorted when hoverId is not in items", () => {
    const onSorted = vi.fn();
    renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted })
    );

    act(() => { simulateDrag("a", "nonexistent-id", "after"); });
    act(() => { useDndStore.getState().pendingSortHandler?.(); });

    expect(onSorted).not.toHaveBeenCalled();
  });
});
