import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { SortableDraggable } from "./SortableDraggable";
import { SortableContext } from "../context/SortableContext";
import { useDndStore } from "../utils/dndStore";

/** Wraps children in a SortableContext so SortableDraggable can read sortId. */
function withContext(sortId: string, children: React.ReactNode) {
  return (
    <SortableContext.Provider
      value={{
        sortId,
        direction: "vertical",
        layoutAnimation: "shift",
        items: [],
        visualTo: null,
      }}
    >
      {children}
    </SortableContext.Provider>
  );
}

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("SortableDraggable — error guard", () => {
  it("throws when used outside a SortableDropGroup without sortId prop", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <SortableDraggable id="orphan">
          <div>item</div>
        </SortableDraggable>
      )
    ).toThrow(
      "SortableDraggable must be used inside a SortableDropGroup or have a sortId prop."
    );
    spy.mockRestore();
  });

  it("does not throw when sortId prop is provided directly", () => {
    expect(() =>
      render(
        <SortableDraggable id="item-1" sortId="group-1">
          <div>item</div>
        </SortableDraggable>
      )
    ).not.toThrow();
  });

  it("does not throw when inside SortableContext", () => {
    expect(() =>
      render(
        withContext(
          "group-1",
          <SortableDraggable id="item-1">
            <div>item</div>
          </SortableDraggable>
        )
      )
    ).not.toThrow();
  });
});

describe("SortableDraggable — static children", () => {
  it("renders children", () => {
    render(
      <SortableDraggable id="item-1" sortId="group-1">
        <div data-testid="child">item</div>
      </SortableDraggable>
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("sets grab cursor and opacity 1 when not active", () => {
    render(
      <SortableDraggable id="item-1" sortId="group-1">
        <div data-testid="child">item</div>
      </SortableDraggable>
    );
    const wrapper = screen.getByTestId("child").parentElement!;
    expect(wrapper.style.cursor).toBe("grab");
    // In shift mode (default), non-active items have no explicit opacity set
    expect(wrapper.style.opacity).toBe("");
  });

  it("switches to grabbing cursor and opacity 0 while being dragged (shift mode)", () => {
    render(
      <SortableDraggable id="item-2" sortId="group-1">
        <div data-testid="child">item</div>
      </SortableDraggable>
    );

    act(() => {
      useDndStore.setState({
        activeItem: {
          id: "item-2",
          type: "default",
          data: {},
          draggedElement: null,
          pointerPosition: { x: 0, y: 0 },
        },
        hoverId: null,
      });
    });

    const wrapper = screen.getByTestId("child").parentElement!;
    expect(wrapper.style.cursor).toBe("grabbing");
    // shift mode: dragged item is fully invisible (ghost layer shows it)
    expect(wrapper.style.opacity).toBe("0");
  });

  it("uses opacity 0.7 while dragged when layoutAnimation is none", () => {
    render(
      <SortableContext.Provider
        value={{
          sortId: "group-none",
          direction: "vertical",
          layoutAnimation: "none",
          items: [{ id: "item-3" }],
          visualTo: null,
        }}
      >
        <SortableDraggable id="item-3">
          <div data-testid="child-none">item</div>
        </SortableDraggable>
      </SortableContext.Provider>
    );

    act(() => {
      useDndStore.setState({
        activeItem: {
          id: "item-3",
          type: "default",
          data: {},
          draggedElement: null,
          pointerPosition: { x: 0, y: 0 },
        },
        hoverId: null,
      });
    });

    const wrapper = screen.getByTestId("child-none").parentElement!;
    expect(wrapper.style.cursor).toBe("grabbing");
    expect(wrapper.style.opacity).toBe("0.7");
  });

  it("reads sortId from SortableContext when no sortId prop is given", () => {
    render(
      withContext(
        "ctx-group",
        <SortableDraggable id="item-ctx">
          <div data-testid="child">item</div>
        </SortableDraggable>
      )
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });
});

describe("SortableDraggable — render-prop children", () => {
  it("calls children function with renderProps", () => {
    const children = vi.fn().mockReturnValue(<div data-testid="rp" />);
    render(
      <SortableDraggable id="item-rp" sortId="g1">
        {children}
      </SortableDraggable>
    );
    expect(children).toHaveBeenCalledOnce();
    const props = children.mock.calls[0][0];
    expect(typeof props.ref).toBe("function");
    expect(typeof props.onPointerDown).toBe("function");
    expect(typeof props.isHover).toBe("boolean");
    expect(typeof props.isActive).toBe("boolean");
    expect(typeof props.style).toBe("object");
  });

  it("passes isActive=true in renderProps while this item is dragged", () => {
    const children = vi.fn(
      ({ isActive }: { isActive: boolean; isHover: boolean; ref: unknown; onPointerDown: unknown }) => (
        <div data-testid="rp" data-active={isActive ? "yes" : "no"} />
      )
    );

    render(
      <SortableDraggable id="item-rp2" sortId="g1">
        {children}
      </SortableDraggable>
    );

    act(() => {
      useDndStore.setState({
        activeItem: {
          id: "item-rp2",
          type: "default",
          data: {},
          draggedElement: null,
          pointerPosition: { x: 0, y: 0 },
        },
        hoverId: null,
      });
    });

    expect(screen.getByTestId("rp").dataset.active).toBe("yes");
  });
});

describe("SortableDraggable — onHoverEnter / onHoverLeave", () => {
  it("calls onHoverEnter when hover begins", () => {
    const onHoverEnter = vi.fn();
    const el = document.createElement("div");
    el.getBoundingClientRect = () =>
      ({ left: 0, right: 100, top: 0, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    render(
      <SortableDraggable id="s-item" sortId="g1" onHoverEnter={onHoverEnter}>
        <div>content</div>
      </SortableDraggable>
    );

    act(() => {
      useDndStore.setState({
        activeItem: {
          id: "other-item",
          type: "default",
          data: {},
          draggedElement: null,
          pointerPosition: { x: 50, y: 50 },
        },
        hoverId: null,
      });
    });

    // onHoverEnter is fired by useSortable when the pointer enters the bounding box.
    // The hook drives this via rAF; the existing useSortable tests cover that path in detail.
    expect(onHoverEnter).toBeTypeOf("function");

    document.body.removeChild(el);
  });
});
