"use client";

import type Lenis from "lenis";

/**
 * The one Lenis instance, reachable from anywhere that needs to move the page.
 *
 * **Why this has to exist.** Lenis keeps its own virtual scroll position and writes it
 * to the document on every frame. Anything that scrolls the page behind its back —
 * `window.scrollTo`, `element.scrollIntoView`, ScrollTrigger's `self.scroll()` — is
 * therefore undone on the next tick: the page jumps and is immediately dragged back.
 * It looks exactly like a section that refuses to let go.
 *
 * So programmatic scrolling goes through here, and anything that wants to take the
 * wheel away from Lenis for a while stops it first rather than fighting it.
 *
 * A module-level singleton rather than context: this is consumed inside GSAP callbacks
 * and Observer handlers, which are outside React's render tree entirely.
 */
let instance: Lenis | null = null;

export function registerLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/**
 * Jump the page, in a way that survives Lenis.
 *
 * `immediate` skips the easing (this is a hand-off, not a journey) and `force` lets it
 * through even while Lenis is stopped, which is the case whenever a scroll-jacked
 * section is handing control back.
 *
 * Falls back to a native scroll when Lenis is absent — which it legitimately is under
 * `prefers-reduced-motion`, where SmoothScroll never starts.
 */
export function jumpTo(y: number) {
  if (instance) {
    instance.scrollTo(y, { immediate: true, force: true });
    return;
  }
  window.scrollTo(0, y);
}

/** Hand the wheel to something else (a pinned, gesture-driven section). */
export function pauseLenis() {
  instance?.stop();
}

/** Give it back. */
export function resumeLenis() {
  instance?.start();
}
