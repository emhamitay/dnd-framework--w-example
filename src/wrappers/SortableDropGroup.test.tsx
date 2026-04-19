import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { SortableDropGroup } from "./SortableDropGroup";
import { SortableDraggable } from "./SortableDraggable";
import { SortableContext } from "../context/SortableContext";
import { useDndStore } from "../utils/dndStore";
import { useContext } from "react";

type Item = { id: string; index: number };

const ITEMS: Item[] = [
  { id: "a", index: 0 },
  { id: "b", index: 1 },
  { id: "c", index: 2 },
];

beforeEach(() => {
  useDndStore.setState({ activeItem: null, hoverId: null });
});

describe("SortableDropGroup — rendering", () => {
  it("renders its children", () => {
    render(
      <SortableDropGroup items={ITEMS} onSorted={vi.fn()}>
        <div data-testid="child-a">a</div>
        <div data-testid="child-b">b</div>
      </SortableDropGroup>
    );
    expect(screen.getByTestId("child-a")).toBeDefined();
    expect(screen.getByTestId("child-b")).toBeDefined();
  });

  it("applies className to the wrapper div", () => {
    const { container } = render(
      <SortableDropGroup items={ITEMS} onSorted={vi.fn()} className="my-group">
        <div>item</div>
      </SortableDropGroup>
    );
    expect(container.querySelector(".my-group")).not.toBeNull();
  });
});

describe("SortableDropGroup — SortableContext", () => {
  it("provides a non-empty sortId via context", () => {
    let capturedSortId: string | undefined;

    function ContextConsumer() {
      const ctx = useContext(SortableContext);
      capturedSortId = ctx?.sortId;
      return null;
    }

    render(
      <SortableDropGroup items={ITEMS} onSorted={vi.fn()}>
        <ContextConsumer />
      </SortableDropGroup>
    );

    expect(capturedSortId).toMatch(/^sortable-group-/);
  });

  it("allows SortableDraggable children to render without error", () => {
    expect(() =>
      render(
        <SortableDropGroup items={ITEMS} onSorted={vi.fn()}>
          {ITEMS.map((item) => (
            <SortableDraggable key={item.id} id={item.id}>
              <div>{item.id}</div>
            </SortableDraggable>
          ))}
        </SortableDropGroup>
      )
    ).not.toThrow();
  });
});

describe("SortableDropGroup — sorting", () => {
  it("calls onSorted when a drag-drop reorders items", () => {
    const onSorted = vi.fn();

    render(
      <SortableDropGroup items={ITEMS} onSorted={onSorted}>
        {ITEMS.map((item) => (
          <SortableDraggable key={item.id} id={item.id}>
            <div>{item.id}</div>
          </SortableDraggable>
        ))}
      </SortableDropGroup>
    );

    // Simulate dragging "a" over "c" with position "after"
    act(() => {
      useDndStore.setState({
        activeItem: {
          id: "a",
          type: "default",
          data: { position: "after" },
          draggedElement: null,
          pointerPosition: { x: 0, y: 0 },
        },
        hoverId: "c",
      });
    });

    act(() => {
      useDndStore.getState().pendingSortHandler?.();
    });

    expect(onSorted).toHaveBeenCalledOnce();
    const newOrder = onSorted.mock.calls[0][0] as Item[];
    expect(newOrder.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });
});
