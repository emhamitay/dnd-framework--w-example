import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { Draggable } from "./Draggable";
import { useDndStore } from "../utils/dndStore";

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("Draggable — rendering", () => {
  it("renders its child element", () => {
    render(
      <Draggable id="item-1">
        <div data-testid="child">hello</div>
      </Draggable>
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("sets touchAction: none on the child element", () => {
    render(
      <Draggable id="item-1">
        <div data-testid="child">hello</div>
      </Draggable>
    );
    expect(screen.getByTestId("child").style.touchAction).toBe("none");
  });

  it("merges className from Draggable prop with the child's own className", () => {
    render(
      <Draggable id="item-1" className="extra">
        <div data-testid="child" className="original">hello</div>
      </Draggable>
    );
    const el = screen.getByTestId("child");
    expect(el.className).toContain("original");
    expect(el.className).toContain("extra");
  });

  it("preserves child className when no Draggable className is given", () => {
    render(
      <Draggable id="item-1">
        <div data-testid="child" className="original">hello</div>
      </Draggable>
    );
    expect(screen.getByTestId("child").className).toBe("original");
  });
});

describe("Draggable — drag behaviour", () => {
  it("starts a drag when pointerdown fires on the child (left button)", () => {
    render(
      <Draggable id="item-1">
        <div data-testid="child">drag me</div>
      </Draggable>
    );
    const el = screen.getByTestId("child");

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerdown", { button: 0, bubbles: true }));
    });

    expect(useDndStore.getState().activeItem?.id).toBe("item-1");
  });

  it("does not start a drag on right-click (button !== 0)", () => {
    render(
      <Draggable id="item-1">
        <div data-testid="child">drag me</div>
      </Draggable>
    );
    const el = screen.getByTestId("child");

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerdown", { button: 2, bubbles: true }));
    });

    expect(useDndStore.getState().activeItem).toBeNull();
  });

  it("passes type and data into the drag state", () => {
    render(
      <Draggable id="item-2" type="card" data={{ color: "blue" }}>
        <div data-testid="child">card</div>
      </Draggable>
    );
    const el = screen.getByTestId("child");

    act(() => {
      el.dispatchEvent(new PointerEvent("pointerdown", { button: 0, bubbles: true }));
    });

    const { activeItem } = useDndStore.getState();
    expect(activeItem?.type).toBe("card");
    expect(activeItem?.data.color).toBe("blue");
  });

  it("uses 'default' as type when none is provided", () => {
    render(
      <Draggable id="item-3">
        <div data-testid="child">item</div>
      </Draggable>
    );

    act(() => {
      screen
        .getByTestId("child")
        .dispatchEvent(new PointerEvent("pointerdown", { button: 0, bubbles: true }));
    });

    expect(useDndStore.getState().activeItem?.type).toBe("default");
  });
});
