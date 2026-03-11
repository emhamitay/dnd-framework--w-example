import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDrop } from "./useDrop";
import { useDndStore } from "../utils/dndStore";

// Helper: simulate an active drag in the store
function simulateDrag(id = "dragged-item") {
  useDndStore.setState({
    activeItem: { id, type: "default", data: {}, pointerPosition: { x: 0, y: 0 } },
    hoverId: null,
  });
}

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("useDrop — dropRef & isHover", () => {
  it("returns dropRef and isHover=false initially", () => {
    const { result } = renderHook(() => useDrop({ id: "zone-1" }));
    expect(result.current.dropRef).toBeDefined();
    expect(result.current.isHover).toBe(false);
  });

  it("isHover becomes true when store hoverId matches id", () => {
    const { result } = renderHook(() => useDrop({ id: "zone-1" }));

    act(() => {
      useDndStore.setState({ hoverId: "zone-1" });
    });

    expect(result.current.isHover).toBe(true);
  });

  it("isHover is false when hoverId is a different id", () => {
    const { result } = renderHook(() => useDrop({ id: "zone-1" }));

    act(() => {
      useDndStore.setState({ hoverId: "zone-2" });
    });

    expect(result.current.isHover).toBe(false);
  });
});

describe("useDrop — pointer events on the DOM element", () => {
  it("sets hoverId in store on pointerenter while drag is active", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const { result } = renderHook(() => useDrop({ id: "zone-2" }));

    act(() => { result.current.dropRef.current = el; });

    act(() => { simulateDrag(); });

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    });

    expect(useDndStore.getState().hoverId).toBe("zone-2");
    document.body.removeChild(el);
  });

  it("clears hoverId on pointerleave", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const { result } = renderHook(() => useDrop({ id: "zone-3" }));
    act(() => { result.current.dropRef.current = el; });
    act(() => { simulateDrag(); });

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    });
    act(() => {
      el.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    });

    expect(useDndStore.getState().hoverId).toBeNull();
    document.body.removeChild(el);
  });

  it("calls onDrop with the dragged item on pointerup inside zone", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const onDrop = vi.fn();
    const { result } = renderHook(() => useDrop({ id: "zone-4", onDrop }));

    act(() => { result.current.dropRef.current = el; });
    act(() => { simulateDrag("my-item"); });

    act(() => {
      const event = new PointerEvent("pointerup", { bubbles: true });
      Object.defineProperty(event, "target", { value: el });
      el.dispatchEvent(event);
    });

    expect(onDrop).toHaveBeenCalledOnce();
    expect(onDrop.mock.calls[0][0].id).toBe("my-item");
    document.body.removeChild(el);
  });

  it("does not call onDrop when no drag is active", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const onDrop = vi.fn();
    const { result } = renderHook(() => useDrop({ id: "zone-5", onDrop }));
    act(() => { result.current.dropRef.current = el; });
    // No simulateDrag — store has activeItem: null

    act(() => {
      const event = new PointerEvent("pointerup", { bubbles: true });
      Object.defineProperty(event, "target", { value: el });
      el.dispatchEvent(event);
    });

    expect(onDrop).not.toHaveBeenCalled();
    document.body.removeChild(el);
  });
});

describe("useDrop — onHoverEnter / onHoverLeave callbacks", () => {
  it("calls onHoverEnter with the dragged item when pointer enters", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const onHoverEnter = vi.fn();
    const { result } = renderHook(() => useDrop({ id: "zone-6", onHoverEnter }));
    act(() => { result.current.dropRef.current = el; });
    act(() => { simulateDrag("item-abc"); });

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    });

    expect(onHoverEnter).toHaveBeenCalledOnce();
    expect(onHoverEnter.mock.calls[0][0].id).toBe("item-abc");
    document.body.removeChild(el);
  });

  it("calls onHoverLeave when pointer leaves while drag is active", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const onHoverLeave = vi.fn();
    const { result } = renderHook(() => useDrop({ id: "zone-7", onHoverLeave }));
    act(() => { result.current.dropRef.current = el; });
    act(() => { simulateDrag("item-xyz"); });

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    });
    act(() => {
      el.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
    });

    expect(onHoverLeave).toHaveBeenCalledOnce();
    expect(onHoverLeave.mock.calls[0][0].id).toBe("item-xyz");
    document.body.removeChild(el);
  });

  it("does not call onHoverEnter when no drag is active", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const onHoverEnter = vi.fn();
    const { result } = renderHook(() => useDrop({ id: "zone-8", onHoverEnter }));
    act(() => { result.current.dropRef.current = el; });
    // no simulateDrag

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
    });

    expect(onHoverEnter).not.toHaveBeenCalled();
    document.body.removeChild(el);
  });
});
