import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDrag } from "./useDrag";
import { useDndStore } from "../utils/dndStore";

beforeEach(() => {
  // Reset store state before each test
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("useDrag", () => {
  it("returns an onPointerDown handler", () => {
    const { result } = renderHook(() => useDrag({ id: "a", sortId: "group-1" }));
    expect(typeof result.current.onPointerDown).toBe("function");
  });

  it("starts drag when onPointerDown is called with left click", () => {
    const { result } = renderHook(() => useDrag({ id: "box-1", sortId: "g1" }));

    const fakeElement = document.createElement("div");
    const event = new PointerEvent("pointerdown", {
      button: 0,
      clientX: 100,
      clientY: 200,
      bubbles: true,
    });
    Object.defineProperty(event, "currentTarget", { value: fakeElement });

    act(() => {
      result.current.onPointerDown(event as unknown as React.PointerEvent<Element>);
    });

    const { activeItem } = useDndStore.getState();
    expect(activeItem).not.toBeNull();
    expect(activeItem!.id).toBe("box-1");
  });

  it("does not start drag on right click (button !== 0)", () => {
    const { result } = renderHook(() => useDrag({ id: "box-1", sortId: "g1" }));

    const event = new PointerEvent("pointerdown", { button: 2, bubbles: true });
    Object.defineProperty(event, "currentTarget", { value: document.createElement("div") });

    act(() => {
      result.current.onPointerDown(event as unknown as React.PointerEvent<Element>);
    });

    expect(useDndStore.getState().activeItem).toBeNull();
  });

  it("does not start drag if event.defaultPrevented", () => {
    const { result } = renderHook(() => useDrag({ id: "box-1", sortId: "g1" }));

    const event = new PointerEvent("pointerdown", { button: 0, bubbles: true, cancelable: true });
    event.preventDefault();
    Object.defineProperty(event, "currentTarget", { value: document.createElement("div") });

    act(() => {
      result.current.onPointerDown(event as unknown as React.PointerEvent<Element>);
    });

    expect(useDndStore.getState().activeItem).toBeNull();
  });

  it("stores custom data in activeItem", () => {
    const { result } = renderHook(() =>
      useDrag({ id: "card-1", sortId: "g1", type: "card", data: { color: "red" } })
    );

    const fakeElement = document.createElement("div");
    const event = new PointerEvent("pointerdown", { button: 0, clientX: 10, clientY: 20, bubbles: true });
    Object.defineProperty(event, "currentTarget", { value: fakeElement });

    act(() => {
      result.current.onPointerDown(event as unknown as React.PointerEvent<Element>);
    });

    const { activeItem } = useDndStore.getState();
    expect(activeItem!.type).toBe("card");
    expect(activeItem!.data.color).toBe("red");
  });

  it("does not start drag when clicking an interactive element (button)", () => {
    const { result } = renderHook(() => useDrag({ id: "box-1", sortId: "g1" }));

    const button = document.createElement("button");
    document.body.appendChild(button);

    const event = new PointerEvent("pointerdown", { button: 0, bubbles: true });
    Object.defineProperty(event, "target", { value: button });
    Object.defineProperty(event, "currentTarget", { value: document.createElement("div") });

    act(() => {
      result.current.onPointerDown(event as unknown as React.PointerEvent<Element>);
    });

    expect(useDndStore.getState().activeItem).toBeNull();
    document.body.removeChild(button);
  });
});
