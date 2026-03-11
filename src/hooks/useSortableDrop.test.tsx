import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSortableDrop, SORT_MODE } from "./useSortableDrop";
import { useDndStore } from "../utils/dndStore";
import mouseUpEventStore from "../utils/MouseUpEventStore";

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
  mouseUpEventStore.clearEvents();
});

describe("useSortableDrop — exports", () => {
  it("exports SORT_MODE with Switch and Insert values", () => {
    expect(SORT_MODE.Switch).toBe("switch");
    expect(SORT_MODE.Insert).toBe("insert");
  });
});

describe("useSortableDrop — sortId", () => {
  it("returns a string starting with 'sortable-group-'", () => {
    const { result } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted: vi.fn() })
    );
    expect(result.current).toMatch(/^sortable-group-/);
  });

  it("returns the same sortId across re-renders", () => {
    const { result, rerender } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted: vi.fn() })
    );
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("returns a unique sortId for each hook instance", () => {
    const { result: r1 } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted: vi.fn() })
    );
    const { result: r2 } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted: vi.fn() })
    );
    expect(r1.current).not.toBe(r2.current);
  });
});

describe("useSortableDrop — Insert mode (default)", () => {
  it("calls onSorted with items shifted when drag resolves", () => {
    const onSorted = vi.fn();
    const { result } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted, mode: SORT_MODE.Insert })
    );

    // Drag "a" → after "c": expected result = [b, c, a]
    act(() => { simulateDrag("a", "c", "after"); });
    act(() => { mouseUpEventStore.runEvents(result.current); });

    expect(onSorted).toHaveBeenCalledOnce();
    const newItems = onSorted.mock.calls[0][0] as Item[];
    expect(newItems.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("updates index values in the returned array", () => {
    const onSorted = vi.fn();
    const { result } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted, mode: SORT_MODE.Insert })
    );

    act(() => { simulateDrag("a", "c", "after"); });
    act(() => { mouseUpEventStore.runEvents(result.current); });

    const newItems = onSorted.mock.calls[0][0] as Item[];
    newItems.forEach((item, i) => {
      expect(item.index).toBe(i);
    });
  });
});

describe("useSortableDrop — Switch mode", () => {
  it("calls onSorted with two items swapped", () => {
    const onSorted = vi.fn();
    const { result } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted, mode: SORT_MODE.Switch })
    );

    // Drag "a" → after "c": swap a(0) and c(2) → [c, b, a]
    act(() => { simulateDrag("a", "c", "after"); });
    act(() => { mouseUpEventStore.runEvents(result.current); });

    expect(onSorted).toHaveBeenCalledOnce();
    const newItems = onSorted.mock.calls[0][0] as Item[];
    expect(newItems.map((i) => i.id)).toEqual(["c", "b", "a"]);
  });
});

describe("useSortableDrop — no-op cases", () => {
  it("does not call onSorted when there is no active drag", () => {
    const onSorted = vi.fn();
    const { result } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted })
    );
    // No simulateDrag — store has activeItem: null
    act(() => { mouseUpEventStore.runEvents(result.current); });

    expect(onSorted).not.toHaveBeenCalled();
  });

  it("does not call onSorted when dragged item position is unchanged", () => {
    const onSorted = vi.fn();
    const { result } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted })
    );

    // Hover over the same item that is being dragged → fromIndex === toIndex
    act(() => { simulateDrag("b", "b", "before"); });
    act(() => { mouseUpEventStore.runEvents(result.current); });

    expect(onSorted).not.toHaveBeenCalled();
  });

  it("does not call onSorted when hoverId is not in items", () => {
    const onSorted = vi.fn();
    const { result } = renderHook(() =>
      useSortableDrop({ items: ITEMS, onSorted })
    );

    act(() => { simulateDrag("a", "nonexistent-id", "after"); });
    act(() => { mouseUpEventStore.runEvents(result.current); });

    expect(onSorted).not.toHaveBeenCalled();
  });
});
