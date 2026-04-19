import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useDndStore } from "./utils/dndStore";

export function GhostLayer() {
  // Subscribe only to stable identity — does NOT change on every pointermove
  const isDragging = useDndStore((s) => s.activeItem != null);
  const draggedElement = useDndStore((s) => s.activeItem?.draggedElement ?? null);
  const dragId = useDndStore((s) => s.activeItem?.id ?? null);
  // Read the initial pointer position only once per drag (for the layout effect below)
  const initialPointer = useDndStore((s) => s.activeItem?.pointerPosition ?? null);

  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fix bug 1: set position synchronously before the first paint so the ghost never
  // appears at a stale/wrong location.
  useLayoutEffect(() => {
    if (!isDragging || !initialPointer) return;
    setPosition(initialPointer);
  }, [dragId]); // eslint-disable-line react-hooks/exhaustive-deps
  // Only run when a NEW drag starts (dragId changes).
  // initialPointer is intentionally omitted — it won't change during the same drag,
  // and we don't want the layout effect to re-fire on re-renders.

  // Build the clone once per drag (when dragId or draggedElement changes).
  // Fix bug 2: this effect no longer depends on activeItem (which changed every pointermove),
  // so its cleanup does NOT run during drag — no more innerHTML wipe → no more flicker.
  useEffect(() => {
    if (!isDragging || !draggedElement || !containerRef.current) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      setSize({ width: 0, height: 0 });
      return;
    }

    const clone = draggedElement.cloneNode(true) as HTMLElement;
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

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
      setSize({ width: 0, height: 0 });
    };
  }, [isDragging, dragId, draggedElement]);

  // Track pointer movement locally — does NOT touch the store, so no re-renders elsewhere.
  useEffect(() => {
    if (!isDragging) return;

    function onPointerMove(e: PointerEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [isDragging]);

  if (!isDragging) return null;

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
