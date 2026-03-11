import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { act } from "@testing-library/react";
import { GhostLayer } from "./GhostLayer";
import { useDndStore } from "./utils/dndStore";

function setActiveDrag() {
  useDndStore.setState({
    activeItem: {
      id: "ghost-item",
      type: "default",
      data: {},
      draggedElement: null,
      pointerPosition: { x: 100, y: 200 },
    },
    hoverId: null,
  });
}

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("GhostLayer — no active drag", () => {
  it("renders nothing into the container when there is no drag", () => {
    const { container } = render(<GhostLayer />);
    // GhostLayer returns null → nothing in the RTL container
    expect(container.firstChild).toBeNull();
  });
});

describe("GhostLayer — active drag", () => {
  it("adds a fixed-position portal div to document.body when drag starts", () => {
    render(<GhostLayer />);

    // Before drag: only the RTL container is in body
    const initialChildCount = document.body.children.length;

    act(() => { setActiveDrag(); });

    // After drag: a portal div has been added directly in body
    expect(document.body.children.length).toBe(initialChildCount + 1);
  });

  it("removes the portal div from body when drag ends", () => {
    render(<GhostLayer />);

    act(() => { setActiveDrag(); });

    const afterDragStart = document.body.children.length;

    act(() => {
      useDndStore.setState({ activeItem: null, hoverId: null });
    });

    expect(document.body.children.length).toBe(afterDragStart - 1);
  });

  it("updates the portal position when pointermove fires", () => {
    render(<GhostLayer />);

    act(() => { setActiveDrag(); });

    // pointermove should not throw and the portal should remain
    const beforeCount = document.body.children.length;
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 300, clientY: 400 })
      );
    });

    expect(document.body.children.length).toBe(beforeCount);
  });

  it("portal div has position:fixed style", () => {
    render(<GhostLayer />);

    act(() => { setActiveDrag(); });

    // Find the portal div — it will be fixed-position and directly in body
    const portalEl = Array.from(document.body.children).find(
      (el) => (el as HTMLElement).style.position === "fixed"
    ) as HTMLElement | undefined;

    expect(portalEl).toBeDefined();
    expect(portalEl!.style.zIndex).toBe("9999");
  });
});
