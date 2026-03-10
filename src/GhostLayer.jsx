import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useDndStore } from "./utils/dndStore";

/**
 * `GhostLayer` is a React component that renders a "ghost" clone of the dragged item
 * during a drag-and-drop operation. It uses `createPortal` to render the element
 * at the body level and follows the user's pointer.
 *
 * The ghost element is cloned from the original dragged element, styled appropriately,
 * and follows the cursor's position with a smooth appearance.
 *
 * @component
 * @returns {React.ReactPortal|null} A portal rendering the ghost element, or null if no item is active.
 */
export function GhostLayer() {
  /** @type {import('./utils/dndStore').ActiveItem | null} */
  const activeItem = useDndStore((s) => s.activeItem);

  /** Pointer position of the ghost element */
  const [position, setPosition] = useState(
    () => activeItem?.pointerPosition || { x: 0, y: 0 }
  );

  /** Dimensions of the ghost element */
  const [size, setSize] = useState({ width: 0, height: 0 });

  /**
   * Controls whether the ghost is ready to be rendered.
   * Used to ensure measurements happen after DOM is updated.
   */
  const [ready, setReady] = useState(false);

  /** Ref to the container DOM node where the ghost clone will be inserted */
  const containerRef = useRef(null);

  /**
   * Effect to clone and render the ghost element when `ready` and `activeItem` are valid.
   */
  useEffect(() => {
    if (activeItem == null) {
      setReady(false);
      return;
    }

    if (ready) {
      if (!activeItem?.draggedElement || !containerRef.current) {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        setSize({ width: 0, height: 0 });
        return;
      }

      const clone = activeItem.draggedElement.cloneNode(true);

      // Apply visual styles to ghost element
      clone.style.pointerEvents = "none";
      clone.style.opacity = "0.9";
      clone.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
      clone.style.borderRadius = "8px";
      clone.style.margin = "0";
      clone.style.userSelect = "none";

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(clone);

      const rect = clone.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      setSize({ width: 0, height: 0 });
    };
  }, [activeItem, ready]);

  /**
   * Effect to track pointer movement and update position state accordingly.
   * Also sets the `ready` flag to true after initial position is determined.
   */
  useEffect(() => {
    if (!activeItem) return;

    if (activeItem.pointerPosition) {
      setPosition(activeItem.pointerPosition);
    }

    function onPointerMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    setReady(true);

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [activeItem]);

  if (!activeItem) return null;

  const offsetX = size.width / 2;
  const offsetY = size.height / 2;

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate(${-offsetX}px, ${-offsetY}px)`,
      }}
    />,
    document.body
  );
}
