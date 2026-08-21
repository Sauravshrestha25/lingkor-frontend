"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/media/Photo";

/**
 * The photograph that follows the pointer across the menu.
 *
 * Every space's image is mounted at once and cross-faded by index, rather than swapping
 * one `src`. Swapping would hit the network on first hover of each name and the plate
 * would open empty — the whole effect is that the picture is *already there* the instant
 * the name is under the cursor.
 *
 * Position is written straight to the node on every frame. No state, no re-render: a
 * `setState` per `pointermove` would re-render all five names sixty times a second, and
 * they are the one thing on screen that must not stutter while being pointed at.
 *
 * The lag is deliberate and is the same 0.18 the drag label uses — at 1:1 the plate
 * reads as part of the cursor and stops being noticed; a little trailing makes it read
 * as an object being carried.
 *
 * Hidden entirely without a real pointer. `hover: hover and pointer: fine` is the honest
 * test: on touch this would either never appear or, worse, stick after a tap.
 */
export function MenuCursorPlate({
  images,
  active,
  open,
}: {
  /**
   * One entry per space, index-aligned with `active`.
   *
   * `src` is optional because it is optional on a space: all five currently have a
   * photograph, but CONTENT.md lists the Luri and Namkha renders as still to come, and
   * a space without one should show no plate rather than a broken frame.
   */
  images: { src?: string; alt: string }[];
  /** Index of the hovered space, or null when the pointer is on nothing. */
  active: number | null;
  open: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /*
   * Whether there is a real cursor, resolved in an effect rather than by a CSS
   * variant.
   *
   * It has to gate the *markup*, not just the styling: `pointerenter` fires on a tap,
   * so on a touch device the plate would be handed an active index and stick to the
   * screen after the finger left. Rendering nothing is the only honest answer.
   *
   * This was a Tailwind arbitrary media variant first. Two reasons it is not one now:
   * the variant could only hide the element, not stop it being handed state; and
   * Tailwind emitted the media query without spaces around its combinator, which
   * PostCSS rejects outright — one bad utility took the entire stylesheet down.
   *
   * The literal class is deliberately NOT written out anywhere in this file.
   * Tailwind scans raw source text, comments included, so spelling the broken
   * utility out in a comment *re-generates it* — the build kept failing on a
   * class that no longer existed in any markup, only in the note explaining it.
   */
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !open || !fine) return;

    const soft = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let frame = 0;

    const draw = () => {
      const ease = soft ? 0.18 : 1;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      el.style.transform = `translate3d(${Math.round(pos.x)}px, ${Math.round(
        pos.y,
      )}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    // Listening on the window, not the menu: the plate has to keep up even when the
    // pointer crosses the gaps *between* names, or it jerks to a halt on every gap.
    window.addEventListener("pointermove", onMove);
    frame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [open, fine]);

  if (!fine) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-10 aspect-[4/3] w-[22rem]"
    >
      {images.map((img, i) =>
        !img.src ? null : (
        <div
          key={img.src}
          className="absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: active === i ? 1 : 0,
            // A touch of scale on the way in, so the plate arrives rather than
            // simply switching on.
            transform: active === i ? "scale(1)" : "scale(0.94)",
          }}
        >
          <Photo
            src={img.src}
            alt=""
            /*
              A real pixel figure with headroom, not the frame's own `14rem`.
              `sizes` is what next/image picks a source width from, so quoting the
              CSS width made it serve a ~384px file that then had to cover a retina
              frame — soft on every HiDPI screen. 720 buys the 2× candidate.
            */
            sizes="720px"
            quality={90}
            className="h-full w-full"
          />
        </div>
        ),
      )}
    </div>
  );
}
