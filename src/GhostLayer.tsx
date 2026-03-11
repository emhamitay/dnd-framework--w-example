import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useDndStore } from "./utils/dndStore";

export function GhostLayer() {
  const activeItem = useDndStore((s) => s.activeItem);

  const [position, setPosition] = useState<{ x: number; y: number }>(
    () => activeItem?.pointerPosition ?? { x: 0, y: 0 }
  );
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeItem == null) {
      setReady(false);
      return;
    }

    if (ready) {
      if (!activeItem.draggedElement || !containerRef.current) {
        if (containerRef.current) containerRef.current.innerHTML = "";
        setSize({ width: 0, height: 0 });
        return;
      }

      const clone = activeItem.draggedElement.cloneNode(true) as HTMLElement;
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
      if (containerRef.current) containerRef.current.innerHTML = "";
      setSize({ width: 0, height: 0 });
    };
  }, [activeItem, ready]);

  useEffect(() => {
    if (!activeItem) return;

    if (activeItem.pointerPosition) {
      setPosition(activeItem.pointerPosition);
    }

    function onPointerMove(e: PointerEvent) {
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
