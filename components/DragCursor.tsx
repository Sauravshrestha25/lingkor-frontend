"use client";

import { useEffect, useRef } from "react";

/**
 * A small label that follows the pointer while it is over a drag rail.
 *
 * The rails have always been draggable and nothing said so — the only hint was a
 * `cursor: grab` most people never consciously read. This says it in words, at the
 * cursor, exactly when it is relevant.
 *
 * Attaches to its own parent element, so the markup contract is just: put it inside a
 * `relative` wrapper around the rail. Deliberately *outside* the rail's own
 * `overflow-hidden`, or it would be clipped the moment the pointer neared an edge.
 *
 * Position is written straight to the node — no state, no re-render. A `setState` per
 * `pointermove` would re-render every card in the rail sixty times a second, which on a
 * rail of photographs is exactly the wrong place to spend a frame.
 */
export function DragCursor({ label = "Drag" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    // Touch and pen have no hover state: the label would either never show or, worse,
    // stick after a tap. `pointer: fine` is the honest test for "there is a cursor".
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const soft = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let frame = 0;
    let inside = false;

    const draw = () => {
      // Trails the cursor slightly. At 1:1 it reads as part of the cursor and gets
      // ignored; a little lag makes it read as an object being carried along.
      const ease = soft ? 0.18 : 1;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      el.style.transform = `translate3d(${Math.round(pos.x)}px, ${Math.round(pos.y)}px, 0) translate(-50%, -50%)`;
      frame = inside ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const box = parent.getBoundingClientRect();
      target.x = e.clientX - box.left;
      target.y = e.clientY - box.top;
    };

    const onEnter = (e: PointerEvent) => {
      inside = true;
      onMove(e);
      // Start where the cursor is, so it does not fly in from the last exit point.
      pos.x = target.x;
      pos.y = target.y;
      el.style.opacity = "1";
      el.style.scale = "1";
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onLeave = () => {
      inside = false;
      el.style.opacity = "0";
      el.style.scale = "0.6";
    };

    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="text-label pointer-events-none absolute left-0 top-0 z-20 select-none rounded-full bg-ink px-4 py-2 uppercase text-canvas transition-[opacity,scale] duration-300 ease-brand"
      style={{ opacity: 0, scale: "0.6" }}
    >
      {label}
    </div>
  );
}
