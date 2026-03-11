import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSortable, SORT_DIRECTION } from "./useSortable";
import { useDndStore } from "../utils/dndStore";

function simulateDrag(id = "dragged") {
  useDndStore.setState({
    activeItem: {
      id,
      type: "default",
      data: {},
      draggedElement: null,
      pointerPosition: { x: 50, y: 50 },
    },
    hoverId: null,
  });
}

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("useSortable — exports and return shape", () => {
  it("exports SORT_DIRECTION enum", () => {
    expect(SORT_DIRECTION.Vertical).toBe("vertical");
    expect(SORT_DIRECTION.Horizontal).toBe("horizontal");
    expect(SORT_DIRECTION.Grid).toBe("grid");
  });

  it("returns ref, isHover, isActive", () => {
    const { result } = renderHook(() => useSortable({ id: "item-1" }));
    expect(result.current.ref).toBeDefined();
    expect(result.current.isHover).toBe(false);
    expect(result.current.isActive).toBe(false);
  });
});

describe("useSortable — isActive", () => {
  it("isActive is true when this item is the active dragged item", () => {
    const { result } = renderHook(() => useSortable({ id: "item-2" }));

    act(() => {
      simulateDrag("item-2");
    });

    expect(result.current.isActive).toBe(true);
  });

  it("isActive is false when a different item is being dragged", () => {
    const { result } = renderHook(() => useSortable({ id: "item-3" }));

    act(() => {
      simulateDrag("item-99");
    });

    expect(result.current.isActive).toBe(false);
  });

  it("isActive returns false after drag ends", () => {
    const { result } = renderHook(() => useSortable({ id: "item-4" }));

    act(() => { simulateDrag("item-4"); });
    expect(result.current.isActive).toBe(true);

    act(() => {
      useDndStore.setState({ activeItem: null, hoverId: null });
    });

    expect(result.current.isActive).toBe(false);
  });
});

describe("useSortable — pointer-position-based isHover", () => {
  it("isHover becomes true when pointer is inside element bounding box", () => {
    const el = document.createElement("div");
    // Mock getBoundingClientRect to a 100×100 box at (0,0)
    el.getBoundingClientRect = () => ({ left: 0, right: 100, top: 0, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    const { result } = renderHook(() => useSortable({ id: "s-item-1" }));
    act(() => { result.current.ref.current = el; });

    act(() => {
      // pointer at (50,50) — inside the box
      useDndStore.setState({
        activeItem: {
          id: "dragged",
          type: "default",
          data: {},
          draggedElement: null,
          pointerPosition: { x: 50, y: 50 },
        },
        hoverId: null,
      });
    });

    // rAF runs synchronously in jsdom — give it a tick
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(result.current.isHover).toBe(true);
        document.body.removeChild(el);
        resolve();
      }, 20);
    });
  });

  it("isHover is false when pointer is outside element bounding box", () => {
    const el = document.createElement("div");
    el.getBoundingClientRect = () => ({ left: 200, right: 300, top: 200, bottom: 300, width: 100, height: 100, x: 200, y: 200, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    const { result } = renderHook(() => useSortable({ id: "s-item-2" }));
    act(() => { result.current.ref.current = el; });

    act(() => {
      useDndStore.setState({
        activeItem: {
          id: "dragged",
          type: "default",
          data: {},
          draggedElement: null,
          pointerPosition: { x: 50, y: 50 }, // outside the 200-300 box
        },
        hoverId: null,
      });
    });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(result.current.isHover).toBe(false);
        document.body.removeChild(el);
        resolve();
      }, 20);
    });
  });
});
