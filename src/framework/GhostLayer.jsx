import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useDndStore } from "./dndStore";

export function GhostLayer() {
  const activeItem = useDndStore((s) => s.activeItem);
  const [position, setPosition] = useState(
    () => activeItem?.pointerPosition || { x: 0, y: 0 }
  );
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);

  // Clone and insert the ghost element
  useEffect(() => {
    if(activeItem == null) setReady(false);
    if (ready) {
      if (!activeItem?.draggedElement || !containerRef.current) {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        setSize({ width: 0, height: 0 });
        return;
      }

      const clone = activeItem.draggedElement.cloneNode(true);

      // Ghost styles
      clone.style.pointerEvents = "none";
      clone.style.opacity = "0.9";
      clone.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
      clone.style.borderRadius = "8px";
      clone.style.margin = "0";
      clone.style.userSelect = "none";

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(clone);

      // After clone is added, measure its size
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

  // Track pointer position
  useEffect(() => {
    if (!activeItem) return;

    // Set initial position from activeItem if available
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

  // Use stored size to offset the ghost and center it on the pointer
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
