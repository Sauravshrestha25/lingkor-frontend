"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

/**
 * The house drag rail: Embla with momentum, plus focus by proximity.
 *
 * Three rails were running the same hand-rolled pointer-capture over native
 * `overflow-x` + scroll-snap. That worked, but every gesture ended by snapping to the
 * nearest card, so the motion stopped dead the instant you let go. `dragFree` is the
 * point of the swap: the rail keeps travelling under its own momentum and decelerates.
 *
 * `focus` is the index nearest the reference point, and it is not an "active slide" —
 * a card half-dragged into place is already half-lit, which an index cannot express.
 * With `dim` on, the cards are faded and scaled continuously by the same distance.
 *
 * Markup contract:
 *
 *   <div ref={emblaRef} className="overflow-hidden">
 *     <div className="flex gap-6">{cards}</div>
 *   </div>
 *
 * The outer element must clip; the inner one is the container Embla transforms. Cards
 * need `shrink-0` and a width, and no scroll-snap — Embla owns the gesture now.
 */
export function useDragRail({ dim = true }: { dim?: boolean } = {}) {
  // Was the last gesture a click, or the end of a drag? See `clickAllowed` below.
  const gesture = useRef({ x: 0, y: 0, moved: false });
  const [emblaRef, embla] = useEmblaCarousel({
    align: "center",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [focus, setFocus] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  /**
   * Distance from a reference point, read off the laid-out boxes rather than from
   * Embla's geometry: `getBoundingClientRect` already accounts for the container
   * transform, the gap and the shell padding, so there is no second model of the
   * layout to keep in sync.
   *
   * The reference travels with the scroll instead of sitting at the centre.
   * `containScroll: "trimSnaps"` stops the rail scrolling past its own content, so the
   * first card is flush left at the start and the last flush right at the end —
   * against a fixed centre neither could ever be the focal card. So:
   *
   *   progress 0    → first card's centre  (it is flush left, so this is exact)
   *   progress 0.5  → container centre
   *   progress 1    → last card's centre   (flush right, also exact)
   *
   * Mid-rail it still behaves as a plain centre metric.
   */
  const measure = useCallback(() => {
    if (!embla) return;
    const container = embla.containerNode();
    const rootRect = embla.rootNode().getBoundingClientRect();
    const first = container.firstElementChild as HTMLElement | null;
    if (!first) return;

    const cardWidth = first.getBoundingClientRect().width;
    // Clamped because dragFree lets progress overshoot slightly past either end.
    const progress = Math.min(1, Math.max(0, embla.scrollProgress()));
    const travel = Math.max(0, rootRect.width - cardWidth);
    const ref = rootRect.left + cardWidth / 2 + travel * progress;

    let best = 0;
    let bestDist = Infinity;

    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - ref);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
      if (dim) {
        const t = Math.min(1, dist / (rect.width * 1.1));
        el.style.opacity = String(1 - t * 0.55);
        el.style.transform = `scale(${1 - t * 0.04})`;
      }
    });

    setFocus(best);
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, [embla, dim]);

  useEffect(() => {
    if (!embla) return;

    // Next frame, not now. Embla has initialised by this point but the first paint has
    // not happened, so measuring synchronously reads pre-layout boxes — and setting
    // state in the effect body would cascade a second render for nothing.
    const first = requestAnimationFrame(measure);

    // `scroll` fires on every frame of the drag *and* of the momentum that follows, so
    // the dimming tracks the deceleration instead of jumping at the end.
    embla.on("scroll", measure);
    embla.on("settle", measure);
    embla.on("reInit", measure);
    return () => {
      cancelAnimationFrame(first);
      embla.off("scroll", measure);
      embla.off("settle", measure);
      embla.off("reInit", measure);
    };
  }, [embla, measure]);

  /**
   * Cards inside the rail can be links, and a drag that happens to end over one is
   * still a `click` as far as the browser is concerned — so without this, every flick
   * navigates.
   *
   * Embla v7 exposed `clickAllowed()` for exactly this; v8 dropped it from the public
   * API (`EmblaCarouselType` has no such member, and the internal `DragHandler` only
   * offers `pointerDown`), so the distance test lives here instead.
   *
   * 8px rather than 0: a real click drifts a pixel or two, and on a touchscreen rather
   * more, so an exact-zero test would swallow legitimate taps.
   */
  useEffect(() => {
    if (!embla) return;
    const root = embla.rootNode();

    const onDown = (e: PointerEvent) => {
      gesture.current = { x: e.clientX, y: e.clientY, moved: false };
    };
    const onMove = (e: PointerEvent) => {
      // `buttons` is 0 while merely hovering; only a held pointer can be a drag.
      if (!e.buttons) return;
      const { x, y } = gesture.current;
      if (Math.hypot(e.clientX - x, e.clientY - y) > 8) gesture.current.moved = true;
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
    };
  }, [embla]);

  const clickAllowed = useCallback(() => !gesture.current.moved, []);
  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  return {
    emblaRef,
    embla,
    focus,
    canScrollPrev,
    canScrollNext,
    clickAllowed,
    scrollPrev,
    scrollNext,
  };
}
