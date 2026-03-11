import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { Droppable } from "./Droppable";
import { useDndStore } from "../utils/dndStore";
import type { RefObject } from "react";

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("Droppable — static children", () => {
  it("renders children inside a wrapper div", () => {
    render(
      <Droppable id="zone-1">
        <span data-testid="content">drop zone</span>
      </Droppable>
    );
    expect(screen.getByTestId("content")).toBeDefined();
  });

  it("applies className to the wrapper div", () => {
    const { container } = render(
      <Droppable id="zone-1" className="my-zone">
        <span>content</span>
      </Droppable>
    );
    expect(container.querySelector(".my-zone")).not.toBeNull();
  });
});

describe("Droppable — render-prop children", () => {
  it("calls children function with isHover=false initially", () => {
    const children = vi.fn().mockReturnValue(<div />);
    render(<Droppable id="zone-2">{children}</Droppable>);
    expect(children).toHaveBeenCalledWith(false, expect.any(Object));
  });

  it("re-renders with isHover=true when store hoverId matches", () => {
    const children = vi.fn(
      (isHover: boolean) => (
        <div data-testid="inner" data-hover={isHover ? "yes" : "no"} />
      )
    );
    render(<Droppable id="zone-3">{children}</Droppable>);

    act(() => {
      useDndStore.setState({ hoverId: "zone-3" });
    });

    expect(screen.getByTestId("inner").dataset.hover).toBe("yes");
  });

  it("re-renders with isHover=false when hoverId is a different id", () => {
    const children = vi.fn(
      (isHover: boolean) => (
        <div data-testid="inner" data-hover={isHover ? "yes" : "no"} />
      )
    );
    render(<Droppable id="zone-4">{children}</Droppable>);

    act(() => {
      useDndStore.setState({ hoverId: "zone-99" });
    });

    expect(screen.getByTestId("inner").dataset.hover).toBe("no");
  });

  it("passes a ref object as the second argument to children", () => {
    let capturedRef: RefObject<HTMLElement | null> | null = null;
    const children = (_isHover: boolean, ref: RefObject<HTMLElement | null>) => {
      capturedRef = ref;
      return <div />;
    };
    render(<Droppable id="zone-5">{children}</Droppable>);

    expect(capturedRef).not.toBeNull();
    expect(capturedRef).toHaveProperty("current");
  });
});

describe("Droppable — drop callback", () => {
  it("calls onDrop with the dragged item when pointerup fires inside the zone", () => {
    const onDrop = vi.fn();
    render(
      <Droppable id="drop-zone" onDrop={onDrop}>
        <div data-testid="zone">zone</div>
      </Droppable>
    );

    // Simulate an active drag
    act(() => {
      useDndStore.setState({
        activeItem: {
          id: "dragged-1",
          type: "default",
          data: {},
          draggedElement: null,
          pointerPosition: { x: 0, y: 0 },
        },
        hoverId: null,
      });
    });

    const zoneEl = screen.getByTestId("zone").parentElement!;
    act(() => {
      const event = new PointerEvent("pointerup", { bubbles: true });
      Object.defineProperty(event, "target", { value: zoneEl });
      zoneEl.dispatchEvent(event);
    });

    expect(onDrop).toHaveBeenCalledOnce();
    expect(onDrop.mock.calls[0][0].id).toBe("dragged-1");
  });
});
